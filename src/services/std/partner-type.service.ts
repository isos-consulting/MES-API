import { Transaction } from "sequelize/types";
import StdPartnerTypeRepo from '../../repositories/std/partner-type.repository';

class StdPartnerTypeService {
  tenant: string;
  stateTag: string;
  repo: StdPartnerTypeRepo;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'stdPartnerType';
    this.repo = new StdPartnerTypeRepo(tenant);
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

  public readByUniques = async (partnerTypeCds: string[]) => {
    try { return await this.repo.readRawByUniques(partnerTypeCds);}
    catch (error) { throw error; }
  }

  public update = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  }

  public patch = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  }

  public delete = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  }
}

export default StdPartnerTypeService;