import { Transaction } from "sequelize/types";
import IPrdWorkWorker from "../../interfaces/prd/work-worker.interface";
import PrdWorkRepo from '../../repositories/prd/work.repository';
import PrdWorkWorkerRepo from "../../repositories/prd/work-worker.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdEmpRepo from '../../repositories/std/emp.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import getSubtractTwoDates from "../../utils/getSubtractTwoDates";
import createApiError from "../../utils/createApiError";
import { errorState } from "../../states/common.state";
import IPrdWork from "../../interfaces/prd/work.interface";
import PrdOrderWorkerRepo from "../../repositories/prd/order-worker.repository";
import PrdWorkRoutingRepo from "../../repositories/prd/work-routing.repository";

class PrdWorkWorkerService {
  tenant: string;
  stateTag: string;
  repo: PrdWorkWorkerRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'prdWorkWorker';
    this.repo = new PrdWorkWorkerRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'work',
        TRepo: PrdWorkRepo,
        idName: 'work_id',
        uuidName: 'work_uuid'
      },
      {
        key: 'work_routing',
        TRepo: PrdWorkRoutingRepo,
        idName: 'work_routing_id',
        uuidName: 'work_routing_uuid'
      },
      {
        key: 'emp',
        TRepo: StdEmpRepo,
        idName: 'emp_id',
        uuidName: 'emp_uuid'
      },
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IPrdWorkWorker[], uid: number, tran: Transaction) => {
    try { return await this.repo.create(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public createByOrderWorker = async (data: IPrdWork, uid: number, tran: Transaction) => {
    try {
      const orderWorkerRepo = new PrdOrderWorkerRepo(this.tenant);
      const orderWorkerRead = await orderWorkerRepo.readRawsByOrderId(data.order_id as number, tran);
      const workerBody: IPrdWorkWorker[] = orderWorkerRead.raws.map((orderWorker: any) => {
        return {
          factory_id: orderWorker.factory_id,
          work_id: data.work_id,
          emp_id: orderWorker.emp_id
        };
      });
      return await this.repo.create(workerBody, uid, tran); }
		catch (error) { 
      throw error; 
    }
  };

  public read = async (params: any) => {
    try { return await this.repo.read(params); }
		catch (error) { throw error; }
  };
  
  public readByUuid = async (uuid: string) => {
    try { return await this.repo.readByUuid(uuid); } 
		catch (error) { throw error; }
  };

  public update = async (datas: IPrdWorkWorker[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IPrdWorkWorker[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  };

  public delete = async (datas: IPrdWorkWorker[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public deleteByWorkId = async (workId: number, uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByWorkId(workId, uid, tran); }
    catch (error) { throw error; }
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
              `잘못된 작업시작일시(start_date) 및 작업종료일시(end_date)가 입력되었습니다. [${data.start_date}, ${data.end_date}]`, 
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

export default PrdWorkWorkerService;