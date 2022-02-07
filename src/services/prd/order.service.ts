import { Transaction } from "sequelize/types";
import IPrdOrder from "../../interfaces/prd/order.interface";
import PrdOrderRepo from '../../repositories/prd/order.repository';
import PrdWorkRepo from "../../repositories/prd/work.repository";
import SalOrderDetailRepo from '../../repositories/sal/order-detail.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdShiftRepo from '../../repositories/std/shift.repository';
import StdWorkerGroupRepo from '../../repositories/std/worker-group.repository';
import StdWorkingsRepo from '../../repositories/std/workings.repository';
import { errorState } from "../../states/common.state";
import createApiError from "../../utils/createApiError";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class PrdOrderService {
  tenant: string;
  stateTag: string;
  repo: PrdOrderRepo;
  workRepo: PrdWorkRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'prdOrder';
    this.repo = new PrdOrderRepo(tenant);
    this.workRepo = new PrdWorkRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'uuid',
        TRepo: PrdOrderRepo,
        idName: 'order_id',
        uuidName: 'uuid'
      },
      {
        key: 'order',
        TRepo: PrdOrderRepo,
        idName: 'order_id',
        uuidName: 'order_uuid'
      },
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'workings',
        TRepo: StdWorkingsRepo,
        idName: 'workings_id',
        uuidName: 'workings_uuid'
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'shift',
        TRepo: StdShiftRepo,
        idName: 'shift_id',
        uuidName: 'shift_uuid'
      },
      {
        key: 'worker_group',
        TRepo: StdWorkerGroupRepo,
        idName: 'worker_group_id',
        uuidName: 'worker_group_uuid'
      },
      {
        key: 'salOrderDetail',
        TRepo: SalOrderDetailRepo,
        idAlias: 'sal_order_detail_id',
        idName: 'order_detail_id',
        uuidName: 'sal_order_detail_uuid'
      }
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IPrdOrder[], uid: number, tran: Transaction) => {
    try { return await this.repo.create(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public read = async (params: any) => {
    try { return await this.repo.read(params); }
		catch (error) { throw error; }
  };
  
  public readByUuid = async (uuid: string) => {
    try { return await this.repo.readByUuid(uuid); } 
		catch (error) { throw error; }
  };

  // 📒 Fn[readWorkComparedOrder]: 지시대비실적 Read Fuction
  public readWorkComparedOrder = async (params: any) => {
    try { return await this.repo.readWorkComparedOrder(params); }
		catch (error) { throw error; }
  };

  public update = async (datas: IPrdOrder[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  // 📒 Fn[updateComplete]: 완료여부 및 완료일시 수정
  public updateComplete = async (datas: IPrdOrder[], uid: number, tran: Transaction) => {
    try { return await this.repo.updateComplete(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  // 📒 Fn[updateWorkFgById]: 생산진행여부 수정 Function
  public updateWorkFgById = async (id: number, workFg: boolean, uid: number, tran: Transaction) => {
    try { return await this.repo.updateWorkFgById(id, workFg, uid, tran); } 
		catch (error) { throw error; }
  };

  // 📌 실적기준 지시 완료처리(work_fg)
  public updateOrderCompleteByWorks = async (orderId: number, uid: number, tran: Transaction) => {
    try {
      const orderService = new PrdOrderService(this.tenant);
      const incompleteWorkCount = await this.workRepo.getIncompleteCount(orderId, tran);

      return await orderService.updateWorkFgById(orderId, Boolean(incompleteWorkCount), uid, tran);
    } catch (error) {
      throw error;
    }
  }

  // 📒 Fn[updateWorkerGroup]: 작업조 수정
  public updateWorkerGroup = async (datas: IPrdOrder[], uid: number, tran: Transaction) => {
    try { return await this.repo.updateWorkerGroup(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IPrdOrder[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  };

  public delete = async (datas: IPrdOrder[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public validateUpdateByWork = async(params: any[]) => {
    const uuids: string[] = [];

    // 📌 실적이 저장된 경우 수정되면 안되는 데이터를 수정 할 때의 Interlock
    params.forEach((param: any) => {
      if (Object.keys(param).includes('order_no' || 'workings_id' || 'equip_id' || 'qty' || 'seq' || 'shift_id')) {
        uuids.push(param.order_uuid);
      }
    });
    const workRead = await this.workRepo.readByOrderUuids(uuids);
    if (workRead.raws[0]) { 
      throw createApiError(
        400, 
        `지시번호 [${workRead.raws[0].order_uuid}]의 생산실적이 이미 등록되어 있습니다.`, 
        this.stateTag, 
        errorState.FAILED_SAVE_TO_RELATED_DATA
      );
    }
  }

  // 📌 생산실적이 진행 중일 경우 완료여부 true 로 변경 불가 Interlock
  public validateUpdateComplete = async(params: any[]) => {
    for await (const param of params) {
      // 📌 완료여부를 false(마감 취소)로 수정 할 경우 Interlock 없음
      if (!param.complete_fg) { continue; }

      // 📌 완료일시를 입력하지 않았을 경우 현재일시로 입력
      if (!param.complete_date) { param.complete_date = new Date(); }

      await this.validateIsOngoingWork([param.uuid]);
    }
  }

  // 📌 작업지시대비 생산실적이 진행 중인 경우 Interlock
  public validateIsOngoingWork = async(uuids: string[]) => {
    const orderRead = await this.repo.readRawsByUuids(uuids);
    orderRead.raws.forEach((order: any) => {
      if (order.work_fg) {
        throw createApiError(
          400, 
          `지시번호 [${order.uuid}]의 생산실적이 진행중입니다.`, 
          this.stateTag, 
          errorState.FAILED_SAVE_TO_RELATED_DATA
        );
      }
    });
  }

  // 📌 작업지시가 완료상태인 경우 Interlock
  public validateIsCompleted = async(uuids: string[]) => {
    const orderRead = await this.repo.readRawsByUuids(uuids);
    orderRead.raws.forEach((order: any) => {
      if (order.comlete_fg) { 
        throw createApiError(
          400, 
          `지시번호 [${order.uuid}]는 완료 상태입니다.`, 
          this.stateTag, 
          errorState.FAILED_SAVE_TO_RELATED_DATA
        );
      }
    });
  }

}

export default PrdOrderService;