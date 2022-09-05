import { Transaction } from "sequelize/types";
import IPrdWorkRoutingOrigin from '../../interfaces/prd/work-routing-origin.interface';
import PrdWorkRepo from '../../repositories/prd/work.repository';
import PrdWorkRoutingOriginRepo from "../../repositories/prd/work-routing-origin.repository";
import StdEquipRepo from '../../repositories/std/equip.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdProcRepo from '../../repositories/std/proc.repository';
import StdWorkingsRepo from '../../repositories/std/workings.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import IPrdWork from "../../interfaces/prd/work.interface";
import PrdOrderRoutingRepo from "../../repositories/prd/order-routing.repository";
import MldMoldRepo from "../../repositories/mld/mold.repository";
import getSubtractTwoDates from "../../utils/getSubtractTwoDates";
import createApiError from "../../utils/createApiError";
import { errorState } from "../../states/common.state";

class PrdWorkRoutingOriginService {
  tenant: string;
  stateTag: string;
  repo: PrdWorkRoutingOriginRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'prdWorkRoutingOrigin';
    this.repo = new PrdWorkRoutingOriginRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'order',
        TRepo: PrdWorkRepo,
        idName: 'order_id',
        uuidName: 'order_uuid'
      },
      {
        key: 'proc',
        TRepo: StdProcRepo,
        idName: 'proc_id',
        uuidName: 'proc_uuid'
      },
      {
        key: 'workings',
        TRepo: StdWorkingsRepo,
        idName: 'workings_id',
        uuidName: 'workings_uuid'
      },
      {
        key: 'equip',
        TRepo: StdEquipRepo,
        idName: 'equip_id',
        uuidName: 'equip_uuid'
      },
      {
        key: 'mold',
        TRepo: MldMoldRepo,
        idName: 'mold_id',
        uuidName: 'mold_uuid'
      }
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IPrdWorkRoutingOrigin[], uid: number, tran: Transaction) => {
    try { return await this.repo.create(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public createByOrderRouting = async (data: IPrdWork, uid: number, tran: Transaction) => {
    try { 
      const orderRoutingRepo = new PrdOrderRoutingRepo(this.tenant);
      const orderRoutingRead = await orderRoutingRepo.readRawsByOrderId(data.order_id as number, tran);
      const routingBody: IPrdWorkRoutingOrigin[] = orderRoutingRead.raws.map((orderRouting: any) => {
        return {
          factory_id: orderRouting.factory_id,
          work_id: data.work_id,
          proc_id: orderRouting.proc_id,
          proc_no: orderRouting.proc_no,
          workings_id: orderRouting.workings_id,
          equip_id: orderRouting.equip_id,
          prd_signal_cnt: orderRouting.prd_signal_cnt
        };
      });

      return await this.repo.create(routingBody, uid, tran); 
    }
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

  public update = async (datas: IPrdWorkRoutingOrigin[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IPrdWorkRoutingOrigin[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  };

  public delete = async (datas: IPrdWorkRoutingOrigin[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public deleteByWorkId = async (workId: number, uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByWorkId(workId, uid, tran); }
    catch (error) { throw error; }
  };

	public validateDateDiff = (datas: any[]) => {
    try {
      const result = datas.map((data: any) => {
        // 📌 발생일시 데이터 검증
        if (data.start_date && data.end_date) {
          const occurTime = getSubtractTwoDates(data.start_date, data.end_date);
          if (occurTime < 0) { 
            throw createApiError(
              400, 
              {
                admin_message: `잘못된 작업시작일시(start_date) 및 작업종료일시(end_date)가 입력되었습니다. [${data.start_date}, ${data.end_date}]`, 
                user_message: `잘못된 작업시작일시(${data.start_date}) 및 작업종료일시(${data.end_date})가 입력되었습니다.`
              }, 
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

  public startWork = (uuid: string, uid: number, tran: Transaction) => {
    // const workRoutingService = new PrdWorkRoutingService(this.tenant);

  }

}

export default PrdWorkRoutingOriginService;