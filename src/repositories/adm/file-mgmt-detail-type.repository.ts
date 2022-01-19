import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmFileMgmtDetailType from '../../models/adm/file-mgmt-detail-type.model';
import IAdmFileMgmtDetailType from '../../interfaces/adm/file-mgmt-detail-type.interface';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class AdmFileMgmtDetailTypeRepo {
  repo: Repository<AdmFileMgmtDetailType>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmFileMgmtDetailType);
  }
  //#endregion

  //#region ✅ CRUD Functions

	// 📒 Fn[create]: Default Create Function
	public create = async(body: IAdmFileMgmtDetailType[], uid: number, transaction?: Transaction) => {
		try {
			const fileMgmtDetailTypes = body.map((fileMgmtDetailType) => {
				return {
					file_mgmt_detail_type_cd: fileMgmtDetailType.file_mgmt_detail_type_cd,
					file_mgmt_detail_type_nm: fileMgmtDetailType.file_mgmt_detail_type_nm,
					file_mgmt_type_id: fileMgmtDetailType.file_mgmt_type_id,
					file_extension_types: fileMgmtDetailType.file_extension_types,
					sortby: fileMgmtDetailType.sortby,
					created_uid: uid,
					updated_uid: uid,
				}
			});

			const result = await this.repo.bulkCreate(fileMgmtDetailTypes, { individualHooks: true, transaction });

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
          { 
            model: this.sequelize.models.AdmFileMgmtType, 
            attributes: [], 
            required: true,
            where: {
              [Op.and]: [
                { file_mgmt_type_cd: params.file_mgmt_type_cd ?? { [Op.ne]: null } },
                { uuid: params.file_mgmt_type_uuid ?? { [Op.ne]: null } },
              ]
            }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
					[ Sequelize.col('admFileMgmtDetailType.uuid'), 'file_mgmt_detail_type_uuid' ],
          'file_mgmt_detail_type_cd',
          'file_mgmt_detail_type_nm',
          [ Sequelize.col('admFileMgmtType.uuid'), 'file_mgmt_type_uuid' ],
          [ Sequelize.col('admFileMgmtType.file_mgmt_type_cd'), 'file_mgmt_type_cd' ],
          [ Sequelize.col('admFileMgmtType.file_mgmt_type_nm'), 'file_mgmt_type_nm' ],
          'file_extension_types',
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
					[ Sequelize.col('admFileMgmtDetailType.uuid'), 'file_mgmt_detail_type_uuid' ],
					'file_mgmt_detail_type_cd',
          'file_mgmt_detail_type_nm',
          [ Sequelize.col('admFileMgmtType.uuid'), 'file_mgmt_type_uuid' ],
          [ Sequelize.col('admFileMgmtType.file_mgmt_type_cd'), 'file_mgmt_type_cd' ],
          [ Sequelize.col('admFileMgmtType.file_mgmt_type_nm'), 'file_mgmt_type_nm' ],
          'file_extension_types',
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
	public readRawByUnique = async(params: { file_mgmt_detail_type_cd: string }) => {
		const result = await this.repo.findOne({ where: { file_mgmt_detail_type_cd: params.file_mgmt_detail_type_cd } });
		return convertReadResult(result);
	};

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IAdmFileMgmtDetailType[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let fileMgmtDetailType of body) {
        const result = await this.repo.update(
          {
            file_mgmt_detail_type_cd: fileMgmtDetailType.file_mgmt_detail_type_cd ?? null,
						file_mgmt_detail_type_nm: fileMgmtDetailType.file_mgmt_detail_type_nm ?? null,
						file_mgmt_type_id: fileMgmtDetailType.file_mgmt_type_id ?? null,
						file_extension_types: fileMgmtDetailType.file_extension_types ?? null,
						sortby: fileMgmtDetailType.sortby ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: fileMgmtDetailType.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmFileMgmtDetailType.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAdmFileMgmtDetailType[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let fileMgmtDetailType of body) {
        const result = await this.repo.update(
          {
						file_mgmt_detail_type_cd: fileMgmtDetailType.file_mgmt_detail_type_cd,
						file_mgmt_detail_type_nm: fileMgmtDetailType.file_mgmt_detail_type_nm,
            file_mgmt_type_id: fileMgmtDetailType.file_mgmt_type_id,
						file_extension_types: fileMgmtDetailType.file_extension_types,
						sortby: fileMgmtDetailType.sortby,
            updated_uid: uid,
          },
          { 
            where: { uuid: fileMgmtDetailType.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmFileMgmtDetailType.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

	//#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAdmFileMgmtDetailType[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let fileMgmtDetailType of body) {
        count += await this.repo.destroy({ where: { uuid: fileMgmtDetailType.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.AdmFileMgmtDetailType.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AdmFileMgmtDetailTypeRepo;