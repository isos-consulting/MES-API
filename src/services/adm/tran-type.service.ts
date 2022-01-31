import { Transaction } from "sequelize/types";
import AdmTranTypeRepo from "../../repositories/adm/tran-type.repository";
import { errorState } from "../../states/common.state";
import TTranType from "../../types/tran-type.type";
import createApiError from "../../utils/createApiError";

class AdmTranTypeService {
  tenant: string;
  stateTag: string;
  repo: AdmTranTypeRepo;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'admTranType';
    this.repo = new AdmTranTypeRepo(tenant);
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
   * 입력한 수불유형코드에 해당하는 수불유형ID를 조회한다.
   * @param tranTypeCd 수불유형코드
   * @returns 수불유형ID / 일치하는 유형이 없을경우 Error Throw
   */
  public getIdByCd = async (tranTypeCd: TTranType) => {
    try { 
      const read = await this.repo.readRawByUnique({ tran_type_cd: tranTypeCd });
      if (read.count === 0) {
        throw createApiError(
          400, 
          `일치하는 수불유형이 없습니다. [수불유형: ${tranTypeCd}]`, 
          this.stateTag, 
          errorState.NO_DATA
        );
      }
      return read.raws[0].tran_type_id as number;
    } 
		catch (error) { throw error; }
  }
}

export default AdmTranTypeService;