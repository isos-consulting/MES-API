import { Transaction } from "sequelize/types";
import MatReleaseRepo from "../../repositories/mat/release.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdLocationRepo from "../../repositories/std/location.repository";
import StdProdRepo from "../../repositories/std/prod.repository";
import StdStoreRepo from "../../repositories/std/store.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import InvStoreRepo from "../../repositories/inv/store.repository";
import PrdDemandRepo from "../../repositories/prd/demand.repository";

class MatReleaseService {
  tenant: string;
  stateTag: string;
  repo: MatReleaseRepo;
  storeRepo: InvStoreRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'matRelease';
    this.repo = new MatReleaseRepo(tenant);
    this.storeRepo = new InvStoreRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'uuid',
        TRepo: MatReleaseRepo,
        idName: 'release_id',
        uuidName: 'uuid'
      },
      {
        key: 'returnDetail',
        TRepo: MatReleaseRepo,
        idName: 'release_id',
        uuidName: 'release_uuid'
      },
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'demand',
        TRepo: PrdDemandRepo,
        idName: 'demand_id',
        uuidName: 'demand_uuid'
      },
      {
        key: 'fromStore',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        idAlias: 'from_store_id',
        uuidName: 'from_store_uuid'
      },
      {
        key: 'fromLocation',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        idAlias: 'from_location_id',
        uuidName: 'from_location_uuid'
      },
      {
        key: 'toStore',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        idAlias: 'to_store_id',
        uuidName: 'to_store_uuid'
      },
      {
        key: 'toLocation',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        idAlias: 'to_location_id',
        uuidName: 'to_location_uuid'
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

  public readReport = async (params: any) => {
    try { return await this.repo.readReport(params); } 
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

export default MatReleaseService;