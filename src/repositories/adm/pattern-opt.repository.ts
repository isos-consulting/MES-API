import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmPatternOpt from '../../models/adm/pattern-opt.model';
import IAdmPatternOpt from '../../interfaces/adm/pattern-opt.interface';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class AdmPatternOptRepo {
  repo: Repository<AdmPatternOpt>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmPatternOpt);
  }
  //#endregion

  //#region ✅ CRUD Functions

	// 📒 Fn[create]: Default Create Function
	public create = async(body: IAdmPatternOpt[], uid: number, transaction?: Transaction) => {
		try {
			const patternOpt = body.map((patternOpt) => {
				return {
					pattern_opt_nm: patternOpt.pattern_opt_nm,
					table_nm: patternOpt.table_nm,
					auto_fg: patternOpt.auto_fg,
					col_nm: patternOpt.col_nm,
					pattern: patternOpt.pattern,
					sortby: patternOpt.sortby,
					created_uid: uid,
					updated_uid: uid,
				}
			});

			const result = await this.repo.bulkCreate(patternOpt, { individualHooks: true, transaction });

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
					// [ Sequelize.col('admPatternOpt.uuid'), 'pattern_opt_uuid' ],
          'pattern_opt_cd',
          'pattern_opt_nm',
          'table_nm',
          'auto_fg',
          'col_nm',
          'pattern',
					'sortby',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'sortby' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readPattern]: Default Read Function
  public readPattern = async(params?: any) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [ 'pattern' ],
        where: {
          table_nm: params.table_nm,
          col_nm: params.col_nm,
          auto_fg: '1',
				}
			});

      const converted = convertReadResult(result);
			if (converted.raws.length == 0) { return null; }
      return converted.raws[0].pattern as string;
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
					// [ Sequelize.col('admPatternOpt.uuid'), 'pattern_opt_uuid' ],
					'pattern_opt_cd',
          'pattern_opt_nm',
          'table_nm',
          'auto_fg',
          'col_nm',
          'pattern',
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
	public readRawByUnique = async(params: { pattern_opt_cd: string }) => {
		const result = await this.repo.findOne({ where: { pattern_opt_cd: params.pattern_opt_cd } });
		return convertReadResult(result);
	};

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IAdmPatternOpt[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let patternOpt of body) {
        const result = await this.repo.update(
          {
            pattern_opt_cd: patternOpt.pattern_opt_cd != null ? patternOpt.pattern_opt_cd : null,
            pattern_opt_nm: patternOpt.pattern_opt_nm != null ? patternOpt.pattern_opt_nm : null,
						table_nm: patternOpt.table_nm != null ? patternOpt.table_nm : null,
						auto_fg: patternOpt.auto_fg != null ? patternOpt.auto_fg : null,
						col_nm: patternOpt.col_nm != null ? patternOpt.col_nm : null,
						pattern: patternOpt.pattern != null ? patternOpt.pattern : null,
						sortby: patternOpt.sortby != null ? patternOpt.sortby : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: patternOpt.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmPatternOpt.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAdmPatternOpt[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let patternOpt of body) {
        const result = await this.repo.update(
          {
            pattern_opt_cd: patternOpt.pattern_opt_cd,
						pattern_opt_nm: patternOpt.pattern_opt_nm,
						table_nm: patternOpt.table_nm,
						auto_fg: patternOpt.auto_fg,
						col_nm: patternOpt.col_nm,
						pattern: patternOpt.pattern,
						sortby: patternOpt.sortby,
            updated_uid: uid,
          },
          { 
            where: { uuid: patternOpt.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmPatternOpt.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAdmPatternOpt[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let patternOpt of body) {
        count += await this.repo.destroy({ where: { uuid: patternOpt.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.AdmPatternOpt.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AdmPatternOptRepo;