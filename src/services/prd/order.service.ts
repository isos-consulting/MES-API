import { Transaction } from "sequelize/types";
import IPrdOrder from "../../interfaces/prd/order.interface";
import PrdOrderRepo from '../../repositories/prd/order.repository';
import SalOrderDetailRepo from '../../repositories/sal/order-detail.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdShiftRepo from '../../repositories/std/shift.repository';
import StdWorkerGroupRepo from '../../repositories/std/worker-group.repository';
import StdWorkingsRepo from '../../repositories/std/workings.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class prdOrderService {
  tenant: string;
  stateTag: string;
  repo: PrdOrderRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'prdOrder';
    this.repo = new PrdOrderRepo(tenant);

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
}

export default prdOrderService;