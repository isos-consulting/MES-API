import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import SalOrderDetail from '../../models/sal/order-detail.model';
import ISalOrderDetail from '../../interfaces/sal/order-detail.interface';
import { readOrderDetails } from '../../queries/sal/order-detail.query';

class SalOrderDetailRepo {
  repo: Repository<SalOrderDetail>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(SalOrderDetail);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: ISalOrderDetail[], uid: number, transaction?: Transaction) => {
    try {
      const orderDetail = body.map((orderDetail) => {
        return {
          order_id: orderDetail.order_id,
          seq: orderDetail.seq,
          factory_id: orderDetail.factory_id,
          prod_id: orderDetail.prod_id,
          qty: orderDetail.qty,
          price: orderDetail.price,
          money_unit_id: orderDetail.money_unit_id,
          exchange: orderDetail.exchange,
          total_price: orderDetail.total_price,
          unit_qty: orderDetail.unit_qty,
          due_date: orderDetail.due_date,
          remark: orderDetail.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(orderDetail, { individualHooks: true, transaction });

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
      const result = await this.sequelize.query(
        readOrderDetails({
          complete_state: params.complete_state,
          start_reg_date: params.start_reg_date,
          end_reg_date: params.end_reg_date,
          start_due_date: params.start_due_date,
          end_due_date: params.end_due_date,
          order_detail_uuid: params.order_detail_uuid,
          order_uuid: params.order_uuid,
          factory_uuid: params.factory_uuid,
          partner_uuid: params.partner_uuid,
        })
      );

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.sequelize.query(
        readOrderDetails({ order_detail_uuid: uuid })
      );

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

  // 📒 Fn[readDeliveredWithinPeriod]: 기간 내 납기 완료 및 미완료 건수 Read Function
  public readDeliveredWithinPeriod = async(startDate: string, endDate: string) => {
    const result = await this.sequelize.query(`
      SELECT * INTO temp_order_detail_tb
      FROM sal_order_detail_tb s_od
      WHERE DATE(due_date) BETWEEN '${startDate}' AND '${endDate}';
      
      CREATE INDEX idx_temp_order_detail_tb_order_detail_id ON temp_order_detail_tb(order_detail_id);
      
      SELECT 
        CURRENT_DATE + i AS date,
        COALESCE(total, 0) AS total,
        COALESCE(delivered, 0) AS delivered
      FROM GENERATE_SERIES(DATE '${startDate}'- CURRENT_DATE, DATE '${endDate}' - CURRENT_DATE) i
      LEFT JOIN (
        SELECT 
          a.due_date,
          SUM(COALESCE(a.total, 0)) AS total,
          SUM(COALESCE(a.delivered, 0)) AS delivered
        FROM (
          SELECT 
            a.due_date,
            count(*) AS total,
            CASE WHEN a.complete = TRUE THEN count(a.complete) END AS delivered
          FROM (	SELECT 
                DATE(due_date) AS due_date,
                CASE WHEN complete_fg = TRUE OR s_od.qty - COALESCE(s_ogd.qty, 0) <= 0 THEN TRUE 
                ELSE FALSE END AS complete
              FROM temp_order_detail_tb s_od
              LEFT JOIN (
                SELECT
                  s_ogd.order_detail_id,
                  SUM(s_ogd.qty) AS qty
                FROM sal_outgo_detail_tb s_ogd
                GROUP BY order_detail_id
              ) s_ogd ON s_ogd.order_detail_id = s_od.order_detail_id) a
          GROUP BY a.due_date, a.complete
        ) a
        GROUP BY a.due_date
      ) a ON CURRENT_DATE + i = a.due_date
      ORDER BY CURRENT_DATE + i;
      
      DROP TABLE temp_order_detail_tb;
    `);

    return convertReadResult(result[0]);
  };

  // 📒 Fn[readCountOfDelayedOrder]: 납기 지연된 수주 Read Function
  public readCountOfDelayedOrder = async(date: string) => {
    const result = await this.sequelize.query(`
      SELECT * INTO temp_order_detail_tb
      FROM sal_order_detail_tb s_od
      WHERE DATE(due_date) < '${date}'
      AND complete_fg = FALSE;
      
      CREATE INDEX idx_temp_order_detail_tb_order_detail_id ON temp_order_detail_tb(order_detail_id);
      
      SELECT 
        COUNT(*) as count
      FROM temp_order_detail_tb s_od
      LEFT JOIN (
        SELECT
          s_ogd.order_detail_id,
          SUM(s_ogd.qty) AS qty
        FROM sal_outgo_detail_tb s_ogd
        GROUP BY order_detail_id
      ) s_ogd ON s_ogd.order_detail_id = s_od.order_detail_id
      WHERE (s_od.qty - COALESCE(s_ogd.qty, 0)) > 0;
      
      DROP TABLE temp_order_detail_tb;
    `);

    return convertReadResult(result[0]);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: ISalOrderDetail[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let orderDetail of body) {
        const result = await this.repo.update(
          {
            qty: orderDetail.qty ?? null,
            price: orderDetail.price ?? null,
            money_unit_id: orderDetail.money_unit_id ?? null,
            exchange: orderDetail.exchange ?? null,
            total_price: orderDetail.total_price ?? null,
            unit_qty: orderDetail.unit_qty ?? null,
            due_date: orderDetail.due_date ?? null,
            complete_fg: orderDetail.complete_fg ?? null,
            remark: orderDetail.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: orderDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.SalOrderDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  // 📒 Fn[updateComplete]: 완료여부(complete_fg) 수정
  public updateComplete = async(body: ISalOrderDetail[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let orderDetail of body) {
        const result = await this.repo.update(
          {
            complete_fg: orderDetail.complete_fg,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: orderDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.SalOrderDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: ISalOrderDetail[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let orderDetail of body) {
        const result = await this.repo.update(
          {
            qty: orderDetail.qty,
            price: orderDetail.price,
            money_unit_id: orderDetail.money_unit_id,
            exchange: orderDetail.exchange,
            total_price: orderDetail.total_price,
            unit_qty: orderDetail.unit_qty,
            due_date: orderDetail.due_date,
            complete_fg: orderDetail.complete_fg,
            remark: orderDetail.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: orderDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.SalOrderDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: ISalOrderDetail[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let orderDetail of body) {
        count += await this.repo.destroy({ where: { uuid: orderDetail.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.SalOrderDetail.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion

  //#region ✅ Other Functions

  // 📒 Fn[getTotalQtyAndTotalPrice]: 전표단위의 합계 금액, 수량 조회
  /**
   * 전표단위의 합계 금액, 수량 조회
   * @param orderId 전표 ID
   * @param transaction Transaction
   * @returns 합계 금액, 수량 Object
   */
  getTotalQtyAndTotalPrice = async(orderId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('sum', Sequelize.col('qty')), 'total_qty' ],
          [ Sequelize.fn('sum', Sequelize.col('total_price')), 'total_price' ]
        ],
        where: { order_id: orderId },
        group: [ 'order_id' ],
        transaction
      });

      if (!result) { return result; }

      const totalQty: number = (result as any).dataValues.total_qty;
      const totalPrice: number = (result as any).dataValues.total_price;

      return { totalQty, totalPrice };
    } catch (error) {
      throw error;
    }
  }

  // 📒 Fn[getMaxSeq]: 전표단위의 Max Sequence 조회
  /**
   * 전표단위의 Max Sequence 조회
   * @param orderId 전표 ID
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

      if (!result) { return result; }

      const maxSeq: number = (result as any).dataValues.seq;

      return maxSeq;
    } catch (error) {
      throw error;
    }
  }

  // 📒 Fn[getCount]: 전표단위의 상세전표 개수 조회
  /**
   * 전표단위의 상세전표 개수 조회
   * @param orderId 전표 ID
   * @param transaction Transaction
   * @returns 전표단위의 상세전표 개수
   */
  getCount = async(orderId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('count', Sequelize.col('order_id')), 'count' ],
        ],
        where: { order_id: orderId },
        transaction
      });

      if (!result) { return result; }

      const count: number = (result as any).dataValues.count;

      return count;
    } catch (error) {
      throw error;
    }
  }

  //#endregion
}

export default SalOrderDetailRepo;