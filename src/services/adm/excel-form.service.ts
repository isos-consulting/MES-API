import { Transaction } from "sequelize/types";
import AdmExcelFormRepo from "../../repositories/adm/excel-form.repository";
import AutMenuRepo from "../../repositories/aut/menu.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class AdmExcelFormService {
  tenant: string;
  stateTag: string;
  repo: AdmExcelFormRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'admExcelForm';
    this.repo = new AdmExcelFormRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'menu',
        TRepo: AutMenuRepo,
        idName: 'menu_id',
        uuidName: 'menu_uuid'
      },
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

	public readByMenu = async () => {
    try { return await this.repo.readByMenu(); } 
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

	public excelFormDownload = async (params: any) => {
    try { 
			return await this.repo.read(params); 
		} 
		catch (error) { throw error; }
  }
}

export default AdmExcelFormService;