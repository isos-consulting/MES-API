import { Transaction } from "sequelize/types";
import StdInspItemRepo from "../../repositories/std/insp-item.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import StdInspItemTypeRepo from "../../repositories/std/insp-item-type.repository";
import StdInspToolRepo from "../../repositories/std/insp-tool.repository";
import StdInspMethodRepo from "../../repositories/std/insp-method.repository";

class StdInspItemService {
  tenant: string;
  stateTag: string;
  repo: StdInspItemRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'stdInspItem';
    this.repo = new StdInspItemRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'inspItemType',
        TRepo: StdInspItemTypeRepo,
        idName: 'insp_item_type_id',
        uuidName: 'insp_item_type_uuid'
      },
      {
        key: 'inspTool',
        TRepo: StdInspToolRepo,
        idName: 'insp_tool_id',
        uuidName: 'insp_tool_uuid'
      },
      {
        key: 'inspMethod',
        TRepo: StdInspMethodRepo,
        idName: 'insp_method_id',
        uuidName: 'insp_method_uuid'
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
      switch (params.type) {
        case 'all': break;
        case 'eqm': params.eqm_fg = true; params.qms_fg = false; break;
        case 'qms': params.eqm_fg = false; params.qms_fg = true; break;
        default: break;
      }

      return await this.repo.read(params);
    } catch (error) { throw error; }
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

export default StdInspItemService;