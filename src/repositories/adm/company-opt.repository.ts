import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmCompanyOpt from '../../models/adm/company-opt.model';
import IAdmCompanyOpt from '../../interfaces/adm/company-opt.interface';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class AdmCompanyOptRepo {
  repo: Repository<AdmCompanyOpt>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmCompanyOpt);
  }
  //#endregion

  //#region ✅ CRUD Functions

	// 📒 Fn[create]: Default Create Function
	public create = async(body: IAdmCompanyOpt[], uid: number, transaction?: Transaction) => {
		try {
			const companyOpt = body.map((companyOpt) => {
				return {
					company_opt_id: companyOpt.company_opt_id,
					company_opt_cd: companyOpt.company_opt_cd,
					company_opt_nm: companyOpt.company_opt_nm,
					remark: companyOpt.remark,
					val: companyOpt.val,
					val_opt: companyOpt.val_opt,
					sortby: companyOpt.sortby,
					created_uid: uid,
					updated_uid: uid,
				}
			});

			const result = await this.repo.bulkCreate(companyOpt, { individualHooks: true, transaction });

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
					[ Sequelize.col('admCompanyOpt.uuid'), 'company_opt_uuid' ],
          'company_opt_cd',
          'company_opt_nm',
          'remark',
          'val',
          'val_opt',
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
					[ Sequelize.col('admCompanyOpt.uuid'), 'company_opt_uuid' ],
					'company_opt_cd',
          'company_opt_nm',
          'remark',
          'val',
          'val_opt',
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
	public readRawByUnique = async(params: { company_opt_cd: string }) => {
		const result = await this.repo.findOne({ where: { company_opt_cd: params.company_opt_cd } });
		return convertReadResult(result);
	};

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IAdmCompanyOpt[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let companyOpt of body) {
        const result = await this.repo.update(
          {
            company_opt_cd: companyOpt.company_opt_cd != null ? companyOpt.company_opt_cd : null,
						company_opt_nm: companyOpt.company_opt_nm != null ? companyOpt.company_opt_nm : null,
						remark: companyOpt.remark != null ? companyOpt.remark : null,
						val: companyOpt.val != null ? companyOpt.val : null,
						val_opt: companyOpt.val_opt != null ? companyOpt.val_opt : null,
						sortby: companyOpt.sortby != null ? companyOpt.sortby : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: companyOpt.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmCompanyOpt.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAdmCompanyOpt[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let companyOpt of body) {
        const result = await this.repo.update(
          {
						company_opt_cd: companyOpt.company_opt_cd,
						company_opt_nm: companyOpt.company_opt_nm,
						remark: companyOpt.remark,
						val: companyOpt.val,
						val_opt: companyOpt.val_opt,
						sortby: companyOpt.sortby,
            updated_uid: uid,
          },
          { 
            where: { uuid: companyOpt.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmCompanyOpt.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

	//#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAdmCompanyOpt[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let companyOpt of body) {
        count += await this.repo.destroy({ where: { uuid: companyOpt.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.AdmCompanyOpt.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AdmCompanyOptRepo;