import { Transaction } from "sequelize/types";
import AdmCycleUnitRepo from "../../repositories/adm/cycle-unit.repository";
import AdmDailyInspCycleRepo from "../../repositories/adm/daily-insp-cycle.repository";
import EqmInspDetailRepo from "../../repositories/eqm/insp-detail.repository";
import EqmInspRepo from "../../repositories/eqm/insp.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdInspItemRepo from "../../repositories/std/insp-item.repository";
import StdInspMethodRepo from "../../repositories/std/insp-method.repository";
import StdInspToolRepo from "../../repositories/std/insp-tool.repository";
import { successState } from "../../states/common.state";
import createApiResult from "../../utils/createApiResult";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class EqmInspDetailService {
  tenant: string;
  stateTag: string;
  repo: EqmInspDetailRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'eqmInspDetail';
    this.repo = new EqmInspDetailRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'insp',
        TRepo: EqmInspRepo,
        idName: 'insp_id',
        uuidName: 'insp_uuid'
      },
      {
        key: 'inspItem',
        TRepo: StdInspItemRepo,
        idName: 'insp_item_id',
        uuidName: 'insp_item_uuid'
      },
      {
        key: 'inspTool',
        TRepo: StdInspToolRepo,
        idName: 'insp_tool_id',
        uuidName: 'insp_tool_uuid'
      },
      {
        key: 'inspMethod',
        TRepo: StdInspMethodRepo,
        idName: 'insp_method_id',
        uuidName: 'insp_method_uuid'
      },
      {
        key: 'dailyInspCycle',
        TRepo: AdmDailyInspCycleRepo,
        idName: 'daily_insp_cycle_id',
        uuidName: 'daily_insp_cycle_uuid'
      },
      {
        key: 'cycleUnit',
        TRepo: AdmCycleUnitRepo,
        idName: 'cycle_unit_id',
        uuidName: 'cycle_unit_uuid'
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

export default EqmInspDetailService;