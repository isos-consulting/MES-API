import { Transaction } from "sequelize/types";
import AdmDemandTypeRepo from "../../repositories/adm/demand-type.repository";
import { errorState } from "../../states/common.state";
import TDemandType from "../../types/demand-type.type";
import createApiError from "../../utils/createApiError";

class AdmDemandTypeService {
  tenant: string;
  stateTag: string;
  repo: AdmDemandTypeRepo;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'admDemandType';
    this.repo = new AdmDemandTypeRepo(tenant);
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
  
  /**
   * 입력한 자재출고요청 유형코드에 해당하는 자재출고요청 유형ID를 조회한다.
   * @param demandTypeCd 자재출고요청 유형코드
   * @returns 자재출고요청 유형ID / 일치하는 유형이 없을경우 Error Throw
   */
  public getIdByCd = async (demandTypeCd: TDemandType) => {
    try { 
      const read = await this.repo.readRawByUnique({ demand_type_cd: demandTypeCd });
      if (read.count === 0) {
        throw createApiError(
          400, 
          `일치하는 자재출고요청 유형이 없습니다. [자재출고요청 유형: ${demandTypeCd}]`, 
          this.stateTag, 
          errorState.NO_DATA
        );
      }
      return read.raws[0].demand_type_id as number;
    } 
		catch (error) { throw error; }
  }
}

export default AdmDemandTypeService;