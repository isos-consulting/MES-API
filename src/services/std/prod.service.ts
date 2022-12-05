import { Transaction } from "sequelize/types";
import StdItemTypeRepo from '../../repositories/std/item-type.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdModelRepo from '../../repositories/std/model.repository';
import StdProdTypeRepo from '../../repositories/std/prod-type.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import StdUnitRepo from '../../repositories/std/unit.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class StdProdService {
  tenant: string;
  stateTag: string;
  repo: StdProdRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'stdProd';
    this.repo = new StdProdRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'itemType',
        TRepo: StdItemTypeRepo,
        idName: 'item_type_id',
        uuidName: 'item_type_uuid'
      },
      {
        key: 'prodType',
        TRepo: StdProdTypeRepo,
        idName: 'prod_type_id',
        uuidName: 'prod_type_uuid'
      },
      {
        key: 'model',
        TRepo: StdModelRepo,
        idName: 'model_id',
        uuidName: 'model_uuid'
      },
      {
        key: 'unit',
        TRepo: StdUnitRepo,
        idName: 'unit_id',
        uuidName: 'unit_uuid'
      },
      {
        key: 'matUnit',
        TRepo: StdUnitRepo,
        idName: 'unit_id',
        idAlias: 'mat_unit_id',
        uuidName: 'mat_unit_uuid'
      },
      {
        key: 'store',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        idAlias: 'inv_to_store_id',
        uuidName: 'inv_to_store_uuid'
      },
      {
        key: 'location',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        idAlias: 'inv_to_location_id',
        uuidName: 'inv_to_location_uuid'
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

  public readByUnique = async (params: any) => {
    try { return await this.repo.readRawByUnique(params); }
    catch (error) { throw error; }
  }
  
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
}

export default StdProdService;