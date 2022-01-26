import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import MldMold from '../../models/mld/mold.model';
import IMldMold from '../../interfaces/mld/mold.interface';
import { Sequelize } from 'sequelize-typescript';
import sequelize from '../../models';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';
import { readMoldReport } from '../../queries/mld/mold-report.query';

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
			const promises = body.map((mold: any) => {
        return this.repo.create(
          {
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
        where: { use_fg: params.use_fg ?? { [Op.ne]: null } },
        order: [ 'mold_cd' ]
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

  public readReport = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readMoldReport(params));

      return convertReadResult(result[0]);
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
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((mold: any) => {
        return this.repo.update(
          {
						mold_cd: mold.mold_cd ?? null,
						mold_nm: mold.mold_nm ?? null,
						mold_no: mold.mold_no ?? null,
						cavity: mold.cavity ?? null,
						guarantee_cnt: mold.guarantee_cnt ?? null,
						basic_cnt: mold.basic_cnt ?? null,
						manufacturer: mold.manufacturer ?? null,
						purchase_date: mold.purchase_date ?? null,
						weight: mold.weight ?? null,
						size: mold.size ?? null,
						use_fg: mold.use_fg ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: mold.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

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
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((mold: any) => {
        return this.repo.update(
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
      });
      const raws = await Promise.all(promises);

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
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((mold: any) => {
        return this.repo.destroy({ where: { uuid: mold.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

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