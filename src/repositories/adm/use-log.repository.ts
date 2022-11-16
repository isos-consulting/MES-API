import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmUseLog from '../../models/adm/use-log.model';
import IAdmUseLog from '../../interfaces/adm/use-log.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import { Transaction, UniqueConstraintError } from 'sequelize';
import { getSequelize } from '../../utils/getSequelize';

class AdmUseLogRepo {
  repo: Repository<AdmUseLog>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmUseLog);
  }
  //#endregion

  //#region ✅ CRUD Functions

	// 📒 Fn[create]: Default Create Function
	public create = async(body: IAdmUseLog[], transaction?: Transaction) => {
		try {
			const promises = body.map((useLog: any) => {
					return this.repo.create(
						{
							company_cd: useLog.company_cd,
							log_info: useLog.log_info,
							log_tag: useLog.log_tag,
							id: useLog.id,
							user_nm: useLog.user_nm,
							log_caption: useLog.log_caption,
							log_action: useLog.log_action,
							ip_address: useLog.ip_address,
							browser: useLog.browser,
							os: useLog.os,
						},
						{ hooks: true, transaction }
					);
				});
				
			await Promise.all(promises);
				
		} catch (error) {
			if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
			throw error;
		}
	};
	//#endregion

  //#endregion
  
}

export default AdmUseLogRepo;