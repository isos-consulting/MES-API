import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
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
import StdWorkCalendar from '../../models/std/work-calendar.model';
import IStdWorkCalendar from '../../interfaces/std/work-calendar.interface';

class StdWorkCalendarRepo {
  repo: Repository<StdWorkCalendar>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdWorkCalendar);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdWorkCalendar[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((workcalendar: any) => {
        return this.repo.create(
          {
            work_type_id: workcalendar.work_type_id,
            week_no: workcalendar.week_no,
            day_no: workcalendar.day_no,
            day_value: workcalendar.day_value,
            workcalendar_fg: workcalendar.workcalendar_fg,
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
          { model: this.sequelize.models.StdWorkType, attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdWorkCalendar.uuid'), 'workcalendar_uuid' ],
          [ Sequelize.col('stdWorkType.uuid'), 'work_type_uuid' ],
          [ Sequelize.col('stdWorkType.work_type_cd'), 'work_type_cd' ],
          [ Sequelize.col('stdWorkType.work_type_nm'), 'work_type_nm' ],
          [ Sequelize.col('stdWorkType.use_fg'), 'work_type_use_fg' ],
          'week_no',
          'day_no',
          'day_value',
          'workcalendar_fg',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { day_no: {[Op.between]: [ params?.start_date as any, params?.end_date as any ]} },
        order: [ 'workcalendar_id' ],
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
          { model: this.sequelize.models.StdWorkType, attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdWorkcalendar.uuid'), 'workcalendar_uuid' ],
          [ Sequelize.col('stdWorkType.uuid'), 'work_type_uuid' ],
          [ Sequelize.col('stdWorkType.work_type_cd'), 'work_type_cd' ],
          [ Sequelize.col('stdWorkType.work_type_nm'), 'work_type_nm' ],
          [ Sequelize.col('stdWorkType.use_fg'), 'work_type_use_fg' ],
          'workcalendar_month',
          'week_no',
          'day_no',
          'day_value',
          'workcalendar_fg',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'workcalendar_id' ],
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
    params: { workcalendar_id: number }
  ) => {
    const result = await this.repo.findOne({ 
      where: { workcalendar_id: params.workcalendar_id }
    });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdWorkCalendar[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workcalendar: any) => {
        return this.repo.update(
          {
            work_type_id: workcalendar.work_type_id,
            week_no: workcalendar.week_no,
            day_no: workcalendar.day_no,
            day_value: workcalendar.day_value,
            workcalendar_fg: workcalendar.workcalendar_fg,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: workcalendar.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdWorkCalendar.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdWorkCalendar[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workcalendar: any) => {
        return this.repo.update(
          {
            work_type_id: workcalendar?.work_type_id,
            week_no: workcalendar.week_no,
            day_no: workcalendar?.day_no,
            day_value: workcalendar?.day_value,
            workcalendar_fg: workcalendar?.workcalendar_fg,
            updated_uid: uid,
          },
          { 
            where: { uuid: workcalendar.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdWorkCalendar.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdWorkCalendar[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workcalendar: any) => {
        return this.repo.destroy({ where: { uuid: workcalendar.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdWorkCalendar.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
  
  //#endregion

  //#endregion
}

export default StdWorkCalendarRepo;