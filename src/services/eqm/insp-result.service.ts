import { Transaction } from "sequelize/types";
import EqmInspDetailRepo from "../../repositories/eqm/insp-detail.repository";
import EqmInspResultRepo from "../../repositories/eqm/insp-result.repository";
import StdEmpRepo from "../../repositories/std/emp.repository";
import StdEquipRepo from "../../repositories/std/equip.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class EqmInspResultService {
  tenant: string;
  stateTag: string;
  repo: EqmInspResultRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'eqmInspResult';
    this.repo = new EqmInspResultRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'inspDetail',
        TRepo: EqmInspDetailRepo,
        idName: 'insp_detail_id',
        uuidName: 'insp_detail_uuid'
      },
      {
        key: 'equip',
        TRepo: StdEquipRepo,
        idName: 'equip_id',
        uuidName: 'equip_uuid'
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
  }

  public create = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.create(datas, uid, tran); } 
    catch (error) { throw error; }
  }

  public read = async (params: any) => {
    try { 
      switch (params.insp_type) {
        case 'periodicity': params.periodicity_fg = true; break;
        case 'daily': params.periodicity_fg = false; break;
        default: params.periodicity_fg = null; break;
      }
      return await this.repo.read(params); 
    } 
    catch (error) { throw error; }
  };
  
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

export default EqmInspResultService;