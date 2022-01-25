import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmCycleUnit from '../../models/adm/cycle-unit.model';
import IAdmCycleUnit from '../../interfaces/adm/cycle-unit.interface';
import { Sequelize } from 'sequelize-typescript';
import sequelize from '../../models';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import _ from 'lodash';
import ApiResult from '../../interfaces/common/api-result.interface';

class AdmCycleUnitRepo {
  repo: Repository<AdmCycleUnit>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmCycleUnit);
  }
  //#endregion

  //#region ✅ CRUD Functions

	// 📒 Fn[create]: Default Create Function
	public create = async(body: IAdmCycleUnit[], uid: number, transaction?: Transaction) => {
		try {
      const promises = body.map((cycleUnit: any) => {
        return this.repo.create(
          {
						cycle_unit_cd: cycleUnit.cycle_unit_cd,
						cycle_unit_nm: cycleUnit.cycle_unit_nm,
						format: cycleUnit.format,
						sortby: cycleUnit.sortby,
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
					[ Sequelize.col('admCycleUnit.uuid'), 'cycle_unit_uuid' ],
          'cycle_unit_cd',
          'cycle_unit_nm',
					'format',
					'sortby',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: params.cycle_unit_cd ? { cycle_unit_cd: params.cycle_unit_cd } : {},
        order: [ 'sortby' ],
      })
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
					{ model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
					{ model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
				],
				attributes: [
					[ Sequelize.col('admCycleUnit.uuid'), 'cycle_unit_uuid' ],
          'cycle_unit_cd',
          'cycle_unit_nm',
					'format',
					'sortby',
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
	public readRawByUnique = async(params: { cycle_unit_cd: string }) => {
		const result = await this.repo.findOne({ where: { cycle_unit_cd: params.cycle_unit_cd } });
		return convertReadResult(result);
	};

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IAdmCycleUnit[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((cycleUnit: any) => {
        return this.repo.update(
          {
						cycle_unit_cd: cycleUnit.cycle_unit_cd ?? null,
						cycle_unit_nm: cycleUnit.cycle_unit_nm ?? null,
						format: cycleUnit.format ?? null,
						sortby: cycleUnit.sortby ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: cycleUnit.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', sequelize.models.AdmCycleUnit.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAdmCycleUnit[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((cycleUnit: any) => {
        return this.repo.update(
          {
						cycle_unit_cd: cycleUnit.cycle_unit_cd,
						cycle_unit_nm: cycleUnit.cycle_unit_nm,
						format: cycleUnit.format,
						sortby: cycleUnit.sortby,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: cycleUnit.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', sequelize.models.AdmCycleUnit.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

	//#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAdmCycleUnit[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((cycleUnit: any) => {
        return this.repo.destroy({ where: { uuid: cycleUnit.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', sequelize.models.AdmCycleUnit.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AdmCycleUnitRepo;