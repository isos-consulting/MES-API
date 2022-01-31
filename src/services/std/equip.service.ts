import { Transaction } from "sequelize/types";
import StdEmpRepo from "../../repositories/std/emp.repository";
import StdEquipTypeRepo from '../../repositories/std/equip-type.repository';
import StdEquipRepo from '../../repositories/std/equip.repository';
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdWorkingsRepo from "../../repositories/std/workings.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class StdEquipService {
  tenant: string;
  stateTag: string;
  repo: StdEquipRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'stdEquip';
    this.repo = new StdEquipRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
			{
        key: 'equipType',
        TRepo: StdEquipTypeRepo,
        idName: 'equip_type_id',
        uuidName: 'equip_type_uuid'
      },
			{
        key: 'workings',
        TRepo: StdWorkingsRepo,
        idName: 'workings_id',
        uuidName: 'workings_uuid'
      },
      {
        key: 'managerEmp',
        TRepo: StdEmpRepo,
        idName: 'emp_id',
        idAlias: 'manager_emp_id',
        uuidName: 'manager_emp_uuid'
      },
      {
        key: 'subManagerEmp',
        TRepo: StdEmpRepo,
        idName: 'emp_id',
        idAlias: 'sub_manager_emp_id',
        uuidName: 'sub_manager_emp_uuid'
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
    try { return await this.repo.read(params); } 
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

export default StdEquipService;