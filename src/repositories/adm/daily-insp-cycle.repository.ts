import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmDailyInspCycle from '../../models/adm/daily-insp-cycle.model';
import IAdmDailyInspCycle from '../../interfaces/adm/daily-insp-cycle.interface';
import { Sequelize } from 'sequelize-typescript';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from './log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class AdmDailyInspCycleRepo {
  repo: Repository<AdmDailyInspCycle>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmDailyInspCycle);
  }
  //#endregion

  //#region ✅ CRUD Functions

	// 📒 Fn[create]: Default Create Function
	public create = async(body: IAdmDailyInspCycle[], uid: number, transaction?: Transaction) => {
		try {
			const dailyInspCycleTypes = body.map((dailyInspCycleType) => {
				return {
					daily_insp_cycle_cd: dailyInspCycleType.daily_insp_cycle_cd,
					daily_insp_cycle_nm: dailyInspCycleType.daily_insp_cycle_nm,
					sortby: dailyInspCycleType.sortby,
					created_uid: uid,
					updated_uid: uid,
				}
			});

			const result = await this.repo.bulkCreate(dailyInspCycleTypes, { individualHooks: true, transaction });

			return convertBulkResult(result);
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
					[ Sequelize.col('admDailyInspCycle.uuid'), 'daily_insp_cycle_uuid' ],
          'daily_insp_cycle_cd',
          'daily_insp_cycle_nm',
          'sortby',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: params.daily_insp_cycle_cd ? { daily_insp_cycle_cd: params.daily_insp_cycle_cd } : {},
        order: [ 'sortby' ],
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
					[ Sequelize.col('admDailyInspCycle.uuid'), 'daily_insp_cycle_uuid' ],
          'daily_insp_cycle_cd',
          'daily_insp_cycle_nm',
          'sortby',
          'created_at',
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
	public readRawByUnique = async(params: { daily_insp_cycle_cd: string }) => {
		const result = await this.repo.findOne({ where: { daily_insp_cycle_cd: params.daily_insp_cycle_cd } });
		return convertReadResult(result);
	};

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IAdmDailyInspCycle[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let dailyInspCycleType of body) {
        const result = await this.repo.update(
          {
						daily_insp_cycle_cd: dailyInspCycleType.daily_insp_cycle_cd ?? null,
						daily_insp_cycle_nm: dailyInspCycleType.daily_insp_cycle_nm ?? null,
						sortby: dailyInspCycleType.sortby ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: dailyInspCycleType.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', sequelize.models.AdmDailyInspCycle.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAdmDailyInspCycle[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let dailyInspCycleType of body) {
        const result = await this.repo.update(
          {
						daily_insp_cycle_cd: dailyInspCycleType.daily_insp_cycle_cd,
						daily_insp_cycle_nm: dailyInspCycleType.daily_insp_cycle_nm,
						sortby: dailyInspCycleType.sortby,
            updated_uid: uid,
          },
          { 
            where: { uuid: dailyInspCycleType.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', sequelize.models.AdmDailyInspCycle.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

	  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAdmDailyInspCycle[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let dailyInspCycleType of body) {
        count += await this.repo.destroy({ where: { uuid: dailyInspCycleType.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', sequelize.models.AdmDailyInspCycle.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AdmDailyInspCycleRepo;