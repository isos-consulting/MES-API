import { Transaction } from "sequelize/types";
import AdmLoginLogRepo from "../../repositories/adm/login-log.repository";
import { LOGIN_LOG_TYPE  } from '../../utils/enmType'; 

class AdmLoginLogService {
  tenant: string;
  stateTag: string;
  repo: AdmLoginLogRepo;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'admLoginLog';
    this.repo = new AdmLoginLogRepo(tenant);
  }

  public create = async (datas: any[], tran: Transaction) => {
    try { return await this.repo.create(datas, tran); } 
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

	public loginLogCreate = async (datas: any[],type: LOGIN_LOG_TYPE ) => {
    try { 
			const result = await Promise.all(
				datas.map(async (loginLog: any) => {
					return {
						state_cd: type,
						user_id: loginLog.id,
						company_cd: this.tenant,
            user_nm: loginLog.user_nm,
						ip_address: loginLog.ip,
						browser: loginLog.browser,
					}
				})
			);
			await this.repo.create(result); 
		} 
		catch (error) { throw error; }
  }
}

export default AdmLoginLogService;