


const checkExcelValidator = async(checkData: any, Unique: any, TReop: any, tenant: string) => {
	
	console.log(Unique)

	checkData.forEach((data: any) => {
			data.error = [];
	});

	//NotEmpty check
	checkData = notEmptyCheck(checkData, Unique);

	//Duplication check
	checkData = await duplicationCheck(checkData, Unique.unique, TReop, tenant);

	console.log(checkData)
  return checkData;
}

//NotEmpty check
function notEmptyCheck(datas:any[], unique:any) {
	try { 	
		unique.notNull.forEach((value:string) => {
			datas.forEach((data: any) => {
				if ( data[value] === undefined || data[value] === null ) {
					data.error.push(`${value} 빈값입니다.`) 
				}
			})
		});

		unique.fk.forEach((value:string) => {
			datas.forEach((data: any) => {
				if ( data[value] === undefined || data[value] === null ) {
					data.error.push(`${value} 빈값입니다.`) 
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

export default checkExcelValidator;