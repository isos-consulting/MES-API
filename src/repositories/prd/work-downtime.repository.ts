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
import PrdWorkDowntime from '../../models/prd/work-downtime.model';
import IPrdWorkDowntime from '../../interfaces/prd/work-downtime.interface';
import { readWorkDowntimeReport } from '../../queries/prd/work-downtime-report.query';

class PrdWorkDowntimeRepo {
  repo: Repository<PrdWorkDowntime>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(PrdWorkDowntime);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IPrdWorkDowntime[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((workDowntime: any) => {
        return this.repo.create(
          {
            factory_id: workDowntime.factory_id,
            work_id: workDowntime.work_id,
            work_routing_id: workDowntime.work_routing_id,
            equip_id: workDowntime.equip_id,
            downtime_id: workDowntime.downtime_id,
            start_date: workDowntime.start_date,
            end_date: workDowntime.end_date,
            downtime: workDowntime.downtime,
            remark: workDowntime.remark,
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
            required: false,
            include: [
              { model: this.sequelize.models.StdProc, attributes: [], required: false },
              { model: this.sequelize.models.StdWorkings, attributes: [], required: false },
              { model: this.sequelize.models.StdEquip, attributes: [], required: false }
            ]
          },
          { model: this.sequelize.models.StdEquip, attributes: [], required: false },
          { 
            model: this.sequelize.models.StdDowntime,
            attributes: [],
            required: true,
            include: [{ 
              model: this.sequelize.models.StdDowntimeType,
              attributes: [],
              required: false,
              where: params.downtime_type_uuid ? { uuid: params.downtime_type_uuid } : {}
            }],
            where: {
              [Op.and]: [
                { uuid: params.downtime_uuid ?? { [Op.ne]: null }},
                { eqm_failure_fg: params.eqm_failure_fg ?? { [Op.ne]: null }},
              ]
            }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdWorkDowntime.uuid'), 'work_downtime_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
          [ Sequelize.col('prdWorkRouting.uuid'), 'work_routing_uuid' ],
          [ Sequelize.col('prdWorkRouting.proc_no'), 'proc_no' ],
          [ Sequelize.col('prdWorkRouting.stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('prdWorkRouting.stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('prdWorkRouting.stdProc.proc_nm'), 'proc_nm' ],
          [ Sequelize.col('prdWorkRouting.stdWorkings.uuid'), 'workings_uuid' ],
          [ Sequelize.col('prdWorkRouting.stdWorkings.workings_cd'), 'workings_cd' ],
          [ Sequelize.col('prdWorkRouting.stdWorkings.workings_nm'), 'workings_nm' ],
          [ Sequelize.literal(`
            CASE prdWorkDowntime.work_routing_id  
              WHEN NULL THEN stdEquip.uuid
              ELSE "prdWorkRouting->stdEquip".uuid
            END`), 'equip_uuid' ],
          [ Sequelize.literal(`
            CASE prdWorkDowntime.work_routing_id  
              WHEN NULL THEN stdEquip.equip_cd
              ELSE "prdWorkRouting->stdEquip".equip_cd
            END`), 'equip_cd' ],
          [ Sequelize.literal(`
            CASE prdWorkDowntime.work_routing_id  
              WHEN NULL THEN stdEquip.equip_nm
              ELSE "prdWorkRouting->stdEquip".equip_nm
              END`), 'equip_nm' ],
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
        where: {
          [Op.and]: [
            params.start_date && params.end_date ? 
            {
              [Op.and]: [
                Sequelize.where(Sequelize.fn('date', Sequelize.col('prdWorkDowntime.start_date')), '>=', params.start_date),
                Sequelize.where(Sequelize.fn('date', Sequelize.col('prdWorkDowntime.start_date')), '<=', params.end_date),
              ]
            } : {}
          ]
        },
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
          { model: this.sequelize.models.StdFactory, attributes: [], required: true },
          { model: this.sequelize.models.PrdWork, attributes: [], required: true },
          { 
            model: this.sequelize.models.PrdWorkRouting, 
            attributes: [], 
            required: false,
            include: [
              { model: this.sequelize.models.StdProc, attributes: [], required: false },
              { model: this.sequelize.models.StdWorkings, attributes: [], required: false },
              { model: this.sequelize.models.StdEquip, attributes: [], required: false }
            ]
          },
          { model: this.sequelize.models.StdEquip, attributes: [], required: false },
          { 
            model: this.sequelize.models.StdDowntime,
            attributes: [],
            required: true,
            include: [{ model: this.sequelize.models.StdDowntimeType, attributes: [], required: false }],
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdWorkDowntime.uuid'), 'work_downtime_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
          [ Sequelize.col('prdWorkRouting.uuid'), 'work_routing_uuid' ],
          [ Sequelize.col('prdWorkRouting.proc_no'), 'proc_no' ],
          [ Sequelize.col('prdWorkRouting.stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('prdWorkRouting.stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('prdWorkRouting.stdProc.proc_nm'), 'proc_nm' ],
          [ Sequelize.col('prdWorkRouting.stdWorkings.uuid'), 'workings_uuid' ],
          [ Sequelize.col('prdWorkRouting.stdWorkings.workings_cd'), 'workings_cd' ],
          [ Sequelize.col('prdWorkRouting.stdWorkings.workings_nm'), 'workings_nm' ],
          [ Sequelize.literal(`
            CASE prdWorkDowntime.work_routing_id  
              WHEN NULL THEN stdEquip.uuid
              ELSE "prdWorkRouting->stdEquip".uuid
            END`), 'equip_uuid' ],
          [ Sequelize.literal(`
            CASE prdWorkDowntime.work_routing_id  
              WHEN NULL THEN stdEquip.equip_cd
              ELSE "prdWorkRouting->stdEquip".equip_cd
            END`), 'equip_cd' ],
          [ Sequelize.literal(`
            CASE prdWorkDowntime.work_routing_id  
              WHEN NULL THEN stdEquip.equip_nm
              ELSE "prdWorkRouting->stdEquip".equip_nm
              END`), 'equip_nm' ],
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
      const result = await this.sequelize.query(readWorkDowntimeReport(params));
      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IPrdWorkDowntime[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workDowntime: any) => {
        return this.repo.update(
          {
            start_date: workDowntime.start_date ?? null,
            end_date: workDowntime.end_date ?? null,
            downtime: workDowntime.downtime ?? null,
            remark: workDowntime.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: workDowntime.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdWorkDowntime.getTableName() as string, previousRaws, uid, transaction);
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
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workDowntime: any) => {
        return this.repo.update(
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
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdWorkDowntime.getTableName() as string, previousRaws, uid, transaction);
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
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workDowntime: any) => {
        return this.repo.destroy({ where: { uuid: workDowntime.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.PrdWorkDowntime.getTableName() as string, previousRaws, uid, transaction);
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

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.PrdWorkDowntime.getTableName() as string, previousRaws, uid, transaction);
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