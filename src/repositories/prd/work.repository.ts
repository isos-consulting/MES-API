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
import PrdWork from '../../models/prd/work.model';
import IPrdWork from '../../interfaces/prd/work.interface';
import { readWorks } from '../../queries/prd/work.query';
import { readWorkReport } from '../../queries/prd/work-report.query';

class PrdWorkRepo {
  repo: Repository<PrdWork>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(PrdWork);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IPrdWork[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((work: any) => {
        return this.repo.create(
          {
            factory_id: work.factory_id,
            reg_date: work.reg_date,
            order_id: work.order_id,
            seq: work.seq,
            workings_id: work.workings_id,
            prod_id: work.prod_id, 
            lot_no: work.lot_no,
            qty: work.qty,
            reject_qty: work.reject_qty,
            shift_id: work.shift_id,
            to_store_id: work.to_store_id,
            to_location_id: work.to_location_id,
            remark: work.remark,
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
      const result = await this.sequelize.query(readWorks(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.sequelize.query(readWorks({ work_uuid: uuid }));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readReport]: Read Order Repot Function
  public readReport = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readWorkReport(params));
      return convertReadResult(result[0]);
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

  // 📒 Fn[readRawByIds]: Id 를 포함한 Raw Datas Read Function
  public readRawByIds = async(ids: number[]) => {
    const result = await this.repo.findAll({ where: { work_id: { [Op.in]: ids } } });
    return convertReadResult(result);
  };

  // 📒 Fn[readByOrderIds]: 작업지시ID 기준 실적 조회
  public readByOrderIds = async(orderIds?: number[]) => {
    try {
      const result = await this.repo.findAll({
        include: [{ model: this.sequelize.models.PrdOrder, attributes: [], required: true }],
        attributes: [
          'factory_id',
          'reg_date',
          'order_id',
          [ Sequelize.col('prdOrder.uuid'), 'order_uuid' ],
          'seq',
          'proc_id',
          'workings_id',
          'equip_id',
          'prod_id',
          'mold_id',
          'mold_cavity',
          'lot_no',
          'qty',
          'reject_qty',
          'start_date',
          'end_date',
          'shift_id',
          'complete_fg',
          'to_store_id',
          'to_location_id',
          'remark',
        ],
        where: { order_id: orderIds }
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByOrderUuids]: 작업지시Uuid 기준 실적 조회
  public readByOrderUuids = async(uuids?: string[]) => {
    try {
      const result = await this.repo.findAll({
        include: [{ 
          model: this.sequelize.models.PrdOrder, 
          attributes: [], 
          required: true,
          where: uuids ? { uuid: uuids } : {}
        }],
        attributes: [
          'factory_id',
          'reg_date',
          'order_id',
          [ Sequelize.col('prdOrder.uuid'), 'order_uuid' ],
          'seq',
          'proc_id',
          'workings_id',
          'equip_id',
          'mold_id',
          'mold_cavity',
          'prod_id',
          'lot_no',
          'qty',
          'reject_qty',
          'start_date',
          'end_date',
          'shift_id',
          'complete_fg',
          'to_store_id',
          'to_location_id',
          'remark',
        ]
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readOperatingRate]: 설비 가동율 Read Function
  public readOperatingRate = async(date: string) => {
    // 생산 가동율

    // -- 표준 계산식
    // 조업시간 - 계획정지 - 비계획정지
    // -------------------------
    //   조업시간 - 계획정지
      
      
    // -- 임시 계산식????
    //   실적 시간 - 비가동
    // ------------------------4

    // 일자 넘어가는거 (2일 이상) 어떻게 처리할지 생각해야 함
    // 비가동 시작은 있고 종료가 없는경우는 now로 처리

    const result = await this.sequelize.query(`
      SELECT * INTO temp_work_tb
      FROM prd_work_tb s_od;
      --WHERE DATE(reg_date) = '${date}';
      
      CREATE INDEX idx_temp_work_tb_work_id ON temp_work_tb(work_id);
      
      SELECT p_wd.* INTO temp_downtime_tb
      FROM prd_work_downtime_tb p_wd
      JOIN temp_work_tb p_w ON p_w.work_id = p_wd.work_id;
      
      CREATE INDEX idx_temp_downtime_tb_work_id ON temp_downtime_tb(downtime_id);
      
      
      SELECT 
        AVG((work_time - downtime) / work_time) AS rate
      FROM (
        SELECT 
          DATE_PART('day', CASE WHEN complete_fg = TRUE THEN end_date ELSE NOW() END - start_date) * 2 +
          DATE_PART('hour', CASE WHEN complete_fg = TRUE THEN end_date ELSE NOW() END - start_date) * 60 +
          DATE_PART('minute', CASE WHEN complete_fg = TRUE THEN end_date ELSE NOW() END - start_date) AS work_time,
          p_wd.downtime
        FROM prd_work_tb p_w
        LEFT JOIN (
          SELECT 
            work_id,
            SUM( 
              CASE WHEN end_date IS NULL THEN 0
              ELSE
                DATE_PART('day', end_date - start_date) * 24 +
                DATE_PART('hour', end_date - start_date) * 60 +
                DATE_PART('minute', end_date - start_date)
              END 
            ) AS downtime
          FROM prd_work_downtime_tb
          GROUP BY work_id
        ) p_wd ON p_wd.work_id = p_w.work_id 
      ) a;
      
      
      DROP TABLE temp_work_tb;
      DROP TABLE temp_downtime_tb;
    `);

    return convertReadResult(result[0]);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IPrdWork[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((work: any) => {
        return this.repo.update(
          {
            mold_id: work.mold_id ?? null,
            mold_cavity: work.mold_cavity ?? null,
            qty: work.qty ?? null,
            start_date: work.start_date ?? null,
            end_date: work.end_date ?? null,
            to_store_id: work.to_store_id ?? null,
            to_location_id: work.to_location_id ?? null,
            remark: work.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: work.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdWork.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  // 📒 Fn[updateRejectQtyById]: 부적합 수량 Update
  public updateRejectQtyById = async(body: IPrdWork[], uid: number, transaction?: Transaction) => {
    try {
      const ids = body.map((work: any) => { return work.work_id });
      const previousRaws = await this.repo.findAll({ where: { work_id: ids } });

      const promises = body.map((work: any) => {
        return this.repo.update(
          {
            reject_qty: work.reject_qty,
            updated_uid: uid,
          } as any,
          { 
            where: { work_id: work.work_id },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdWork.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  // 📒 Fn[updateComplete]: 완료여부 및 완료일시 수정
  public updateComplete = async(body: IPrdWork[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((work: any) => {
        return this.repo.update(
          {
            qty: work.qty,
            reject_qty: work.reject_qty,
            complete_fg: work.complete_fg,
            updated_uid: uid,
          },
          { 
            where: { uuid: work.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdWork.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IPrdWork[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((work: any) => {
        return this.repo.update(
          {
            qty: work.qty,
            to_store_id: work.to_store_id,
            to_location_id: work.to_location_id,
            remark: work.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: work.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdWork.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IPrdWork[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((work: any) => {
        return this.repo.destroy({ where: { uuid: work.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.PrdWork.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion

  //#region ✅ Other Functions

  // 📒 Fn[getIncompleteCount]: 작업지시 기준 미완료된 생산실적 개수 조회
  /**
   * 작업지시 기준 미완료된 생산실적 개수 조회
   * @param orderId 작업지시 ID
   * @param transaction Transaction
   * @returns 작업지시 기준 미완료된 생산실적 개수
   */
  getIncompleteCount = async(orderId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('count', Sequelize.col('work_id')), 'count' ],
        ],
        where: {
          [Op.and]: [
            { order_id: orderId },
            { complete_fg: false }
          ]
        },
        transaction
      });

      if (!result) { return 0; }

      const count: number = (result as any).dataValues.count;

      return Number(count);
    } catch (error) {
      throw error;
    }
  }

  // 📒 Fn[getMaxSeq]: 작업지시단위의 Max Sequence 조회
  /**
   * 작업지시단위의 Max Sequence 조회
   * @param orderId 작업지시 ID
   * @param transaction Transaction
   * @returns Max Sequence
   */
  getMaxSeq = async(orderId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('max', Sequelize.col('seq')), 'seq' ],
        ],
        where: { order_id: orderId },
        group: [ 'order_id' ],
        transaction
      });

      if (!result) { return 0; }

      const maxSeq: number = (result as any).dataValues.seq;

      return maxSeq;
    } catch (error) {
      throw error;
    }
  }

  //#endregion
}

export default PrdWorkRepo;