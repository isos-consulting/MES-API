import { Transaction } from "sequelize/types";
import EqmRepairHistoryRepo from "../../repositories/eqm/repair-history.repository";
import StdEmpRepo from "../../repositories/std/emp.repository";
import StdEquipRepo from "../../repositories/std/equip.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import { errorState } from "../../states/common.state";
import createApiError from "../../utils/createApiError";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import getSubtractTwoDates from "../../utils/getSubtractTwoDates";

class EqmRepairHistoryService {
  tenant: string;
  stateTag: string;
  repo: EqmRepairHistoryRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'eqmRepairHistory';
    this.repo = new EqmRepairHistoryRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'equip',
        TRepo: StdEquipRepo,
        idName: 'equip_id',
        uuidName: 'equip_uuid'
      },
      {
        key: 'occurEmp',
        TRepo: StdEmpRepo,
        idName: 'emp_id',
        idAlias: 'occur_emp_id',
        uuidName: 'occur_emp_uuid'
      },
      {
        key: 'checkEmp',
        TRepo: StdEmpRepo,
        idName: 'emp_id',
        idAlias: 'check_emp_id',
        uuidName: 'check_emp_uuid'
      },
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

  public validateDateDiff = (datas: any[]) => {
    try {
      const result = datas.map((data: any) => {
        // 📌 발생일시 데이터 검증
        if (data.occur_start_date && data.occur_end_date) {
          const occurTime = getSubtractTwoDates(data.occur_start_date, data.occur_end_date);
          if (occurTime <= 0) { 
            throw createApiError(
              400, 
              `잘못된 발생시작일시(occur_start_date) 및 발생종료일시(occur_end_date)가 입력되었습니다. [${data.occur_start_date}, ${data.occur_end_date}]`, 
              this.stateTag, 
              errorState.INVALID_DIFF_DATE
            );
          }
        }

        // 📌 수리일시 데이터 검증
        // 📌 수리시간 데이터 초기 Setting(수리 시작일시, 종료일시가 모두 입력되지 않은경우 null로 입력)
        data.repair_time = null;
        if (data.repair_start_date && data.repair_end_date) {
          const repairTime = getSubtractTwoDates(data.repair_start_date, data.repair_end_date);

          if (repairTime <= 0) { 
            throw createApiError(
              400, 
              `잘못된 수리시작일시(repair_start_date) 및 수리종료일시(repair_end_date)가 입력되었습니다. [${data.repair_start_date}, ${data.repair_end_date}]`, 
              this.stateTag, 
              errorState.INVALID_DIFF_DATE
            );
          }
          
          data.repair_time = repairTime;
        }

        return data;
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default EqmRepairHistoryService;