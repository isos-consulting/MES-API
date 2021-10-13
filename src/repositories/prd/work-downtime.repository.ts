import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import PrdWorkDowntime from '../../models/prd/work-downtime.model';
import IPrdWorkDowntime from '../../interfaces/prd/work-downtime.interface';
import { readWorkDowntimeReport } from '../../queries/prd/work-downtime-report.query';

class PrdWorkDowntimeRepo {
  repo: Repository<PrdWorkDowntime>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(PrdWorkDowntime);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IPrdWorkDowntime[], uid: number, transaction?: Transaction) => {
    try {
      const workDowntimes = body.map((workDowntime) => {
        return {
          factory_id: workDowntime.factory_id,
          work_id: workDowntime.work_id,
          proc_id: workDowntime.proc_id,
          equip_id: workDowntime.equip_id,
          downtime_id: workDowntime.downtime_id,
          start_date: workDowntime.start_date,
          end_date: workDowntime.end_date,
          downtime: workDowntime.downtime,
          remark: workDowntime.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(workDowntimes, { individualHooks: true, transaction });

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
          { model: sequelize.models.StdEquip, attributes: [], required: false },
          { 
            model: sequelize.models.StdDowntime,
            attributes: [],
            required: true,
            include: [{ 
              model: sequelize.models.StdDowntimeType,
              attributes: [],
              required: false,
              where: params.downtime_type_uuid ? { uuid: params.downtime_type_uuid } : {}
            }],
            where: params.downtime_uuid ? { uuid: params.downtime_uuid } : {}
          },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdWorkDowntime.uuid'), 'work_downtime_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
          [ Sequelize.col('stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('stdProc.proc_nm'), 'proc_nm' ],
          [ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
          [ Sequelize.col('stdDowntime.uuid'), 'downtime_uuid' ],
          [ Sequelize.col('stdDowntime.downtime_cd'), 'downtime_cd' ],
          [ Sequelize.col('stdDowntime.downtime_nm'), 'downtime_nm' ],
          [ Sequelize.col('stdDowntime.stdDowntimeType.uuid'), 'downtime_type_uuid' ],
          [ Sequelize.col('stdDowntime.stdDowntimeType.downtime_type_cd'), 'downtime_type_cd' ],
          [ Sequelize.col('stdDowntime.stdDowntimeType.downtime_type_nm'), 'downtime_type_nm' ],
          'start_date',
          [ Sequelize.col('prdWorkDowntime.start_date'), 'start_time' ],
          'end_date',
          [ Sequelize.col('prdWorkDowntime.end_date'), 'end_time' ],
          'downtime',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'work_id', Sequelize.col('stdDowntime.downtime_type_id') ]
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
          { model: sequelize.models.StdEquip, attributes: [], required: false },
          { 
            model: sequelize.models.StdDowntime,
            attributes: [],
            required: true,
            include: [{ model: sequelize.models.StdDowntimeType, attributes: [], required: false }],
          },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdWorkDowntime.uuid'), 'work_downtime_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
          [ Sequelize.col('stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('stdProc.proc_nm'), 'proc_nm' ],
          [ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
          [ Sequelize.col('stdDowntime.uuid'), 'downtime_uuid' ],
          [ Sequelize.col('stdDowntime.downtime_cd'), 'downtime_cd' ],
          [ Sequelize.col('stdDowntime.downtime_nm'), 'downtime_nm' ],
          [ Sequelize.col('stdDowntime.stdDowntimeType.uuid'), 'downtime_type_uuid' ],
          [ Sequelize.col('stdDowntime.stdDowntimeType.downtime_type_cd'), 'downtime_type_cd' ],
          [ Sequelize.col('stdDowntime.stdDowntimeType.downtime_type_nm'), 'downtime_type_nm' ],
          'start_date',
          [ Sequelize.col('prdWorkDowntime.start_date'), 'start_time' ],
          'end_date',
          [ Sequelize.col('prdWorkDowntime.end_date'), 'end_time' ],
          'downtime',
          'remark',
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

  // 📒 Fn[readReport]: Read Order Repot Function
  public readReport = async(params?: any) => {
    try {
      const result = await sequelize.query(readWorkDowntimeReport(params));
      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IPrdWorkDowntime[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let workDowntime of body) {
        const result = await this.repo.update(
          {
            start_date: workDowntime.start_date != null ? workDowntime.start_date : null,
            end_date: workDowntime.end_date != null ? workDowntime.end_date : null,
            downtime: workDowntime.downtime != null ? workDowntime.downtime : null,
            remark: workDowntime.remark != null ? workDowntime.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: workDowntime.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.PrdWorkDowntime.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IPrdWorkDowntime[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let workDowntime of body) {
        const result = await this.repo.update(
          {
            start_date: workDowntime.start_date,
            end_date: workDowntime.end_date,
            downtime: workDowntime.downtime,
            remark: workDowntime.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: workDowntime.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.PrdWorkDowntime.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IPrdWorkDowntime[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let workDowntime of body) {
        count += await this.repo.destroy({ where: { uuid: workDowntime.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.PrdWorkDowntime.getTableName() as string, previousRaws, uid, transaction);
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

      await new AdmLogRepo().create('delete', sequelize.models.PrdWorkDowntime.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion

  //#region ✅ Other Functions

  // 📒 Fn[getCountDuplicatedTime]: 설비 기준 비가동 시간이 겹치는 데이터가 있는지 확인하기 위해 데이터 개수 조회
  /**
   * 설비 기준 비가동 시간이 겹치는 데이터 개수 조회
   * @param startDate 시작일시
   * @param endDate 종료일시
   * @param equipId 설비ID
   * @param transaction Transaction
   * @returns 시간이 겹치는 데이터 개수
   */
  getCountDuplicatedTime = async(startDate: string, endDate: string, equipId?: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('count', Sequelize.col('work_downtime_id')), 'count' ],
        ],
        where: { 
          [Op.and]: [
            { equip_id: equipId },
            {
              [Op.or]: [
                { start_date: { [Op.between]: [ startDate as any, endDate as any ]}},
                { end_date: { [Op.between]: [ startDate as any, endDate as any ]}}
              ]
            }
          ]
        },
        transaction
      });

      if (!result) { return 0; }

      const count: number = (result as any).dataValues.count;

      return count;
    } catch (error) {
      throw error;
    }
  }

  //#endregion
}

export default PrdWorkDowntimeRepo;