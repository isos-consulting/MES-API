import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';
import PrdWorkWorker from '../../models/prd/work-worker.model';
import IPrdWorkWorker from '../../interfaces/prd/work-worker.interface';

class PrdWorkWorkerRepo {
  repo: Repository<PrdWorkWorker>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(PrdWorkWorker);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IPrdWorkWorker[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((workWorker: any) => {
        return this.repo.create(
          {
            factory_id: workWorker.factory_id,
            work_id: workWorker.work_id,
            work_routing_id: workWorker.work_routing_id,
            emp_id: workWorker.emp_id,
            start_date: workWorker.start_date,
            end_date: workWorker.end_date,
            work_time: workWorker.work_time,
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
            where: params.factory_uuid ? { uuid: params.factory_uuid } : {}
          },
          { 
            model: this.sequelize.models.PrdWork,
            attributes: [], 
            required: true,
            where: params.work_uuid ? { uuid: params.work_uuid } : {}
          },
          { 
            model: this.sequelize.models.PrdWorkRouting,
            attributes: [], 
            required: true,
            where: params.work_routing_uuid ? { uuid: params.work_routing_uuid } : {}
          },
          { model: this.sequelize.models.StdEmp, attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdWorkWorker.uuid'), 'work_worker_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
          [ Sequelize.col('prdWorkRouting.uuid'), 'work_routing_uuid' ],
          [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
          [ Sequelize.col('stdEmp.emp_nm'), 'emp_nm' ],
          'start_date',
          [ Sequelize.col('prdWorkWorker.start_date'), 'start_time' ],
          'end_date',
          [ Sequelize.col('prdWorkWorker.end_date'), 'end_time' ],
          'work_time',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'work_id', 'work_routing_id', 'emp_id' ]
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
          { model: this.sequelize.models.PrdWork, attributes: [], required: true },
          { model: this.sequelize.models.PrdWorkRouting, attributes: [], required: true },
          { model: this.sequelize.models.StdEmp, attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdWorkWorker.uuid'), 'work_worker_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
          [ Sequelize.col('prdWorkRouting.uuid'), 'work_routing_uuid' ],
          [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
          [ Sequelize.col('stdEmp.emp_nm'), 'emp_nm' ],
          'start_date',
          [ Sequelize.col('prdWorkWorker.start_date'), 'start_time' ],
          'end_date',
          [ Sequelize.col('prdWorkWorker.end_date'), 'end_time' ],
          'work_time',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { uuid }
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

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IPrdWorkWorker[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workWorker: any) => {
        return this.repo.update(
          {
            emp_id: workWorker.emp_id ?? null,
            start_date: workWorker.start_date ?? null,
            end_date: workWorker.end_date ?? null,
            work_time: workWorker.work_time ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: workWorker.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdWorkWorker.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IPrdWorkWorker[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workWorker: any) => {
        return this.repo.update(
          {
            emp_id: workWorker.emp_id,
            start_date: workWorker.start_date,
            end_date: workWorker.end_date,
            work_time: workWorker.work_time,
            updated_uid: uid,
          },
          { 
            where: { uuid: workWorker.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdWorkWorker.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IPrdWorkWorker[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workWorker: any) => {
        return this.repo.destroy({ where: { uuid: workWorker.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.PrdWorkWorker.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
  
  // 📒 Fn[deleteByWorkId]: 생산실적 Id 기준 데이터 삭제
  public deleteByWorkId = async(workId: number, uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await this.repo.findAll({ where: { work_id: workId } })

      const count = await this.repo.destroy({ where: { work_id: workId }, transaction});

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.PrdWorkWorker.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default PrdWorkWorkerRepo;