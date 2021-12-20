import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmInspType from '../../models/adm/insp-type.model';
import IAdmInspType from '../../interfaces/adm/insp-type.interface';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class AdmInspTypeRepo {
  repo: Repository<AdmInspType>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmInspType);
  }
  //#endregion

  //#region ✅ CRUD Functions

	// 📒 Fn[create]: Default Create Function
	public create = async(body: IAdmInspType[], uid: number, transaction?: Transaction) => {
		try {
			const insp_type = body.map((insp_type) => {
				return {
					insp_type_id: insp_type.insp_type_id,
					insp_type_cd: insp_type.insp_type_cd,
					insp_type_nm: insp_type.insp_type_nm,
					worker_fg: insp_type.worker_fg,
					inspector_fg: insp_type.inspector_fg,
					sortby: insp_type.sortby,
					created_uid: uid,
					updated_uid: uid,
				}
			});

			const result = await this.repo.bulkCreate(insp_type, { individualHooks: true, transaction });

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
          'insp_type_cd',
          'insp_type_nm',
          'worker_fg',
          'inspector_fg',
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
					[ Sequelize.col('admInspType.uuid'), 'insp_type_uuid' ],
					'insp_type_cd',
          'insp_type_nm',
          'worker_fg',
					'inspector_fg',
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
	public readRawByUnique = async(params: { insp_type_cd: string }) => {
		const result = await this.repo.findOne({ where: { insp_type_cd: params.insp_type_cd } });
		return convertReadResult(result);
	};

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IAdmInspType[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp_type of body) {
        const result = await this.repo.update(
          {
            insp_type_id: insp_type.insp_type_id != null ? insp_type.insp_type_id : null,
            insp_type_cd: insp_type.insp_type_cd != null ? insp_type.insp_type_cd : null,
						insp_type_nm: insp_type.insp_type_nm != null ? insp_type.insp_type_nm : null,
						worker_fg: insp_type.worker_fg != null ? insp_type.worker_fg : null,
						inspector_fg: insp_type.inspector_fg != null ? insp_type.inspector_fg : null,
						sortby: insp_type.sortby != null ? insp_type.sortby : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: insp_type.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmInspType.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAdmInspType[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp_type of body) {
        const result = await this.repo.update(
          {
            insp_type_id: insp_type.insp_type_id,
						insp_type_cd: insp_type.insp_type_cd,
						insp_type_nm: insp_type.insp_type_nm,
						worker_fg: insp_type.worker_fg,
						inspector_fg: insp_type.inspector_fg,
						sortby: insp_type.sortby,
            updated_uid: uid,
          },
          { 
            where: { uuid: insp_type.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmInspType.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

	//#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAdmInspType[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp_type of body) {
        count += await this.repo.destroy({ where: { uuid: insp_type.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.AdmInspType.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AdmInspTypeRepo;