import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import PrdWork from '../../models/prd/work.model';
import IPrdWork from '../../interfaces/prd/work.interface';
import { readWorks } from '../../queries/prd/work.query';
import { readWorkReport } from '../../queries/prd/work-report.query';

class PrdWorkRepo {
  repo: Repository<PrdWork>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(PrdWork);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IPrdWork[], uid: number, transaction?: Transaction) => {
    try {
      const works = body.map((work) => {
        return {
          factory_id: work.factory_id,
          reg_date: work.reg_date,
          order_id: work.order_id,
          seq: work.seq,
          proc_id: work.proc_id,
          workings_id: work.workings_id,
          equip_id: work.equip_id,
          prod_id: work.prod_id, 
          lot_no: work.lot_no,
          qty: work.qty,
          reject_qty: work.reject_qty,
          start_date: work.start_date,
          end_date: work.end_date,
          shift_id: work.shift_id,
          to_store_id: work.to_store_id,
          to_location_id: work.to_location_id,
          remark: work.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(works, { individualHooks: true, transaction });

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
      const result = await sequelize.query(readWorks(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await sequelize.query(readWorks({ work_uuid: uuid }));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readReport]: Read Order Repot Function
  public readReport = async(params?: any) => {
    try {
      const result = await sequelize.query(readWorkReport(params));
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
        include: [{ model: sequelize.models.PrdOrder, attributes: [], required: true }],
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
          model: sequelize.models.PrdOrder, 
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

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IPrdWork[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let work of body) {
        const result = await this.repo.update(
          {
            qty: work.qty != null ? work.qty : null,
            start_date: work.start_date != null ? work.start_date : null,
            end_date: work.end_date != null ? work.end_date : null,
            remark: work.remark != null ? work.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: work.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.PrdWork.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  // 📒 Fn[updateRejectQtyById]: 부적합 수량 Update
  public updateRejectQtyById = async(body: IPrdWork[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const ids = body.map((work: any) => { return work.work_id });
      const previousRaws = await this.repo.findAll({ where: { work_id: ids } });

      for await (let work of body) {
        const result = await this.repo.update(
          {
            reject_qty: work.reject_qty,
            updated_uid: uid,
          } as any,
          { 
            where: { work_id: work.work_id },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.PrdWork.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  // 📒 Fn[updateComplete]: 완료여부 및 완료일시 수정
  public updateComplete = async(body: IPrdWork[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let work of body) {
        const result = await this.repo.update(
          {
            work_time: work.work_time,
            complete_fg: work.complete_fg,
            end_date: work.end_date,
            updated_uid: uid,
          },
          { 
            where: { uuid: work.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.PrdWork.getTableName() as string, previousRaws, uid, transaction);
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
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let work of body) {
        const result = await this.repo.update(
          {
            qty: work.qty,
            start_date: work.start_date,
            end_date: work.end_date,
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

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.PrdWork.getTableName() as string, previousRaws, uid, transaction);
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
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let work of body) {
        count += await this.repo.destroy({ where: { uuid: work.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.PrdWork.getTableName() as string, previousRaws, uid, transaction);
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

      return count;
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