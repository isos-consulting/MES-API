import { Transaction } from "sequelize/types";
import IPrdOrderInput from "../../interfaces/prd/order-input.interface";
import PrdOrderInputRepo from '../../repositories/prd/order-input.repository';
import PrdOrderRepo from '../../repositories/prd/order.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import StdUnitRepo from '../../repositories/std/unit.repository';
import AdmBomInputTypeRepo from '../../repositories/adm/bom-input-type.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import IPrdOrder from "../../interfaces/prd/order.interface";
import StdBomService from "../std/bom.service";

class PrdOrderInputService {
  tenant: string;
  stateTag: string;
  repo: PrdOrderInputRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'prdOrderInput';
    this.repo = new PrdOrderInputRepo(tenant);

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
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'unit',
        TRepo: StdUnitRepo,
        idName: 'unit_id',
        uuidName: 'unit_uuid'
      },
      {
        key: 'bomInputType',
        TRepo: AdmBomInputTypeRepo,
        idName: 'bom_input_type_id',
        uuidName: 'bom_input_type_uuid'
      },
      {
        key: 'store',
        TRepo: StdStoreRepo,
        idAlias: 'from_store_id',
        idName: 'store_id',
        uuidName: 'from_store_uuid'
      },
      {
        key: 'location',
        TRepo: StdLocationRepo,
        idAlias: 'from_location_id',
        idName: 'location_id',
        uuidName: 'from_location_uuid'
      }
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IPrdOrderInput[], uid: number, tran: Transaction) => {
    try { return await this.repo.create(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public createByOrder = async (data: IPrdOrder, uid: number, tran: Transaction) => {
    try {
      const bomService = new StdBomService(this.tenant);
      const bomRead = await bomService.readByParent(data.factory_id as number, data.prod_id as number);
      const inputBody: IPrdOrderInput[] = bomRead.raws.map((raw: any) => {
        return {
          factory_id: raw.factory_id,
          order_id: data.order_id,
          prod_id: raw.c_prod_id,
          c_usage: raw.c_usage,
          unit_id: raw.unit_id,
          bom_input_type_id: raw.bom_input_type_id,
          from_store_id: raw.from_store_id,
          from_location_id: raw.from_location_id
        }
      });
      
      return await this.repo.create(inputBody, uid, tran);
    } catch (error) {
      throw error;
    }
  }

  public read = async (params: any) => {
    try { return await this.repo.read(params); }
		catch (error) { throw error; }
  };
  
  public readByUuid = async (uuid: string) => {
    try { return await this.repo.readByUuid(uuid); } 
		catch (error) { throw error; }
  };

  public update = async (datas: IPrdOrderInput[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IPrdOrderInput[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  };

  public delete = async (datas: IPrdOrderInput[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public deleteByOrderIds = async (orderId: number[], uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByOrderIds(orderId, uid, tran); }
    catch (error) { throw error; }
  }

  public getVerifyInput = async (orderId: number, tran: Transaction) => {
    let verifyInput: any = {};
    const orderInputRead = await this.repo.readRawsByOrderId(orderId, tran);
    orderInputRead.raws.forEach((orderInput: any) => {
      verifyInput[orderInput.prod_id] = { 
        usage: orderInput.c_usage, 
        qty: 0, 
        bom_input_type_id: orderInput.bom_input_type_id,
        from_store_id: orderInput.from_store_id,
        from_location_id: orderInput.from_location_uuid,
        unit_id: orderInput.unit_id,
      }
    });

    return verifyInput;
  }
}

export default PrdOrderInputService;