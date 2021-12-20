import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdWorker from '../../models/std/worker.model';
import IStdWorker from '../../interfaces/std/worker.interface';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class StdWorkerRepo {
  repo: Repository<StdWorker>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdWorker);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdWorker[], uid: number, transaction?: Transaction) => {
    try {
      const worker = body.map((worker) => {
        return {
          factory_id: worker.factory_id,
          proc_id: worker.proc_id,
          workings_id: worker.workings_id,
          emp_id: worker.emp_id,
          worker_cd: worker.worker_cd,
          worker_nm: worker.worker_nm,
          remark: worker.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(worker, { individualHooks: true, transaction });

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
          { model: this.sequelize.models.StdProc, attributes: [], required: false },
          { model: this.sequelize.models.StdWorkings, attributes: [], required: false },
          { model: this.sequelize.models.StdEmp, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdWorker.uuid'), 'worker_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('stdProc.proc_nm'), 'proc_nm' ],
          [ Sequelize.col('stdWorkings.uuid'), 'workings_uuid' ],
          [ Sequelize.col('stdWorkings.workings_cd'), 'workings_cd' ],
          [ Sequelize.col('stdWorkings.workings_nm'), 'workings_nm' ],
          [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
          [ Sequelize.col('stdEmp.emp_cd'), 'emp_cd' ],
          [ Sequelize.col('stdEmp.emp_nm'), 'emp_nm' ],
          'worker_cd',
          'worker_nm',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'workings_id', 'proc_id', 'worker_id' ],
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
          { model: this.sequelize.models.StdProc, attributes: [], required: false },
          { model: this.sequelize.models.StdWorkings, attributes: [], required: false },
          { model: this.sequelize.models.StdEmp, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdWorker.uuid'), 'worker_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('stdProc.proc_nm'), 'proc_nm' ],
          [ Sequelize.col('stdWorkings.uuid'), 'workings_uuid' ],
          [ Sequelize.col('stdWorkings.workings_cd'), 'workings_cd' ],
          [ Sequelize.col('stdWorkings.workings_nm'), 'workings_nm' ],
          [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
          [ Sequelize.col('stdEmp.emp_cd'), 'emp_cd' ],
          [ Sequelize.col('stdEmp.emp_nm'), 'emp_nm' ],
          'worker_cd',
          'worker_nm',
          'remark',
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
    params: { factory_id: number, worker_cd: string }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { factory_id: params.factory_id },
          { worker_cd: params.worker_cd ? params.worker_cd : null }
        ]
      }
    });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdWorker[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let worker of body) {
        const result = await this.repo.update(
          {
            proc_id: worker.proc_id != null ? worker.proc_id : null,
            workings_id: worker.workings_id != null ? worker.workings_id : null,
            emp_id: worker.emp_id != null ? worker.emp_id : null,
            worker_cd: worker.worker_cd != null ? worker.worker_cd : null,
            worker_nm: worker.worker_nm != null ? worker.worker_nm : null,
            remark: worker.remark != null ? worker.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: worker.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdWorker.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdWorker[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let worker of body) {
        const result = await this.repo.update(
          {
            proc_id: worker.proc_id,
            workings_id: worker.workings_id,
            emp_id: worker.emp_id,
            worker_cd: worker.worker_cd,
            worker_nm: worker.worker_nm,
            remark: worker.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: worker.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdWorker.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdWorker[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let worker of body) {
        count += await this.repo.destroy({ where: { uuid: worker.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdWorker.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
  
  //#endregion

  //#endregion
}

export default StdWorkerRepo;