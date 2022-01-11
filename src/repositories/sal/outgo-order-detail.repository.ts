import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import SalOutgoOrderDetail from '../../models/sal/outgo-order-detail.model';
import ISalOutgoOrderDetail from '../../interfaces/sal/outgo-order-detail.interface';
import { readOrderDetails } from '../../queries/sal/outgo-order-detail.query';

class SalOutgoOrderDetailRepo {
  repo: Repository<SalOutgoOrderDetail>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(SalOutgoOrderDetail);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: ISalOutgoOrderDetail[], uid: number, transaction?: Transaction) => {
    try {
      const outgoOrderDetails = body.map((outgoOrderDetail) => {
        return {
          outgo_order_id: outgoOrderDetail.outgo_order_id,
          seq: outgoOrderDetail.seq,
          factory_id: outgoOrderDetail.factory_id,
          prod_id: outgoOrderDetail.prod_id,
          qty: outgoOrderDetail.qty,
          order_detail_id: outgoOrderDetail.order_detail_id,
          complete_fg: outgoOrderDetail.complete_fg,
          remark: outgoOrderDetail.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(outgoOrderDetails, { individualHooks: true, transaction });

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
          start_date: params.start_date,
          end_date: params.end_date,
          outgo_order_uuid: params.outgo_order_uuid,
          outgo_order_detail_uuid: params.outgo_order_detail_uuid,
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
      const result = await this.sequelize.query(readOrderDetails({ outgo_order_detail_uuid: uuid }));

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

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: ISalOutgoOrderDetail[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let outgoOrderDetail of body) {
        const result = await this.repo.update(
          {
            qty: outgoOrderDetail.qty ?? null,
            complete_fg: outgoOrderDetail.complete_fg ?? null,
            remark: outgoOrderDetail.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: outgoOrderDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.SalOutgoOrderDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  // 📒 Fn[updateComplete]: 완료여부(complete_fg) 수정
  public updateComplete = async(body: ISalOutgoOrderDetail[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let outgoOrderDetail of body) {
        const result = await this.repo.update(
          {
            complete_fg: outgoOrderDetail.complete_fg,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: outgoOrderDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.SalOutgoOrderDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: ISalOutgoOrderDetail[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let outgoOrderDetail of body) {
        const result = await this.repo.update(
          {
            qty: outgoOrderDetail.qty,
            complete_fg: outgoOrderDetail.complete_fg,
            remark: outgoOrderDetail.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: outgoOrderDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.SalOutgoOrderDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: ISalOutgoOrderDetail[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let outgoOrderDetail of body) {
        count += await this.repo.destroy({ where: { uuid: outgoOrderDetail.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.SalOutgoOrderDetail.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion

  //#region ✅ Other Functions

  // 📒 Fn[getTotalQty]: 전표단위의 합계 금액, 수량 조회
  /**
   * 전표단위의 합계 금액, 수량 조회
   * @param outgoOrderId 전표 ID
   * @param transaction Transaction
   * @returns 합계 수량
   */
  getTotalQty = async(outgoOrderId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('sum', Sequelize.col('qty')), 'total_qty' ],
        ],
        where: { outgo_order_id: outgoOrderId },
        group: [ 'outgo_order_id' ],
        transaction
      });

      if (!result) { return result; }

      const totalQty: number = (result as any).dataValues.total_qty;

      return totalQty;
    } catch (error) {
      throw error;
    }
  }

  // 📒 Fn[getMaxSeq]: 전표단위의 Max Sequence 조회
  /**
   * 전표단위의 Max Sequence 조회
   * @param outgoOrderId 전표 ID
   * @param transaction Transaction
   * @returns Max Sequence
   */
  getMaxSeq = async(outgoOrderId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('max', Sequelize.col('seq')), 'seq' ],
        ],
        where: { outgo_order_id: outgoOrderId },
        group: [ 'outgo_order_id' ],
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
   * @param outgoOrderId 전표 ID
   * @param transaction Transaction
   * @returns 전표단위의 상세전표 개수
   */
  getCount = async(outgoOrderId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('count', Sequelize.col('outgo_order_id')), 'count' ],
        ],
        where: { outgo_order_id: outgoOrderId },
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

export default SalOutgoOrderDetailRepo;