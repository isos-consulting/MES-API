import { Transaction } from "sequelize/types";
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdWorkerGroupRepo from '../../repositories/std/worker-group.repository';
import StdWorkerRepo from '../../repositories/std/worker.repository';
import StdWorkerGroupWorkerRepo from '../../repositories/std/worker-group-worker.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import IStdWorkerGroupWorker from "../../interfaces/std/routing.interface";

class StdWorkerGroupWorkerService {
  tenant: string;
  stateTag: string;
  repo: StdWorkerGroupWorkerRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'StdWorkerGroupWorker';
    this.repo = new StdWorkerGroupWorkerRepo(tenant);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'workerGroup',
        TRepo: StdWorkerGroupRepo,
        idName: 'worker_group_id',
        uuidName: 'worker_group_uuid'
      },
      {
        key: 'worker',
        TRepo: StdWorkerRepo,
        idName: 'worker_id',
        uuidName: 'worker_uuid'
      },
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IStdWorkerGroupWorker[], uid: number, tran: Transaction) => {
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

  // 📒 Fn[readWorkerInGroup]: 작업조에 포함된 작업자 조회
  public readWorkerInGroup = async (groupId: number) => {
    try { return await this.repo.readWorkerInGroup(groupId); }
		catch (error) { throw error; }
  };

  public update = async (datas: IStdWorkerGroupWorker[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IStdWorkerGroupWorker[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  };

  public delete = async (datas: IStdWorkerGroupWorker[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };
}

export default StdWorkerGroupWorkerService;