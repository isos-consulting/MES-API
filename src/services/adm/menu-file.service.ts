import { Transaction } from "sequelize/types";
import AdmMenuFileRepo from "../../repositories/adm/menu-file.repository";
import AutMenuRepo from "../../repositories/aut/menu.repository";
import { TFileType } from "../../types/file-type.type";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class AdmMenuFileService {
  tenant: string;
  stateTag: string;
  repo: AdmMenuFileRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'autMenuFile';
    this.repo = new AdmMenuFileRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'menu',
        TRepo: AutMenuRepo,
        idName: 'menu_id',
        uuidName: 'menu_uuid',
      }
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: any[], uid: number, tran: Transaction) => {
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

  public readByMenuId = async (menuId: string, fileType: TFileType) => {
    try { return await this.repo.readByMenuId(menuId, fileType); }
    catch (error) { throw error; }
  };

  public readRawById = async (id: number) => {
    try { return await this.repo.readRawById(id); }
    catch (error) { throw error; }
  };

  public update = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); }
    catch (error) { throw error; }
  };

  public delete = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
    catch (error) { throw error; }
  };
}

export default AdmMenuFileService;