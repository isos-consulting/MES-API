import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import MldMold from '../../models/mld/mold.model';
import IMldMold from '../../interfaces/mld/mold.interface';
import { Sequelize } from 'sequelize-typescript';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class MldMoldRepo {
  repo: Repository<MldMold>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(MldMold);
  }
  //#endregion

  //#region ✅ CRUD Functions

	// 📒 Fn[create]: Default Create Function
	public create = async(body: IMldMold[], uid: number, transaction?: Transaction) => {
		try {
			const mold = body.map((mold) => {
				return {
					factory_id: mold.factory_id,
					mold_cd: mold.mold_cd,
					mold_nm: mold.mold_nm,
					mold_no: mold.mold_no,
					cavity: mold.cavity,
					guarantee_cnt: mold.guarantee_cnt,
					basic_cnt: mold.basic_cnt,
					manufacturer: mold.manufacturer,
					purchase_date: mold.purchase_date,
					weight: mold.weight,
					size: mold.size,
					use_fg: mold.use_fg,
					created_uid: uid,
					updated_uid: uid,
				}
			});

			const result = await this.repo.bulkCreate(mold, { individualHooks: true, transaction });

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
            model: this.sequelize.models.StdFactory, 
            attributes: [], 
            required: true, 
            where: { uuid: params.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
					[ Sequelize.col('mldMold.uuid'), 'mold_uuid' ],
					[ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'mold_cd',
          'mold_nm',
					'mold_no',
					'cavity',
					'guarantee_cnt',
					'basic_cnt',
					'manufacturer',
					'purchase_date',
					'weight',
					'size',
					'use_fg',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: params.mold_cd ? { mold_cd: params.mold_cd } : {},
        order: [ 'mold_cd' ],
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
					{ model: this.sequelize.models.StdFactory, attributes: [], required: true },
					{ model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
					{ model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
				],
				attributes: [
					[ Sequelize.col('mldMold.uuid'), 'mold_uuid' ],
					[ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
					'mold_cd',
          'mold_nm',
					'mold_no',
					'cavity',
					'guarantee_cnt',
					'basic_cnt',
					'manufacturer',
					'purchase_date',
					'weight',
					'size',
					'use_fg',
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
  public readRawByUnique = async(
    params: { factory_id: number, mold_cd: string }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { factory_id: params.factory_id },
          { mold_cd: params.mold_cd }
        ]
      }
    });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IMldMold[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let mold of body) {
        const result = await this.repo.update(
          {
						mold_cd: mold.mold_cd != null? mold.mold_cd : null,
						mold_nm: mold.mold_nm != null? mold.mold_nm : null,
						mold_no: mold.mold_no != null? mold.mold_no : null,
						cavity: mold.cavity != null? mold.cavity : null,
						guarantee_cnt: mold.guarantee_cnt != null? mold.guarantee_cnt : null,
						basic_cnt: mold.basic_cnt != null? mold.basic_cnt : null,
						manufacturer: mold.manufacturer != null? mold.manufacturer : null,
						purchase_date: mold.purchase_date != null? mold.purchase_date : null,
						weight: mold.weight != null? mold.weight : null,
						size: mold.size != null? mold.size : null,
						use_fg: mold.use_fg != null? mold.use_fg : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: mold.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', sequelize.models.MldMold.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IMldMold[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let mold of body) {
        const result = await this.repo.update(
          {
						mold_cd: mold.mold_cd,
						mold_nm: mold.mold_nm,
						mold_no: mold.mold_no,
						cavity: mold.cavity,
						guarantee_cnt: mold.guarantee_cnt,
						manufacturer: mold.manufacturer,
						purchase_date: mold.purchase_date,
						weight: mold.weight,
						size: mold.size,
						use_fg: mold.use_fg,
            updated_uid: uid,
          },
          { 
            where: { uuid: mold.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', sequelize.models.MldMold.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

	  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IMldMold[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let mold of body) {
        count += await this.repo.destroy({ where: { uuid: mold.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', sequelize.models.MldMold.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default MldMoldRepo;