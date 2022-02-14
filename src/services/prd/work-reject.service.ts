import { Transaction } from "sequelize/types";
import IPrdWorkReject from "../../interfaces/prd/work-reject.interface";
import PrdWorkRepo from '../../repositories/prd/work.repository';
import PrdWorkRejectRepo from "../../repositories/prd/work-reject.repository";
import PrdWorkRoutingRepo from '../../repositories/prd/work-routing.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdRejectRepo from '../../repositories/std/reject.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class PrdWorkRejectService {
  tenant: string;
  stateTag: string;
  repo: PrdWorkRejectRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'prdWorkReject';
    this.repo = new PrdWorkRejectRepo(tenant);

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
        key: 'workRouting',
        TRepo: PrdWorkRoutingRepo,
        idName: 'work_routing_id',
        uuidName: 'work_routing_uuid'
      },
      {
        key: 'reject',
        TRepo: StdRejectRepo,
        idName: 'reject_id',
        uuidName: 'reject_uuid'
      },
      {
        key: 'store',
        TRepo: StdStoreRepo,
        idAlias: 'to_store_id',
        idName: 'store_id',
        uuidName: 'to_store_uuid'
      },
      {
        key: 'location',
        TRepo: StdLocationRepo,
        idAlias: 'to_location_id',
        idName: 'location_id',
        uuidName: 'to_location_uuid'
      },
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IPrdWorkReject[], uid: number, tran: Transaction) => {
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

  public readReport = async (params: any) => {
    try { return await this.repo.readReport(params); }
    catch (error) { throw error; }
  }

  public readByWork = async (params: any) => {
    try { return await this.repo.readByWork(params); }
    catch (error) { throw error; }
  }

  public update = async (datas: IPrdWorkReject[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IPrdWorkReject[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  };

  public delete = async (datas: IPrdWorkReject[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public deleteByWorkId = async (workId: number, uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByWorkId(workId, uid, tran); }
    catch (error) { throw error; }
  }

  /**
   * @param datas 작업실적 데이터
   * @param regDate 수불일시
   * @returns 실적부적합 데이터
   */
   getWorkRejectBody = async (data: any, regDate: string) => {
    const workRejectRead = await this.repo.readRawsByWorkId(data.work_id);
    const result = await Promise.all(
      workRejectRead.raws.map(async (workReject: any) => {
        return {
          work_reject_id: workReject.work_reject_id,
          factory_id: workReject.factory_id,
          prod_id: workReject.prod_id,
          reg_date: regDate,
          lot_no: workReject.lot_no,
          qty: workReject.qty,
          to_store_id: workReject.to_store_id,
          to_location_id: workReject.to_location_id
        }
      })
    );

    return result;
  }
}

export default PrdWorkRejectService;