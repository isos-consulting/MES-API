import { Transaction } from "sequelize/types";
import StdWorkingsRepo from '../../repositories/std/workings.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import StdProdRepo from "../../repositories/std/prod.repository";
import PrdWorkPlanMonthRepo from "../../repositories/prd/work-plan-month.repository";
import IPrdWorkPlanMonth from "../../interfaces/prd/work-plan-month.interface";

class PrdWorkPlanMonthService {
  tenant: string;
  stateTag: string;
  repo: PrdWorkPlanMonthRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'prdWorkRoutingOrigin';
    this.repo = new PrdWorkPlanMonthRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'workings',
        TRepo: StdWorkingsRepo,
        idName: 'workings_id',
        uuidName: 'workings_uuid'
      }
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IPrdWorkPlanMonth[], uid: number, tran: Transaction) => {
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

  public update = async (datas: IPrdWorkPlanMonth[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  }

  public patch = async (datas: IPrdWorkPlanMonth[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  }

  public delete = async (datas: IPrdWorkPlanMonth[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  }
}

export default PrdWorkPlanMonthService;