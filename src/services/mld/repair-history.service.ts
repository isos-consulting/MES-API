import { Transaction } from "sequelize/types";
import MldMoldRepo from "../../repositories/mld/mold.repository";
import MldProblemRepo from "../../repositories/mld/problem.repository";
import MldRepairHistoryRepo from "../../repositories/mld/repair-history.repository";
import StdEmpRepo from "../../repositories/std/emp.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdProdRepo from "../../repositories/std/prod.repository";
import { errorState, successState } from "../../states/common.state";
import createApiError from "../../utils/createApiError";
import createApiResult from "../../utils/createApiResult";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import getSubtractTwoDates from "../../utils/getSubtractTwoDates";

class MldRepairHistoryService {
  tenant: string;
  stateTag: string;
  repo: MldRepairHistoryRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'mldRepairHistory';
    this.repo = new MldRepairHistoryRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'mold',
        TRepo: MldMoldRepo,
        idName: 'mold_id',
        uuidName: 'mold_uuid'
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'problem',
        TRepo: MldProblemRepo,
        idName: 'problem_id',
        uuidName: 'problem_uuid'
      },
      {
        key: 'occurEmp',
        TRepo: StdEmpRepo,
        idName: 'emp_id',
        idAlias: 'occur_emp_id',
        uuidName: 'occur_emp_uuid'
      },
      {
        key: 'repairEmp',
        TRepo: StdEmpRepo,
        idName: 'emp_id',
        idAlias: 'repair_emp_id',
        uuidName: 'repair_emp_uuid'
      },
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

  public validateDateDiff = (datas: any[]) => {
    try {
      const result = datas.map((data: any) => {
        // 📌 발생일시 데이터 검증
        if (data.start_date && data.end_date) {
          const occurTime = getSubtractTwoDates(data.start_date, data.end_date);
          if (occurTime < 0) { 
            throw createApiError(
              400, 
              `잘못된 수리시작일시(start_date) 및 수리완료일시(end_date)가 입력되었습니다. [${data.start_date}, ${data.end_date}]`, 
              this.stateTag, 
              errorState.INVALID_DIFF_DATE
            );
          }
        }
        return data;
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default MldRepairHistoryService;