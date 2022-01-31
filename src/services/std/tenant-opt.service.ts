import { Transaction } from "sequelize/types";
import StdTenantOptRepo from "../../repositories/std/tenant-opt.repository";
import { errorState } from "../../states/common.state";
import TTenantOpt from "../../types/tenant-opt.type";
import createApiError from "../../utils/createApiError";

class StdTenantOptService {
  tenant: string;
  stateTag: string;
  repo: StdTenantOptRepo;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'stdTenantOpt';
    this.repo = new StdTenantOptRepo(tenant);
  }

  public create = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.create(datas, uid, tran); } 
		catch (error) { throw error; }
  }

  public read = async (params: any) => {
    try { return await this.repo.read(params); } 
		catch (error) { throw error; }
  };
  
  public readByUuid = async (uuid: string) => {
    try { return await this.repo.readByUuid(uuid); } 
		catch (error) { throw error; }
  };

  public update = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  }

  public patch = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran); } 
		catch (error) { throw error; }
  }

  public delete = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); } 
		catch (error) { throw error; }
  }

  public getTenantOptValue = async (tenantOpt: TTenantOpt, tran?: Transaction) => {
    const option = await (await this.repo.read({ tenant_opt_cd: tenantOpt })).raws[0];
    if (!option) {
      throw createApiError(
        400, 
        `유효하지 않은 사용자정의옵션입니다. [${tenantOpt}]`, 
        this.stateTag, 
        errorState.INVALID_DATA
      );
    }

    return option.value;
  }
}

export default StdTenantOptService;