import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdShift from '../../models/std/shift.model';
import IStdShift from '../../interfaces/std/shift.interface';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';

class StdShiftRepo {
  repo: Repository<StdShift>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(StdShift);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdShift[], uid: number, transaction?: Transaction) => {
    try {
      const shift = body.map((shift) => {
        return {
          factory_id: shift.factory_id,
          shift_cd: shift.shift_cd,
          shift_nm: shift.shift_nm,
          start_time: shift.start_time,
          end_time: shift.end_time,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(shift, { individualHooks: true, transaction });

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
            where: { uuid: params.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
          },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdShift.uuid'), 'shift_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'shift_cd',
          'shift_nm',
          'start_time',
          'end_time',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'shift_id' ],
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
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdShift.uuid'), 'shift_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'shift_cd',
          'shift_nm',
          'start_time',
          'end_time',
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
    params: { factory_id: number, shift_cd: string }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { factory_id: params.factory_id },
          { shift_cd: params.shift_cd }
        ]
      }
    });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdShift[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let shift of body) {
        const result = await this.repo.update(
          {
            shift_cd: shift.shift_cd != null ? shift.shift_cd : null,
            shift_nm: shift.shift_nm != null ? shift.shift_nm : null,
            start_time: shift.start_time != null ? shift.start_time : null,
            end_time: shift.end_time != null ? shift.end_time : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: shift.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.StdShift.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdShift[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let shift of body) {
        const result = await this.repo.update(
          {
            shift_cd: shift.shift_cd,
            shift_nm: shift.shift_nm,
            start_time: shift.start_time,
            end_time: shift.end_time,
            updated_uid: uid,
          },
          { 
            where: { uuid: shift.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.StdShift.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdShift[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let shift of body) {
        count += await this.repo.destroy({ where: { uuid: shift.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.StdShift.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default StdShiftRepo;