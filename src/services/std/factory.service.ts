import { Transaction } from "sequelize/types";
import StdFactoryRepo from '../../repositories/std/factory.repository';

class StdFactoryService {
  tenant: string;
  stateTag: string;
  repo: StdFactoryRepo;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'stdFactoryType';
    this.repo = new StdFactoryRepo(tenant);
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

	public readForSignIn = async () => {
		try { return await this.repo.readForSignIn(); }
		catch (error) { throw error; }
	}
}

export default StdFactoryService;