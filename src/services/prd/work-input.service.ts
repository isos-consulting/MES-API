import { Transaction } from "sequelize/types";
import IPrdWorkInput from "../../interfaces/prd/work-input.interface";
import PrdWorkRepo from '../../repositories/prd/work.repository';
import PrdWorkInputRepo from "../../repositories/prd/work-input.repository";
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import StdUnitRepo from '../../repositories/std/unit.repository';
// import AdmBomInputTypeRepo from '../../repositories/adm/bom_input_type.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class prdWorkInputService {
  tenant: string;
  stateTag: string;
  repo: PrdWorkInputRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'prdWorkInput';
    this.repo = new PrdWorkInputRepo(tenant);

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
      // {
      //   key: 'bom_input_type',
      //   TRepo: AdmBomInputTypeRepo,
      //   idName: 'bom_input_type_id',
      //   uuidName: 'bom_input_type_uuid'
      // },
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

  public create = async (datas: IPrdWorkInput[], uid: number, tran: Transaction) => {
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

  // 📒 Fn[readOngoing]: 진행중인 생산실적의 자재 투입데이터 Read Function
  public readOngoing = async (params: any) => {
    try { return await this.repo.readOngoing(params); }
		catch (error) { throw error; }
  };

  // 📒 Fn[readOngoingGroup]: 진행중인 생산실적의 자재 투입데이터 Read Function
  public readOngoingGroup = async (params: any) => {
    try { return await this.repo.readOngoing(params); }
		catch (error) { throw error; }
  };

  public update = async (datas: IPrdWorkInput[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IPrdWorkInput[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  };

  public delete = async (datas: IPrdWorkInput[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public deleteByWorkId = async (workId: number, uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByWorkId(workId, uid, tran); }
    catch (error) { throw error; }
  }

  public deleteByWorkIds = async (workId: number[], uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByWorkIds(workId, uid, tran); }
    catch (error) { throw error; }
  }
}

export default prdWorkInputService;