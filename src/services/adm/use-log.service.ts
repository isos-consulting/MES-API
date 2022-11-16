import { Transaction } from "sequelize/types";
import AdmUseLogRepo from "../../repositories/adm/use-log.repository";

class AdmUseLogService {
  tenant: string;
  stateTag: string;
  repo: AdmUseLogRepo;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'admUseLog';
    this.repo = new AdmUseLogRepo(tenant);
  }

  public create = async (datas: any[], tran: Transaction) => {
    try { return await this.repo.create(datas, tran); } 
		catch (error) { throw error; }
  }

	public loginLogCreate = async (datas: any[]) => {
    try { 
			const result = await Promise.all(
				datas.map(async (loginLog: any) => {
					return {
						company_cd: loginLog.company_cd,
						log_info: loginLog.log_info,
						log_tag: loginLog.log_tag,
						id: loginLog.id,
            user_nm: loginLog.user_nm,
						log_caption: loginLog.log_caption,
						log_action: loginLog.log_action,
						ip_address: loginLog.ip,
						browser: loginLog.browser,
						os: 'Windows 8/Server 2012',
					}
				})
			);
			await this.repo.create(result); 
		} 
		catch (error) { throw error; }
  }
}

export default AdmUseLogService;