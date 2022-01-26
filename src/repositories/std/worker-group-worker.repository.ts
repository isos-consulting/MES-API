import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdWorkerGroupWorker from '../../models/std/worker-group-worker.model';
import IStdWorkerGroupWorker from '../../interfaces/std/worker-group-worker.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';

class StdWorkerGroupWorkerRepo {
  repo: Repository<StdWorkerGroupWorker>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdWorkerGroupWorker);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdWorkerGroupWorker[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((workerGroupWorker: any) => {
        return this.repo.create(
          {
            factory_id: workerGroupWorker.factory_id,
            worker_group_id: workerGroupWorker.worker_group_id,
            worker_id: workerGroupWorker.worker_id,
            remark: workerGroupWorker.remark,
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
            required: true, 
            where: { uuid: params.worker_group_uuid ? params.worker_group_uuid : { [Op.ne]: null } }
          },
          { 
            model: this.sequelize.models.StdWorker, 
            attributes: [], 
            required: true, 
            where: { uuid: params.worker_uuid ? params.worker_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdWorkerGroupWorker.uuid'), 'worker_group_worker_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdWorkerGroup.uuid'), 'worker_group_uuid' ],
          [ Sequelize.col('stdWorkerGroup.worker_group_cd'), 'worker_group_cd' ],
          [ Sequelize.col('stdWorkerGroup.worker_group_nm'), 'worker_group_nm' ],
          [ Sequelize.col('stdWorker.uuid'), 'worker_uuid' ],
          [ Sequelize.col('stdWorker.worker_nm'), 'worker_nm' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'worker_group_id' ],
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
          { model: this.sequelize.models.StdWorkerGroup, attributes: [], required: true },
          { model: this.sequelize.models.StdWorker, attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdWorkerGroupWorker.uuid'), 'worker_group_worker_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdWorkerGroup.uuid'), 'worker_group_uuid' ],
          [ Sequelize.col('stdWorkerGroup.worker_group_cd'), 'worker_group_cd' ],
          [ Sequelize.col('stdWorkerGroup.worker_group_nm'), 'worker_group_nm' ],
          [ Sequelize.col('stdWorker.uuid'), 'worker_uuid' ],
          [ Sequelize.col('stdWorker.worker_nm'), 'worker_nm' ],
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
    params: { worker_group_id: number, worker_id: number }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { worker_group_id: params.worker_group_id },
          { worker_id: params.worker_id }
        ]
      }
    });
    return convertReadResult(result);
  };

  // 📒 Fn[readWorkerInGroup]: 작업조에 포함된 작업자 조회
  public readWorkerInGroup = async(groupId: number) => {
    try {
      const result = await this.repo.findAll({ 
        where: { worker_group_id: groupId }
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdWorkerGroupWorker[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workerGroupWorker: any) => {
        return this.repo.update(
          {
            remark: workerGroupWorker.remark != null ? workerGroupWorker.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: workerGroupWorker.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdWorkerGroupWorker.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdWorkerGroupWorker[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workerGroupWorker: any) => {
        return this.repo.update(
          {
            remark: workerGroupWorker.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: workerGroupWorker.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdWorkerGroupWorker.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdWorkerGroupWorker[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workerGroupWorker: any) => {
        return this.repo.destroy({ where: { uuid: workerGroupWorker.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdWorkerGroupWorker.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
  
  //#endregion

  //#endregion
}

export default StdWorkerGroupWorkerRepo;