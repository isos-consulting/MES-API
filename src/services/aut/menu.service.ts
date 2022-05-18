import { Transaction } from "sequelize/types";
import AutMenuRepo from "../../repositories/aut/menu.repository";
import AutMenuTypeRepo from '../../repositories/aut/menu-type.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

// Controller에서 해야하는 일은 Data를 정제하는 일을 한다.
// Service는 정제된 Data를 받아 일정하게 비즈니스로직을 처리하는 일을 한다.

class AutMenuService {
  tenant: string;
  stateTag: string;
  repo: AutMenuRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'autMenu';
    this.repo = new AutMenuRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'menu',
        TRepo: AutMenuRepo,
        idName: 'menu_id',
        uuidName: 'uuid'
      },
      {
        key: 'menuType',
        TRepo: AutMenuTypeRepo,
        idName: 'menu_type_id',
        uuidName: 'menu_type_uuid'
      },
      {
        key: 'parent',
        TRepo: AutMenuRepo,
        idName: 'menu_id',
        idAlias: 'parent_id',
        uuidName: 'parent_uuid'
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

	public readRawsByUuids = async (uuids: string[]) => {
    try { return await this.repo.readRawsByUuids(uuids); } 
		catch (error) { throw error; }
  };
	
	public updateIncrementBySort = async (datas: any[], by: number, uid: number, tran: Transaction) => {
    try { return await this.repo.updateIncrementBySort(datas, by, uid, tran); } 
		catch (error) { throw error; }
  };

	public getMaxSort = async (parentId: number) => {
    try { return await this.repo.getMaxSort(parentId); } 
		catch (error) { throw error; }
  };

	public readDeleteById = async (menuId: number) => {
    try { return await this.repo.readDeleteById(menuId); } 
		catch (error) { throw error; }
  }

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

	public readMenuWithPermissionByUid = async (params: any) => {
    try { return await this.repo.readMenuWithPermissionByUid(params); } 
		catch (error) { throw error; }
  };

	public compareSortby = async (maxSortBy: number, sortBy: number) => {
    try { 
			let compareSortby: number = sortBy;
			
			if ( maxSortBy < sortBy ) {
				compareSortby = ++maxSortBy;
			}
			return compareSortby; 
		} 
		catch (error) { throw error; }
  };
}

export default AutMenuService;