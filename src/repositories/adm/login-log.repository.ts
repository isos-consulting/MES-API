import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmLoginLog from '../../models/adm/login-log.model';
import IAdmLoginLog from '../../interfaces/adm/login-log.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class AdmLoginLogRepo {
  repo: Repository<AdmLoginLog>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmLoginLog);
  }
  //#endregion

  //#region ✅ CRUD Functions

// 📒 Fn[create]: Default Create Function
public create = async(body: IAdmLoginLog[], transaction?: Transaction) => {
	try {
		const promises = body.map((loginLog: any) => {
        return this.repo.create(
          {
            company_cd: loginLog.company_cd,
            id: loginLog.user_id,
            user_nm: loginLog.user_nm,
						state_cd: loginLog.state_cd,
						ip_address: loginLog.ip_address,
						browser: loginLog.browser,
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

  //#region 🔵 Read Functions
  
  // 📒 Fn[read]: Default Read Function
  public read = async(params?: any) => {
    try {
      const result = await this.repo.findAll({ 
        attributes: [
          'company_cd',
          'id',
          'user_nm',
          'state_cd',
          'ip_address',
          'browser',
          'created_at',
					[ Sequelize.col('admLoginLog.uuid'), 'login_log_uuid' ]
        ],
        where: {
          [Op.and] : [
            { created_at: { [Op.between]: [ params.start_date as any, params.end_date as any ] } },
            { id: params.user_id ? { [Op.like]: `%${params.user_id}%` } : { [Op.ne]: null } },
            { user_nm: params.user_nm ? { [Op.like]: `%${params.user_nm}%` } : { [Op.ne]: null } }
          ]
        },
        order: [ 'created_at' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

	// 📒 Fn[readByUuid]: Default Read With Uuid Function
	public readByUuid = async(uuid: string, params?: any) => {
		try {
			const result = await this.repo.findOne({ 
				attributes: [
					'company_cd',
          'id',
          'user_nm',
          'state_cd',
          'ip_address',
          'browser',
          'created_at',
					[ Sequelize.col('admLoginLog.uuid'), 'login_log_uuid' ]
				],
				where: { uuid },
			});

			return convertReadResult(result);
		} catch (error) {
			throw error;
		}
	};

	// 📒 Fn[readRawsByUuids]: Id 를 포함한 Raw Datas Read Function
	public readRawsByUuids = async(uuids: string[]) => {
		const result = await this.repo.findAll({ where: { uuid: { [Op.in]: uuids } } });
		return convertReadResult(result);
	};

	// 📒 Fn[readRawByUuid]: Id 를 포함한 Raw Data Read Function
	public readRawByUuid = async(uuid: string) => {
		const result = await this.repo.findOne({ where: { uuid } });
		return convertReadResult(result);
	};

  //#endregion
  //#endregion
}

export default AdmLoginLogRepo;