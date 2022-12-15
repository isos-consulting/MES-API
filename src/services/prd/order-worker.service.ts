import { Transaction } from "sequelize/types";
import IPrdOrderWorker from "../../interfaces/prd/order-worker.interface";
import IPrdOrder from "../../interfaces/prd/order.interface";
import PrdOrderWorkerRepo from '../../repositories/prd/order-worker.repository';
import PrdOrderRepo from '../../repositories/prd/order.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdEmpRepo from '../../repositories/std/emp.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import StdWorkerGroupEmpService from "../std/worker-group-emp.service";
import StdEmpService from '../std/emp.service';
import PrdOrderService from '../prd/order.service';
import ApiResult from '../../interfaces/common/api-result.interface';

class PrdOrderWorkerService {
  tenant: string;
  stateTag: string;
  repo: PrdOrderWorkerRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'prdOrderWorker';
    this.repo = new PrdOrderWorkerRepo(tenant);

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
        key: 'emp',
        TRepo: StdEmpRepo,
        idName: 'emp_id',
        uuidName: 'emp_uuid'
      }
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IPrdOrderWorker[], uid: number, tran: Transaction) => {
    try { return await this.repo.create(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public createByOrder = async (data: IPrdOrder, uid: number, tran: Transaction) => {
    try {
      const workerGroupEmpService = new StdWorkerGroupEmpService(this.tenant);
      const workerRead = await workerGroupEmpService.readWorkerInGroup(data.worker_group_id as number);
      const workerBody: IPrdOrderWorker[] = workerRead.raws.map((raw: any) => {
        return {
          factory_id: raw.factory_id,
          order_id: data.order_id,
          emp_id: raw.emp_id
        }
      });

      return await this.repo.create(workerBody, uid, tran);
    } catch (error) {
      throw error;
    }
  }

	public totalCreateByOrder = async (emp: any[] ,order: IPrdOrder, uid: number, tran: Transaction) => {
    try {
			let empReadRaws: any[] = [];
			const empService = new StdEmpService(this.tenant)

			for await (const empUuid of emp) {
				const workerRead = await empService.readRawByUuid(empUuid)
				workerRead.raws.forEach((data) => {
					empReadRaws.push(data)
				});
			}
      const workerBody: IPrdOrderWorker[] = empReadRaws.map((raw: any) => {
        return {
          factory_id: order.factory_id,
          order_id: order.order_id,
          emp_id: raw.emp_id
        }
      });
      return await this.repo.create(workerBody, uid, tran);
    } catch (error) {
      throw error;
    }
  };

  public read = async (params: any) => {
    try { return await this.repo.read(params); }
		catch (error) { throw error; }
  };

	public totalRead = async (params: any) => {
    try { 
			let totalOrderWorker:ApiResult<any> = { count:0, raws: [] };
			let orderWorker:any[] = [];
			const orderService =  new PrdOrderService(this.tenant);
			const empService =  new StdEmpService(this.tenant);
			params.order_uuid = String(params.order_uuid).split(',')

			const orderId = await orderService.readRawsByUuids(params.order_uuid);

			for await (const order of orderId.raws) {
				const Workers = await this.repo.readRawsByOrderId(order.order_id);
				Workers.raws.forEach((data) => {
					data.order_uuid = order.uuid
					orderWorker.push(data)
				})
			};

			for await (const emp of orderWorker) {
				const employee = await empService.readRawById(emp.emp_id);
				employee.raws.forEach((data) => {
					const pushParams = {
						emp_cd: data.emp_cd,
						emp_nm: data.emp_nm,
						order_uuid : emp.order_uuid
					}
					
					totalOrderWorker.raws.push(pushParams)
				})
			};
			
			totalOrderWorker.count = totalOrderWorker.raws.length;
			return totalOrderWorker
		}
		catch (error) { throw error; }
  };
  
  public readByUuid = async (uuid: string) => {
    try { return await this.repo.readByUuid(uuid); } 
		catch (error) { throw error; }
  };

  public update = async (datas: IPrdOrderWorker[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IPrdOrderWorker[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  };

  public delete = async (datas: IPrdOrderWorker[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public deleteByOrderIds = async (orderId: number[], uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByOrderIds(orderId, uid, tran); }
    catch (error) { throw error; }
  }
}

export default PrdOrderWorkerService;