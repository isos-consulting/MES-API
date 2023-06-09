import { Transaction } from "sequelize/types";
import AdmReworkTypeRepo from "../../repositories/adm/rework-type.repository";

class AdmReworkTypeService {
  tenant: string;
  stateTag: string;
  repo: AdmReworkTypeRepo;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'admReworkType';
    this.repo = new AdmReworkTypeRepo(tenant);
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

	public readRawById = async (id: number) => {
    try { return await this.repo.readRawById(id); } 
    catch (error) { throw error; }
  };

  public readRawByCd = async (rework_type_cd: string) => {
    try { return await this.repo.readRawByUnique({ rework_type_cd }); } 
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

export default AdmReworkTypeService;