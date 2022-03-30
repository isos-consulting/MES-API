import { Transaction } from "sequelize/types";
import AutUserPermissionRepo from "../../repositories/aut/user-permission.repository";
import AutMenuRepo from '../../repositories/aut/menu.repository';
import AutUserRepo from '../../repositories/aut/user.repository';
import AutPermissionRepo from '../../repositories/aut/permission.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

// Controller에서 해야하는 일은 Data를 정제하는 일을 한다.
// Service는 정제된 Data를 받아 일정하게 비즈니스로직을 처리하는 일을 한다.

class AutUserPermissionService {
  tenant: string;
  stateTag: string;
  repo: AutUserPermissionRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'autUserPermission';
    this.repo = new AutUserPermissionRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'user',
        TRepo: AutUserRepo,
        idName: 'uid',
        uuidName: 'user_uuid'
      },
      {
        key: 'menu',
        TRepo: AutMenuRepo,
        idName: 'menu_id',
        uuidName: 'menu_uuid'
      },
      {
        key: 'permission',
        TRepo: AutPermissionRepo,
        idName: 'permission_id',
        uuidName: 'permission_uuid'
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

export default AutUserPermissionService;