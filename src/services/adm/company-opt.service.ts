import { Transaction } from "sequelize/types";
import AdmCompanyOptRepo from "../../repositories/adm/company-opt.repository";
import { errorState } from "../../states/common.state";
import createApiError from "../../utils/createApiError";

class AdmCompanyOptService {
  tenant: string;
  stateTag: string;
  repo: AdmCompanyOptRepo;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'admCompanyOpt';
    this.repo = new AdmCompanyOptRepo(tenant);
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

  public getCompanyOptValue = async (companyOpt: string, tran?: Transaction) => {
    try {
      const value = await (await this.repo.read({ company_opt_cd: companyOpt })).raws[0];
      if (!value) {
        throw createApiError(
          400,
          {
            admin_message: `유효하지 않은 회사옵션입니다. [${companyOpt}]`,
            user_message: `회사옵션 정보가 존재하지 않습니다`
          },
          this.stateTag,
          errorState.INVALID_DATA
        );
      }
      
      return value.val;
    } catch (error) {
      throw error;
    }
  }
}

export default AdmCompanyOptService;