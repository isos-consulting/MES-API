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
import MatReceiveDetail from '../../models/mat/receive-detail.model';
import IMatReceiveDetail from '../../interfaces/mat/receive-detail.interface';
import { readReceiveDetails } from '../../queries/mat/receive-detail.query';

class MatReceiveDetailRepo {
  repo: Repository<MatReceiveDetail>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(MatReceiveDetail);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IMatReceiveDetail[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((receiveDetail: any) => {
        return this.repo.create(
          {
            receive_id: receiveDetail.receive_id,
            seq: receiveDetail.seq,
            factory_id: receiveDetail.factory_id,
            prod_id: receiveDetail.prod_id,
            unit_id: receiveDetail.unit_id,
            lot_no: receiveDetail.lot_no,
            manufactured_lot_no: receiveDetail.manufactured_lot_no,
            qty: receiveDetail.qty,
            price: receiveDetail.price,
            money_unit_id: receiveDetail.money_unit_id,
            exchange: receiveDetail.exchange,
            total_price: receiveDetail.total_price,
            unit_qty: receiveDetail.unit_qty,
            insp_fg: receiveDetail.insp_fg,
            carry_fg: receiveDetail.carry_fg ?? false,
            order_detail_id: receiveDetail.order_detail_id,
            to_store_id: receiveDetail.to_store_id,
            to_location_id: receiveDetail.to_location_id,
            remark: receiveDetail.remark,
            barcode: receiveDetail.barcode,
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
        readReceiveDetails(undefined, params.receive_uuid, params.factory_uuid, params.partner_uuid, params.complete_state, params.start_date, params.end_date)
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
        readReceiveDetails(uuid)
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
    const result = await this.repo.findAll({ where: { receive_detail_id: { [Op.in]: ids } } });
    return convertReadResult(result);
  };

  // 📒 Fn[readRawById]: Id 를 포함한 Raw Data Read Function
  public readRawById = async(id: number) => {
    const result = await this.repo.findOne({ where: { receive_detail_id: id } });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IMatReceiveDetail[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((receiveDetail: any) => {
        return this.repo.update(
          {
            manufactured_lot_no: receiveDetail.manufactured_lot_no ?? null,
            qty: receiveDetail.qty ?? null,
            price: receiveDetail.price ?? null,
            money_unit_id: receiveDetail.money_unit_id ?? null,
            exchange: receiveDetail.exchange ?? null,
            total_price: receiveDetail.total_price ?? null,
            unit_qty: receiveDetail.unit_qty ?? null,
            carry_fg: receiveDetail.carry_fg ?? null,
            remark: receiveDetail.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: receiveDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.MatReceiveDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IMatReceiveDetail[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((receiveDetail: any) => {
        return this.repo.update(
          {
            manufactured_lot_no: receiveDetail.manufactured_lot_no,
            qty: receiveDetail.qty,
            price: receiveDetail.price,
            money_unit_id: receiveDetail.money_unit_id,
            exchange: receiveDetail.exchange,
            total_price: receiveDetail.total_price,
            unit_qty: receiveDetail.unit_qty,
            carry_fg: receiveDetail.carry_fg,
            remark: receiveDetail.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: receiveDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.MatReceiveDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IMatReceiveDetail[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((receiveDetail: any) => {
        return this.repo.destroy({ where: { uuid: receiveDetail.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.MatReceiveDetail.getTableName() as string, previousRaws, uid, transaction);
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
   * @param receiveId 전표 ID
   * @param transaction Transaction
   * @returns 합계 금액, 수량 Object
   */
  getTotals = async(receiveId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('sum', Sequelize.col('qty')), 'total_qty' ],
          [ Sequelize.fn('sum', Sequelize.col('total_price')), 'total_price' ]
        ],
        where: { receive_id: receiveId },
        group: [ 'receive_id' ],
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
   * @param receiveId 전표 ID
   * @param transaction Transaction
   * @returns Max Sequence
   */
  getMaxSeq = async(receiveId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('max', Sequelize.col('seq')), 'seq' ],
        ],
        where: { receive_id: receiveId },
        group: [ 'receive_id' ],
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
   * @param receiveId 전표 ID
   * @param transaction Transaction
   * @returns 전표단위의 상세전표 개수
   */
  getCount = async(receiveId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('count', Sequelize.col('receive_id')), 'count' ],
        ],
        where: { receive_id: receiveId },
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

export default MatReceiveDetailRepo;