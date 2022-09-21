import TColumnType from "../types/column-type.type";
import { TDateType } from "../types/date-type.type";
import isBoolean from "./isBoolean";
import { isDate } from "./isDateFormat";
import isNumber from "./isNumber";

const checkExcelValidator = async(checkData: any, excelFormColumns: any, repo: any, tenant: string) => {
	//NotEmpty check
	checkData = notEmptyCheck(checkData, excelFormColumns.notNull);

	//Duplication check
	checkData = await duplicationCheck(checkData, excelFormColumns.unique, repo, tenant);

	checkData = typeCheck(checkData, excelFormColumns.columns);
	
  return checkData;
}

//NotEmpty check
function notEmptyCheck(datas:any[], notNull:any) {
	try { 	
		notNull.forEach((value: any) => {
			datas.forEach((data: any) => {
				if ( data[value['excel_form_column_cd']] === undefined || data[value['excel_form_column_cd']] === null ) {
					data.error.push(`${value['excel_form_column_nm']} 빈 값 입니다.`) 
				} 
			})
		});
	
		return datas;
	}
	catch (error) { throw error; }
};

//Duplication check
async function duplicationCheck(datas:any[], unique:string[], repo:any, tenant: string) {
	try { 
		const copyDatas = [...datas]
		let read: { count: 0, raws: [] }
		
		unique.forEach((value:string) => {
			datas.forEach((data: any, index:number) => {
				const findResult = copyDatas.find((element: any, copyIndex: number) => element[value] === data[value] && copyIndex !== index)
				if (findResult) {data.error.push(`${value} 중복입니다.`) };
			})
		});

		for await (const value of unique) {
			let setUniqueData = datas.map((data) => data[value] );
			setUniqueData = [...new Set(setUniqueData)];
			read = await new repo(tenant).readRawByUniqueArray(setUniqueData);
			
			if (read.count > 0) {
				datas.forEach((data: any) => {
					const findResult = read.raws.find((element: any) => element[value] === data[value])
					if (findResult) {data.error.push(`${data[value]} 저장된 데이터 입니다.`) };
				})
			}
		}

		return datas;
	}
	catch (error) { throw error; }
};

// todo create type check method
function typeCheck(datas:any[], columns: any[]) {
	datas.forEach((data: any) => {
		columns.forEach((column: any) => {
			const value = data[column.excel_form_column_cd];
			
			if (value !== undefined && value !== null) {
				let checkTypeMethod: (value: any) => boolean;
				switch (column.excel_form_type) {
					case TColumnType.BOOLEAN:
						checkTypeMethod = isBoolean;
						break;

					case TColumnType.DATE:
						checkTypeMethod = (value: any) => {
							return isDate(value, TDateType.DATE);
						};
						break;

					case TColumnType.DATE_TIME:
						checkTypeMethod = (value: any) => {
							return isDate(value, TDateType.DATE_TIME);
						};
						break;

					case TColumnType.TIME:
						checkTypeMethod = (value: any) => {
							return isDate(value, TDateType.TIME);
						};
						break;

					case TColumnType.NUMBER:
						checkTypeMethod = isNumber

					default:
						checkTypeMethod = (value: any) => {
							return true;
						}
				}
				
				if (!checkTypeMethod(value)) {
					data.error.push(`${column['excel_form_column_nm']} 형식에 맞지 않는 값 입니다.`)
				}
			}
		});
	});

	return datas;
}

export default checkExcelValidator;