import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdWorkings from '../../models/std/workings.model';
import IStdWorkings from '../../interfaces/std/workings.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';

class StdWorkingsRepo {
  repo: Repository<StdWorkings>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdWorkings);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdWorkings[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((workings: any) => {
        return this.repo.create(
          {
            factory_id: workings.factory_id,
            workings_cd: workings.workings_cd,
            workings_nm: workings.workings_nm,
            worker_group_id: workings.worker_group_id,
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
          { 
            model: this.sequelize.models.StdWorkerGroup, 
            attributes: [], 
            required: false, 
            where: { uuid: params.worker_group_uuid ? params.worker_group_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdWorkings.uuid'), 'workings_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'workings_cd',
          'workings_nm',
          [ Sequelize.col('stdWorkerGroup.uuid'), 'worker_group_uuid' ],
          [ Sequelize.col('stdWorkerGroup.worker_group_cd'), 'worker_group_cd' ],
          [ Sequelize.col('stdWorkerGroup.worker_group_nm'), 'worker_group_nm' ],
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'workings_id' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.repo.findOne({ 
        include: [
          { model: this.sequelize.models.StdFactory, attributes: [], required: true },
          { model: this.sequelize.models.StdWorkerGroup, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdWorkings.uuid'), 'workings_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'workings_cd',
          'workings_nm',
          [ Sequelize.col('stdWorkerGroup.uuid'), 'worker_group_uuid' ],
          [ Sequelize.col('stdWorkerGroup.worker_group_cd'), 'worker_group_cd' ],
          [ Sequelize.col('stdWorkerGroup.worker_group_nm'), 'worker_group_nm' ],
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
    params: { factory_id: number, workings_cd: string }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { factory_id: params.factory_id },
          { workings_cd: params.workings_cd }
        ]
      }
    });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdWorkings[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workings: any) => {
        return this.repo.update(
          {
            workings_cd: workings.workings_cd ?? null,
            workings_nm: workings.workings_nm ?? null,
            worker_group_id: workings.worker_group_id ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: workings.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdWorkings.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdWorkings[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workings: any) => {
        return this.repo.update(
          {
            workings_cd: workings.workings_cd,
            workings_nm: workings.workings_nm,
            worker_group_id: workings.worker_group_id,
            updated_uid: uid,
          },
          { 
            where: { uuid: workings.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdWorkings.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdWorkings[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workings: any) => {
        return this.repo.destroy({ where: { uuid: workings.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdWorkings.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
  
  //#endregion

  //#endregion
}

export default StdWorkingsRepo;