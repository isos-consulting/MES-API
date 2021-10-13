import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import PrdWorkReject from '../../models/prd/work-reject.model';
import IPrdWorkReject from '../../interfaces/prd/work-reject.interface';
import { readWorkRejectReport } from '../../queries/prd/work-reject-report.query';

class PrdWorkRejectRepo {
  repo: Repository<PrdWorkReject>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(PrdWorkReject);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IPrdWorkReject[], uid: number, transaction?: Transaction) => {
    try {
      const workRejects = body.map((workReject) => {
        return {
          factory_id: workReject.factory_id,
          work_id: workReject.work_id,
          proc_id: workReject.proc_id,
          reject_id: workReject.reject_id,
          qty: workReject.qty,
          to_store_id: workReject.to_store_id,
          to_location_id: workReject.to_location_id,
          remark: workReject.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(workRejects, { individualHooks: true, transaction });

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
            model: sequelize.models.StdFactory, 
            attributes: [], 
            required: true,
            where: params.factory_uuid ? { uuid: params.factory_uuid } : {}
          },
          { 
            model: sequelize.models.PrdWork,
            attributes: [], 
            required: true,
            where: params.work_uuid ? { uuid: params.work_uuid } : {}
          },
          { model: sequelize.models.StdProc, attributes: [], required: false },
          { 
            model: sequelize.models.StdReject,
            attributes: [],
            required: true,
            include: [{ 
              model: sequelize.models.StdRejectType,
              attributes: [],
              required: false,
              where: params.reject_type_uuid ? { uuid: params.reject_type_uuid } : {}
            }],
            where: params.reject_uuid ? { uuid: params.reject_uuid } : {}
          },
          { model: sequelize.models.StdStore, attributes: [], required: false },
          { model: sequelize.models.StdLocation, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdWorkReject.uuid'), 'work_reject_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
          [ Sequelize.col('stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('stdProc.proc_nm'), 'proc_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
          'qty',
          [ Sequelize.col('stdStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'to_location_nm' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'work_id', Sequelize.col('stdReject.reject_type_id') ]
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
          { model: sequelize.models.StdFactory, attributes: [], required: true },
          { model: sequelize.models.PrdWork, attributes: [], required: true },
          { model: sequelize.models.StdProc, attributes: [], required: false },
          { 
            model: sequelize.models.StdReject,
            attributes: [],
            required: true,
            include: [{ model: sequelize.models.StdRejectType, attributes: [], required: false }]
          },
          { model: sequelize.models.StdStore, attributes: [], required: false },
          { model: sequelize.models.StdLocation, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdWorkReject.uuid'), 'work_reject_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
          [ Sequelize.col('stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('stdProc.proc_nm'), 'proc_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
          'qty',
          [ Sequelize.col('stdStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'to_location_nm' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where : { uuid }
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

  // 📒 Fn[readRawsByWorkId]: 생산실적의 Id를 이용하여 Raw Data Read Function
  public readRawsByWorkId = async(workId: number, transaction?: Transaction) => {
    const result = await this.repo.findAll({ where: { work_id: workId }, transaction });
    return convertReadResult(result);
  };

  // 📒 Fn[readReport]: Read Order Repot Function
  public readReport = async(params?: any) => {
    try {
      const result = await sequelize.query(readWorkRejectReport(params));
      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[getWorkRejectIdsByWorkId]: 생산실적의 Id를 이용하여 PK Read Function
  public getWorkRejectIdsByWorkId = async(workId: number, transaction?: Transaction) => {
    const result = await this.repo.findAll({
      attributes: [ 'work_reject_id' ],
      where: { work_id: workId }, 
      transaction 
    });
    const converted = convertReadResult(result);
    const workRejectIds: number[] = []; 
    converted.raws.forEach((raw: any) => { workRejectIds.push(raw.work_reject_id); });

    return workRejectIds;
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IPrdWorkReject[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let workReject of body) {
        const result = await this.repo.update(
          {
            qty: workReject.qty != null ? workReject.qty : null,
            remark: workReject.remark != null ? workReject.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: workReject.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.PrdWorkReject.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IPrdWorkReject[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let workReject of body) {
        const result = await this.repo.update(
          {
            qty: workReject.qty,
            remark: workReject.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: workReject.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.PrdWorkReject.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IPrdWorkReject[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let workReject of body) {
        count += await this.repo.destroy({ where: { uuid: workReject.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.PrdWorkReject.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[deleteByWorkId]: 생산실적 Id 기준 데이터 삭제
  public deleteByWorkId = async(workId: number, uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await this.repo.findAll({ where: { work_id: workId } })

      count += await this.repo.destroy({ where: { work_id: workId }, transaction});

      await new AdmLogRepo().create('delete', sequelize.models.PrdWorkReject.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default PrdWorkRejectRepo;