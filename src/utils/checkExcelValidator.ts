


const checkExcelValidator = async(checkData: any, Unique: any, TReop: any) => {
	
	console.log(Unique)

	checkData.forEach((data: any) => {
			data.error = [];
	});

	//NotEmpty check
	checkData = notEmptyCheck(checkData, Unique);

	//Duplication check
	checkData = await duplicationCheck(checkData, Unique, TReop);
	console.log(checkData)
  return checkData;
}

function notEmptyCheck(datas:any[], unique:any) {
	
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


async function duplicationCheck(datas:any[], unique:any, repo:any) {
	
	const copyDatas = [...datas]
	let read: { count: 0, raws: [] }
	
	unique.unique.forEach((value:string) => {
		datas.forEach((data: any, index:number) => {
			const findResult = copyDatas.find((element: any, copyIndex: number) => element[value] === data[value] && copyIndex !== index)
			if (findResult) {data.error.push(`${value} 중복입니다.`) };
		})
	});

	unique.fk.forEach(async (value:string) => {
		let setUniqueData = datas.map((data) => data[value]);
		setUniqueData = [...new Set(setUniqueData)];

		read = await new repo.readRawByUniqueArray(setUniqueData);

		if (read.count > 0) {
			datas.forEach((data: any) => {
				const findResult = read.raws.find((element: any) => element[value] === data[value])
				if (findResult) {data.error.push(`${data[value]} 저장된 데이터 입니다.`) };
			})
		}
	});

	return datas;
}

export default checkExcelValidator;