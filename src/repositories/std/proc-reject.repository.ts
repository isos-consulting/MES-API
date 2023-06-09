import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdProcReject from '../../models/std/proc-reject.model';
import IStdProcReject from '../../interfaces/std/proc-reject.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';

class StdProcRejectRepo {
  repo: Repository<StdProcReject>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdProcReject);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdProcReject[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((procReject: any) => {
        return this.repo.create(
          {
            factory_id: procReject.factory_id,
            proc_id: procReject.proc_id,
            reject_id: procReject.reject_id,
            remark: procReject.remark,
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
            model: this.sequelize.models.StdProc, 
            attributes: [],
            where: { uuid: params.proc_uuid ? params.proc_uuid : { [Op.ne]: null } }
          },
          { 
            model: this.sequelize.models.StdReject, 
            attributes: [], 
            required: true,
            include: [{ model: this.sequelize.models.StdRejectType, attributes: [], required: false }]
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdProcReject.uuid'), 'proc_reject_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('stdProc.proc_nm'), 'proc_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 
          'factory_id', 
          'proc_id', 
          Sequelize.col('stdReject.stdRejectType.reject_type_id'),
          'reject_id',
          'proc_reject_id' 
        ],
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
          { 
            model: this.sequelize.models.StdReject, 
            attributes: [], 
            required: true,
            include: [{ model: this.sequelize.models.StdRejectType, attributes: [], required: false }]
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdProcReject.uuid'), 'proc_reject_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('stdProc.proc_nm'), 'proc_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
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
    params: { factory_id: number, proc_id: number, reject_id: number }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { factory_id: params.factory_id },
          { proc_id: params.proc_id },
          { reject_id: params.reject_id }
        ]
      }
    });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdProcReject[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((procReject: any) => {
        return this.repo.update(
          {
            factory_id: procReject.factory_id ?? null,
            proc_id: procReject.proc_id ?? null,
            reject_id: procReject.reject_id ?? null,
            remark: procReject.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: procReject.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdProcReject.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdProcReject[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((procReject: any) => {
        return this.repo.update(
          {
            factory_id: procReject.factory_id,
            proc_id: procReject.proc_id,
            reject_id: procReject.reject_id,
            remark: procReject.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: procReject.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdProcReject.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdProcReject[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((procReject: any) => {
        return this.repo.destroy({ where: { uuid: procReject.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdProcReject.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default StdProcRejectRepo;