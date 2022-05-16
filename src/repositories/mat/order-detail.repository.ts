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
import MatOrderDetail from '../../models/mat/order-detail.model';
import IMatOrderDetail from '../../interfaces/mat/order-detail.interface';
import { readOrderDetails } from '../../queries/mat/order-detail.query';

class MatOrderDetailRepo {
  repo: Repository<MatOrderDetail>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(MatOrderDetail);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IMatOrderDetail[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((orderDetail: any) => {
        return this.repo.create(
          {
            order_id: orderDetail.order_id,
            seq: orderDetail.seq,
            factory_id: orderDetail.factory_id,
            prod_id: orderDetail.prod_id,
            unit_id: orderDetail.unit_id,
            qty: orderDetail.qty,
            price: orderDetail.price,
            money_unit_id: orderDetail.money_unit_id,
            exchange: orderDetail.exchange,
            total_price: orderDetail.total_price,
            unit_qty: orderDetail.unit_qty,
            due_date: orderDetail.due_date,
            complete_fg: orderDetail.complete_fg == null ? false : orderDetail.complete_fg,
            remark: orderDetail.remark,
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

	// 📒 Fn[readRawsByIds]: Id 를 포함한 Raw Datas Read Function
	public readRawsByIds = async(ids: number[]) => {
		const result = await this.repo.findAll({ where: { order_detail_id: { [Op.in]: ids } } });
		return convertReadResult(result);
	};
	
	// 📒 Fn[readRawById]: Id 를 포함한 Raw Data Read Function
	public readRawById = async(id: number) => {
		const result = await this.repo.findOne({ where: { order_detail_id: id } });
		return convertReadResult(result);
	};

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IMatOrderDetail[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((orderDetail: any) => {
        return this.repo.update(
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
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.MatOrderDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  // 📒 Fn[updateComplete]: 완료여부(complete_fg) 수정
  public updateComplete = async(body: IMatOrderDetail[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((orderDetail: any) => {
        return this.repo.update(
          {
            complete_fg: orderDetail.complete_fg,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: orderDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.MatOrderDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IMatOrderDetail[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((orderDetail: any) => {
        return this.repo.update(
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
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.MatOrderDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IMatOrderDetail[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((orderDetail: any) => {
        return this.repo.destroy({ where: { uuid: orderDetail.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.MatOrderDetail.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion

  //#region ✅ Other Functions

  // 📒 Fn[getTotals]: 전표단위의 합계 금액, 수량 조회
  /**
   * 전표단위의 합계 금액, 수량 조회
   * @param orderId 전표 ID
   * @param transaction Transaction
   * @returns 합계 금액, 수량 Object
   */
  getTotals = async(orderId: number, transaction?: Transaction) => {
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

export default MatOrderDetailRepo;