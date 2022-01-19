import { Transaction } from "sequelize/types";
import AdmFileMgmtTypeRepo from "../../repositories/adm/file-mgmt-type.repository";
import AdmFileMgmtType from "../../repositories/adm/file-mgmt-type.repository";

class AdmFileMgmtTypeService {
  tenant: string;
  stateTag: string;
  repo: AdmFileMgmtTypeRepo;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'admfileMgmtType';
    this.repo = new AdmFileMgmtType(tenant);
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

export default AdmFileMgmtTypeService;