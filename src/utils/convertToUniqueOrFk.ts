
/**
 * sequelize ORM 의 Model Attributes 를 
 * { unique: unique key, fk: Foreign Key } 형태로 변환
 * @param _raws Attributes
 * @returns { unique: [], fk: [] ,notNull: []}
 */
const convertToUniqueOrFk = (_raws: any) => {
  if (!_raws) { _raws = {}; }

	let result: any = { unique: [], fk: [] ,notNull: [], columns: []};

	if (_raws['uuid']) {delete _raws['uuid']}
	if (_raws['created_at']) {delete _raws['created_at']}
	if (_raws['created_uid']) {delete _raws['created_uid']}
	if (_raws['updated_at']) {delete _raws['updated_at']}
	if (_raws['updated_uid']) {delete _raws['updated_uid']}

	// const keys = Object.keys(_raws).filter((key: string) => {
	// 	return !(key === 'uuid' || key === 'created_at' || key === 'created_uid' || key === 'updated_at' || key === 'updated_uid')
	// })

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