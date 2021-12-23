import { Transaction } from "sequelize/types";
import AdmInspDetailTypeRepo from "../../repositories/adm/insp-detail-type.repository";
import AdmInspTypeRepo from "../../repositories/adm/insp-type.repository";
import { successState } from "../../states/common.state";
import createApiResult from "../../utils/createApiResult";
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
    try {
      const result = await this.repo.create(datas, uid, tran);
      return createApiResult(result, 201, '데이터 생성 성공', this.stateTag, successState.CREATE);
    } catch (error) {
      throw error;
    }
  }

  public read = async (params: any) => {
    try {
      const result = await this.repo.read(params);
      return createApiResult(result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      throw error;
    }
  };
  
  public readByUuid = async (uuid: string) => {
    try {
      const result = await this.repo.readByUuid(uuid);
      return createApiResult(result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      throw error;
    }
  };

  public update = async (datas: any[], uid: number, tran: Transaction) => {
    try {
      const result = await this.repo.update(datas, uid, tran);
      return createApiResult(result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      throw error;
    }
  }

  public patch = async (datas: any[], uid: number, tran: Transaction) => {
    try {
      const result = await this.repo.patch(datas, uid, tran);
      return createApiResult(result, 200, '데이터 수정 성공', this.stateTag, successState.PATCH);
    } catch (error) {
      throw error;
    }
  }

  public delete = async (datas: any[], uid: number, tran: Transaction) => {
    try {
      const result = await this.repo.delete(datas, uid, tran);
      return createApiResult(result, 200, '데이터 삭제 성공', this.stateTag, successState.DELETE);
    } catch (error) {
      throw error;
    }
  }
}

export default AdmInspDetailTypeService;