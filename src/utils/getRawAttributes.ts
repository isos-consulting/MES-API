import { cloneDeep } from "lodash";
import { Repository } from "sequelize-typescript";

const getRawAttributes = <M> (repo: Repository<M>) => {
  const repoAttributes = repo.rawAttributes;
  return cloneDeep(repoAttributes)
}

export default getRawAttributes;