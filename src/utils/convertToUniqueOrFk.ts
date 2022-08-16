
/**
 * sequelize ORM 의 Model Attributes 를 
 * { unique: unique key, fk: Foreign Key } 형태로 변환
 * @param _raws Attributes
 * @returns { unique: [], fk: [] }
 */
const convertToUniqueOrFk = (_raws: any) => {
  if (!_raws) { _raws = {}; }

	let result: any = { unique: [], fk: [] };

	if (_raws['uuid']) {delete _raws['uuid']}
	if (_raws['created_uid']) {delete _raws['created_uid']}
	if (_raws['updated_uid']) {delete _raws['updated_uid']}

  Object.keys(_raws).forEach((key: string)=> { 
		if (_raws[key].unique !== undefined ) {
			result.unique.push(key)
		}

		if (_raws[key].references !== undefined ) {
			result.fk.push(key)
		}
	});

  return result;
};

export default convertToUniqueOrFk;