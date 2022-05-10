import { Transaction } from "sequelize/types";
import AdmInspDetailTypeRepo from "../../repositories/adm/insp-detail-type.repository";
import AdmInspTypeRepo from "../../repositories/adm/insp-type.repository";
import { errorState } from "../../states/common.state";
import TInspDetailType from "../../types/insp-detail-type.type";
import createApiError from "../../utils/createApiError";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

// Controller에서 해야하는 일은 Data를 정제하는 일을 한다.
// Service는 정제된 Data를 받아 일정하게 비즈니스로직을 처리하는 일을 한다.

class AdmInspDetailTypeService {
  tenant: string;
  stateTag: string;
  repo: AdmInspDetailTypeRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'admInspDetailType';
    this.repo = new AdmInspDetailTypeRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'insp_type',
        TRepo: AdmInspTypeRepo,
        idName: 'insp_type_id',
        uuidName: 'insp_type_uuid'
      }
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
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
   public getIdByCd = async (inspDetailTypeCd: TInspDetailType) => {
    try { 
      const read = await this.repo.readRawByUnique({ insp_detail_type_cd: inspDetailTypeCd });
      if (read.count === 0) {
        throw createApiError(
          400, 
          {
            admin_message: `일치하는 검사상세유형이 없습니다. [검사상세유형: ${inspDetailTypeCd}]`,
            user_message: '검사상세 유형정보가 존재하지 않습니다.'
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

export default AdmInspDetailTypeService;