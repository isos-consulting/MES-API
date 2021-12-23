import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmPrdPlanType from '../../models/adm/prd-plan-type.model';
import IAdmPrdPlanType from '../../interfaces/adm/prd-plan-type.interface';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class AdmPrdPlanTypeRepo {
  repo: Repository<AdmPrdPlanType>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmPrdPlanType);
  }
  //#endregion

  //#region ✅ CRUD Functions

	// 📒 Fn[create]: Default Create Function
	public create = async(body: IAdmPrdPlanType[], uid: number, transaction?: Transaction) => {
		try {
			const prdPlanType = body.map((prdPlanType) => {
				return {
					prd_plan_type_id: prdPlanType.prd_plan_type_id,
					prd_plan_type_cd: prdPlanType.prd_plan_type_cd,
					prd_plan_type_nm: prdPlanType.prd_plan_type_nm,
					sortby: prdPlanType.sortby,
					created_uid: uid,
					updated_uid: uid,
				}
			});

			const result = await this.repo.bulkCreate(prdPlanType, { individualHooks: true, transaction });

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
					[ Sequelize.col('admPrdPlanType.uuid'), 'prd_plan_type_uuid' ],
          'prd_plan_type_cd',
          'prd_plan_type_nm',
					'sortby',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: params.prd_plan_type_cd ? { prd_plan_type_cd: params.prd_plan_type_cd } : {},
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
					[ Sequelize.col('admPrdPlanType.uuid'), 'prd_plan_type_uuid' ],
					'prd_plan_type_cd',
					'prd_plan_type_nm',
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
	public readRawByUnique = async(params: { prd_plan_type_cd: string }) => {
		const result = await this.repo.findOne({ where: { prd_plan_type_cd: params.prd_plan_type_cd } });
		return convertReadResult(result);
	};

	//#endregion

	//#region 🟡 Update Functions
	
	// 📒 Fn[update]: Default Update Function
	public update = async(body: IAdmPrdPlanType[], uid: number, transaction?: Transaction) => {
		let raws: any[] = [];

		try {
			const previousRaws = await getPreviousRaws(body, this.repo);

			for await (let prdPlanType of body) {
				const result = await this.repo.update(
					{
						prd_plan_type_cd: prdPlanType.prd_plan_type_cd != null ? prdPlanType.prd_plan_type_cd : null,
						prd_plan_type_nm: prdPlanType.prd_plan_type_nm != null ? prdPlanType.prd_plan_type_nm : null,
						sortby: prdPlanType.sortby != null ? prdPlanType.sortby : null,
						updated_uid: uid,
					} as any,
					{ 
						where: { uuid: prdPlanType.uuid },
						returning: true,
						individualHooks: true,
						transaction
					},
				);

				raws.push(result);
			};

			await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmPrdPlanType.getTableName() as string, previousRaws, uid, transaction);
			return convertResult(raws);
		} catch (error) {
			if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
			throw error;
		}
	};

	//#endregion

	//#region 🟠 Patch Functions
	
	// 📒 Fn[patch]: Default Patch Function
	public patch = async(body: IAdmPrdPlanType[], uid: number, transaction?: Transaction) => {
		let raws: any[] = [];

		try {
			const previousRaws = await getPreviousRaws(body, this.repo);

			for await (let prdPlanType of body) {
				const result = await this.repo.update(
					{
						prd_plan_type_id: prdPlanType.prd_plan_type_id,
						prd_plan_type_cd: prdPlanType.prd_plan_type_cd,
						prd_plan_type_nm: prdPlanType.prd_plan_type_nm,
						sortby: prdPlanType.sortby,
						updated_uid: uid,
					},
					{ 
						where: { uuid: prdPlanType.uuid },
						returning: true,
						individualHooks: true,
						transaction
					}
				);

				raws.push(result);
			};

			await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmPrdPlanType.getTableName() as string, previousRaws, uid, transaction);
			return convertResult(raws);
		} catch (error) {
			if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
			throw error;
		}
	};

	//#endregion

	//#region 🔴 Delete Functions
	
	// 📒 Fn[delete]: Default Delete Function
	public delete = async(body: IAdmPrdPlanType[], uid: number, transaction?: Transaction) => {
		let count: number = 0;

		try {      
			const previousRaws = await getPreviousRaws(body, this.repo);

			for await (let prdPlanType of body) {
				count += await this.repo.destroy({ where: { uuid: prdPlanType.uuid }, transaction});
			};

			await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.AdmPrdPlanType.getTableName() as string, previousRaws, uid, transaction);
			return { count, raws: previousRaws };
		} catch (error) {
			throw error;
		}
	};
		
	//#endregion

  //#endregion
}

export default AdmPrdPlanTypeRepo;