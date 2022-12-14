import { Transaction } from "sequelize/types";
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdProcRepo from '../../repositories/std/proc.repository';
import StdRoutingRepo from '../../repositories/std/routing.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import IStdRouting from "../../interfaces/std/routing.interface";
import StdBomService from "../std/bom.service";
import PrdPlanDailyService from "../prd/plan-daily.service";

class StdRoutingService {
  tenant: string;
  stateTag: string;
  repo: StdRoutingRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'StdRouting';
    this.repo = new StdRoutingRepo(tenant);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
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
        key: 'proc',
        TRepo: StdProcRepo,
        idName: 'proc_id',
        uuidName: 'proc_uuid'
      },
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IStdRouting[], uid: number, tran: Transaction) => {
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

  // 📒 Fn[readActivedProd]: 생산가능 품목 조회
  public readOptionallyPrdActive = async (params: any) => {
    try { return await this.repo.readOptionallyPrdActive(params); }
		catch (error) { throw error; }
  };
  public readOptionallyMove = async (params: any) => {
    try { return await this.repo.readOptionallyMove(params); }
		catch (error) { throw error; }
  };

	// 📒 Fn[readPlanDailyRaws]: 일생산 계획 조회
	public readPlanDailyRaws = async (params: any) => {
    try { 
			const planDailyService = new PrdPlanDailyService(this.tenant);
			let planDailyReadRaws: any[] = [];

			params.plan_daily_uuid = String(params.plan_daily_uuid).split(',')
			for await (const raw of params.plan_daily_uuid) {	
				const convertParams = {
					factory_uuid: params.factory_uuid,
					plan_daily_uuid: raw
				}
				const planDailyRead = await planDailyService.read(convertParams);	
				planDailyRead.raws.forEach((data) => {
					planDailyReadRaws.push(data)
				})
			};
			return planDailyReadRaws;
		}
		catch (error) { throw error; }
  };

	// 📒 Fn[readToProdsOfDownTrees]: 하위 bom 조회
	public readToProdsOfDownTrees = async (params: any) => {
    try { 
			const bomService = new StdBomService(this.tenant);
			let bomReadRaws: any[] = [];

			for await (const raw of params) {	
				const convertParams = {
					factory_uuid: raw.factory_uuid,
					prod_uuid: raw.prod_uuid
				}
				const bomRead = await bomService.readToProdOfDownTrees(convertParams);	
				bomRead.raws.forEach((data) => {
					data.plan_daily_uuid = raw.plan_daily_uuid;
					data.plan_daily_qty = raw.plan_daily_qty;
					data.balance = raw.balance;
					bomReadRaws.push(data);
				})
			};
			return bomReadRaws;
		}
		catch (error) { throw error; }
  };

	// 📒 Fn[readToProdsOfDownTrees]: 생산가능 품번들 조회 
	public readProdsActive = async (params: any) => {
		try { 
			let result: any = { count:0, raws: [] };
			for await (const raw of params) {	
				const convertParams = {
					factory_uuid: raw.factory_uuid,
					prod_uuid: raw.prod_uuid
				}
				const activeRead= await this.readOptionallyPrdActive(convertParams);
				activeRead.raws.forEach((data) => {
					data.c_usage = raw.c_usage === null ? 1 : raw.c_usage ;
					data.plan_daily_uuid = raw.plan_daily_uuid;
					data.plan_daily_qty = raw.plan_daily_qty;
					data.balance = raw.balance;
					data.qty = data.c_usage * data.balance;
					result.raws.push(data)
				})
			};
			result.count = result.raws.length
			return result;
		}
		catch (error) { throw error; }
	};

  public update = async (datas: IStdRouting[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IStdRouting[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  };

  public delete = async (datas: IStdRouting[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };
}

export default StdRoutingService;