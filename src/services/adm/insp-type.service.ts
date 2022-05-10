import { Transaction } from "sequelize/types";
import AdmInspTypeRepo from "../../repositories/adm/insp-type.repository";
import { errorState } from "../../states/common.state";
import TInspType from "../../types/insp-type.type";
import createApiError from "../../utils/createApiError";

class AdmInspTypeService {
  tenant: string;
  stateTag: string;
  repo: AdmInspTypeRepo;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'admInspType';
    this.repo = new AdmInspTypeRepo(tenant);
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

  public readRawById = async (id: number) => {
    try { return await this.repo.readRawById(id); } 
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
   * 입력한 검사유형코드에 해당하는 검사유형ID를 조회한다.
   * @param inspTypeCd 검사유형코드
   * @returns 검사유형ID / 일치하는 유형이 없을경우 Error Throw
   */
  public getIdByCd = async (inspTypeCd: TInspType) => {
    try { 
      const read = await this.repo.readRawByUnique({ insp_type_cd: inspTypeCd });
      if (read.count === 0) {
        throw createApiError(
          400, 
          {
            admin_message: `일치하는 검사유형이 없습니다. [검사유형: ${inspTypeCd}]`,
            user_message: '검사유형정보가 존재하지 않습니다.'
          }, 
          this.stateTag, 
          errorState.NO_DATA
        );
      }
      return read.raws[0].insp_type_id as number;
    } 
		catch (error) { throw error; }
  }
}

export default AdmInspTypeService;