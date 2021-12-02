import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmInspDetailType from '../../models/adm/insp-detail-type.model';
import IAdmInspDetailType from '../../interfaces/adm/insp-detail-type.interface';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';

class AdmInspDetailTypeRepo {
  repo: Repository<AdmInspDetailType>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(AdmInspDetailType);
  }
  //#endregion

  //#region ✅ CRUD Functions


	// 📒 Fn[create]: Default Create Function
	public create = async(body: IAdmInspDetailType[], uid: number, transaction?: Transaction) => {
		try {
			const insp_detail_type = body.map((insp_detail_type) => {
				return {
					insp_detail_type_id: insp_detail_type.insp_detail_type_id,
					insp_detail_type_cd: insp_detail_type.insp_detail_type_cd,
					insp_detail_type_nm: insp_detail_type.insp_detail_type_nm,
					insp_type_cd: insp_detail_type.insp_type_cd,
					sortby: insp_detail_type.sortby,
					worker_fg: insp_detail_type.worker_fg,
					inspector_fg: insp_detail_type.inspector_fg,
					created_uid: uid,
					updated_uid: uid,
				}
			});

			const result = await this.repo.bulkCreate(insp_detail_type, { individualHooks: true, transaction });

			return convertBulkResult(result);
		} catch (error) {
			if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
			throw error;
		}
	};

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
          'insp_detail_type_cd',
          'insp_detail_type_nm',
          'insp_type_cd',
          'worker_fg',
          'inspector_fg',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { 
          [Op.and]: [
            { insp_type_cd: params.insp_type_cd ? params.insp_type_cd : { [Op.ne]: null }},
            { insp_detail_type_cd: params.insp_detail_type_cd ? params.insp_detail_type_cd : { [Op.ne]: null }}
          ]
        },
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
					[ Sequelize.col('admInspDetailType.uuid'), 'insp_detail_type_uuid' ],
					'insp_detail_type_cd',
          'insp_detail_type_nm',
          'insp_type_cd',
          'worker_fg',
          'inspector_fg',
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
					[ Sequelize.col('admInspDetailType.uuid'), 'insp_detail_type_uuid' ],
					'insp_detail_type_cd',
          'insp_detail_type_nm',
          'insp_type_cd',
          'worker_fg',
          'inspector_fg',
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
	public readRawByUnique = async(params: { insp_detail_type_cd: string }) => {
		const result = await this.repo.findOne({ where: { insp_detail_type_cd: params.insp_detail_type_cd } });
		return convertReadResult(result);
	};

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IAdmInspDetailType[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp_detail_type of body) {
        const result = await this.repo.update(
          {
            insp_detail_type_id: insp_detail_type.insp_detail_type_id != null ? insp_detail_type.insp_detail_type_id : null,
            insp_detail_type_cd: insp_detail_type.insp_detail_type_cd != null ? insp_detail_type.insp_detail_type_cd : null,
						insp_detail_type_nm: insp_detail_type.insp_detail_type_nm != null ? insp_detail_type.insp_detail_type_nm : null,
						insp_type_cd: insp_detail_type.insp_type_cd != null ? insp_detail_type.insp_type_cd : null,
						sortby: insp_detail_type.sortby != null ? insp_detail_type.sortby : null,
						worker_fg: insp_detail_type.worker_fg != null ? insp_detail_type.worker_fg : null,
						inspector_fg: insp_detail_type.inspector_fg != null ? insp_detail_type.inspector_fg : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: insp_detail_type.uuid },
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
  public patch = async(body: IAdmInspDetailType[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp_detail_type of body) {
        const result = await this.repo.update(
          {
            insp_detail_type_id: insp_detail_type.insp_detail_type_id,
						insp_detail_type_cd: insp_detail_type.insp_detail_type_cd,
						insp_detail_type_nm: insp_detail_type.insp_detail_type_nm,
						insp_type_cd: insp_detail_type.insp_type_cd,
						sortby: insp_detail_type.sortby,
						worker_fg: insp_detail_type.worker_fg,
						inspector_fg: insp_detail_type.inspector_fg,
            updated_uid: uid,
          },
          { 
            where: { uuid: insp_detail_type.uuid },
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
  public delete = async(body: IAdmInspDetailType[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp_detail_type of body) {
        count += await this.repo.destroy({ where: { uuid: insp_detail_type.uuid }, transaction});
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

export default AdmInspDetailTypeRepo;