import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdTenantOpt from '../../models/std/tenant-opt.model';
import IStdTenantOpt from '../../interfaces/std/tenant-opt.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';

class StdTenantOptRepo {
  repo: Repository<StdTenantOpt>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdTenantOpt);
  }
  //#endregion

  //#region ✅ CRUD Functions

// 📒 Fn[create]: Default Create Function
public create = async(body: IStdTenantOpt[], uid: number, transaction?: Transaction) => {
	try {
		const promises = body.map((tenantOpt: any) => {
        return this.repo.create(
          {
            tenant_opt_cd: tenantOpt.tenant_opt_cd,
            tenant_opt_nm: tenantOpt.tenant_opt_nm,
            value: tenantOpt.value,
            remark: tenantOpt.remark,
            created_uid: uid,
            updated_uid: uid,
          },
          { hooks: true, transaction }
        );
      });
      const raws = await Promise.all(promises);
      
			return { raws, count: raws.length } as ApiResult<any>;
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
        include: [
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
					[ Sequelize.col('stdTenantOpt.uuid'), 'tenant_opt_uuid' ],
          'tenant_opt_cd',
          'tenant_opt_nm',
          'value',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { tenant_opt_cd: params.tenant_opt_cd ?? { [Op.ne]: null } },
        order: [ 'tenant_opt_id' ],
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
				include: [
					{ model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
					{ model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
				],
				attributes: [
					[ Sequelize.col('stdTenantOpt.uuid'), 'tenant_opt_uuid' ],
					'tenant_opt_cd',
          'tenant_opt_nm',
          'value',
          'remark',
          'created_at',
					[ Sequelize.col('createUser.user_nm'), 'created_nm' ],
					'updated_at',
					[ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
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

	// 📒 Fn[readRawByUnique]: Unique Key를 통하여 Raw Data Read Function
	public readRawByUnique = async(params: { tenant_opt_cd: string }) => {
		const result = await this.repo.findOne({ where: { tenant_opt_cd: params.tenant_opt_cd } });
		return convertReadResult(result);
	};

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdTenantOpt[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((tenantOpt: any) => {
        return this.repo.update(
          {
            tenant_opt_cd: tenantOpt.tenant_opt_cd ?? null,
						tenant_opt_nm: tenantOpt.tenant_opt_nm ?? null,
						value: tenantOpt.value ?? null,
						remark: tenantOpt.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: tenantOpt.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdTenantOpt.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdTenantOpt[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((tenantOpt: any) => {
        return this.repo.update(
          {
						tenant_opt_cd: tenantOpt.tenant_opt_cd,
						tenant_opt_nm: tenantOpt.tenant_opt_nm,
						value: tenantOpt.value,
						remark: tenantOpt.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: tenantOpt.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdTenantOpt.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

	//#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdTenantOpt[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((tenantOpt: any) => {
        return this.repo.destroy({ where: { uuid: tenantOpt.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdTenantOpt.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default StdTenantOptRepo;