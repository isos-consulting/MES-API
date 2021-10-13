import { Repository } from "sequelize-typescript";

const getPreviousRaws = async (_datas: any[], _repository: Repository<any>) => {
  const uuids = _datas.map((data) => { return data?.uuid; });
  return await _repository.findAll({ where: { uuid: uuids as string[] }});
}

export default getPreviousRaws;