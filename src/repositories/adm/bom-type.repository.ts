import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmBomType from '../../models/adm/bom-type.model';
import IAdmBomType from '../../interfaces/adm/bom-type.interface';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';

class AdmBomTypeRepo {
  repo: Repository<AdmBomType>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(AdmBomType);
  }
  //#endregion

  //#region ✅ CRUD Functions

	// 📒 Fn[create]: Default Create Function
	public create = async(body: IAdmBomType[], uid: number, transaction?: Transaction) => {
		try {
			const bom_type = body.map((bom_type) => {
				return {
					bom_type_id: bom_type.bom_type_id,
					bom_type_cd: bom_type.bom_type_cd,
					bom_type_nm: bom_type.bom_type_nm,
					sortby: bom_type.sortby,
					created_uid: uid,
					updated_uid: uid,
				}
			});

			const result = await this.repo.bulkCreate(bom_type, { individualHooks: true, transaction });

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
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          'bom_type_cd',
          'bom_type_nm',
					'sortby',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: params.bom_type_cd ? { bom_type_cd: params.bom_type_cd } : {},
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
					{ model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
					{ model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
				],
				attributes: [
					[ Sequelize.col('admBomType.uuid'), 'bom_type_uuid' ],
					'bom_type_cd',
          'bom_type_nm',
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

	public readForSignIn = async() => {
		try {
			const result = await this.repo.findAll({
				attributes: [
					[ Sequelize.col('admBomType.uuid'), 'bom_type_uuid' ],
					'bom_type_cd',
          'bom_type_nm',
					'sortby',
				]
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
	public readRawByUnique = async(params: { bom_type_cd: string }) => {
		const result = await this.repo.findOne({ where: { bom_type_cd: params.bom_type_cd } });
		return convertReadResult(result);
	};

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IAdmBomType[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let bom_type of body) {
        const result = await this.repo.update(
          {
						bom_type_id: bom_type.bom_type_id != null? bom_type.bom_type_id : null,
						bom_type_cd: bom_type.bom_type_cd != null? bom_type.bom_type_cd : null,
						bom_type_nm: bom_type.bom_type_nm != null? bom_type.bom_type_nm : null,
						sortby: bom_type.sortby != null ? bom_type.sortby : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: bom_type.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.StdFactory.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAdmBomType[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let bom_type of body) {
        const result = await this.repo.update(
          {
						bom_type_id: bom_type.bom_type_id,
						bom_type_cd: bom_type.bom_type_cd,
						bom_type_nm: bom_type.bom_type_nm,
						sortby: bom_type.sortby,
            updated_uid: uid,
          },
          { 
            where: { uuid: bom_type.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.StdFactory.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

	  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAdmBomType[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let bom_type of body) {
        count += await this.repo.destroy({ where: { uuid: bom_type.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.StdFactory.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AdmBomTypeRepo;