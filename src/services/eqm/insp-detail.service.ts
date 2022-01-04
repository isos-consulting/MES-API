import { Transaction } from "sequelize/types";
import AdmCycleUnitRepo from "../../repositories/adm/cycle-unit.repository";
import AdmDailyInspCycleRepo from "../../repositories/adm/daily-insp-cycle.repository";
import EqmInspDetailRepo from "../../repositories/eqm/insp-detail.repository";
import EqmInspRepo from "../../repositories/eqm/insp.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdInspItemRepo from "../../repositories/std/insp-item.repository";
import StdInspMethodRepo from "../../repositories/std/insp-method.repository";
import StdInspToolRepo from "../../repositories/std/insp-tool.repository";
import { errorState } from "../../states/common.state";
import createApiError from "../../utils/createApiError";
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
   * 입력한 기준서에 해당하는 상세기준서의 개수 조회
   * @param inspId 기준서의 ID
   * @param tran DB Transaction
   * @returns 상세기준서의 개수
   */
   public getCountInInsp = async (inspId: number, tran?: Transaction) => {
    try { return await this.repo.getCountInInsp(inspId, tran); } 
    catch (error) { throw error; }
  }

  /**
   * 입력한 기준서에 해당하는 상세기준서의 Max Sequence 조회
   * @param inspId 기준서의 ID
   * @param tran DB Transaction
   * @returns Sequence
   */
   public getMaxSeq = async (inspId: number, tran?: Transaction) => {
    try { return await this.repo.getMaxSeq(inspId, tran); } 
    catch (error) { throw error; }
  }

  /**
   * 설비점검 상세기준서의 유형(정기, 일상)에 따라 필요한 Data의 여부 검증  
   * periodicity_fg: true (정기점검) [base_date, cycle_unit_id, cycle]  
   * periodicity_fg: false (일상점검) [daily_insp_cycle_id]
   * @param datas 설비점검 상세기준서 Data Array
   * @returns 검증 성공시 true, 실패시 Throw Error
   */
   public validatePeriodicity = (datas: any[]) => {
    try {
      datas.forEach((data: any) => {
        // 📌 정기점검 기준서
        if (data.periodicity_fg && !(data.base_date && data.cycle_unit_id && data.cycle)) {
          throw createApiError(
            400, 
            `설비정기점검에 필요한 요소가 입력되지 않았습니다. [base_date, cycle_unit_uuid, cycle]`, 
            this.stateTag, 
            errorState.NO_INPUT_REQUIRED_VALUE
          );
        }

        // 📌 일상점검 기준서
        if (!data.periodicity_fg && !data.daily_insp_cycle_id) {
          throw createApiError(
            400, 
            `설비일상점검에 필요한 요소가 입력되지 않았습니다. [daily_insp_cycle_uuid]`, 
            this.stateTag, 
            errorState.NO_INPUT_REQUIRED_VALUE
          );
        }
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default EqmInspDetailService;