import { Transaction } from "sequelize/types";
import IPrdOrderRouting from "../../interfaces/prd/order-routing.interface";
import PrdOrderRepo from '../../repositories/prd/order.repository';
import PrdOrderRoutingRepo from "../../repositories/prd/order-routing.repository";
import StdEquipRepo from '../../repositories/std/equip.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdProcRepo from '../../repositories/std/proc.repository';
import StdWorkingsRepo from '../../repositories/std/workings.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import StdRoutingService from "../std/routing.service";
import IPrdOrder from "../../interfaces/prd/order.interface";
import MldMoldRepo from "../../repositories/mld/mold.repository";

class PrdOrderRoutingService {
  tenant: string;
  stateTag: string;
  repo: PrdOrderRoutingRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'prdOrderRouting';
    this.repo = new PrdOrderRoutingRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'order',
        TRepo: PrdOrderRepo,
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

  public create = async (datas: IPrdOrderRouting[], uid: number, tran: Transaction) => {
    try { return await this.repo.create(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public createByOrder = async (data: IPrdOrder, uid: number, tran: Transaction) => {
    try { 
      const routingService = new StdRoutingService(this.tenant);
      const routingParams = { factory_id : data.factory_id, prod_id: data.prod_id };
      const routingRead = await routingService.readOptionallyMove(routingParams);
      const routingBody: IPrdOrderRouting[] = routingRead.raws.map((raw: any) => {
        return {
          factory_id: raw.factory_id,
          order_id: data.order_id,
          proc_id: raw.proc_id,
          proc_no: raw.proc_no,
          workings_id: data.workings_id,
          equip_id: raw.equip_id,
          prd_signal_cnt: raw.prd_signal_cnt
        }
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

  public update = async (datas: IPrdOrderRouting[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IPrdOrderRouting[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  };

  public delete = async (datas: IPrdOrderRouting[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public deleteByOrderIds = async (orderId: number[], uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByOrderIds(orderId, uid, tran); }
    catch (error) { throw error; }
  }
}

export default PrdOrderRoutingService;