import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction, UniqueConstraintError, WhereOptions } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import SalOutgoDetail from '../../models/sal/outgo-detail.model';
import ISalOutgoDetail from '../../interfaces/sal/outgo-detail.interface';
import SalOutgo from '../../models/sal/outgo.model';

class SalOutgoDetailRepo {
  repo: Repository<SalOutgoDetail>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(SalOutgoDetail);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: ISalOutgoDetail[], uid: number, transaction?: Transaction) => {
    try {
      const outgoDetail = body.map((outgoDetail) => {
        return {
          outgo_id: outgoDetail.outgo_id,
          seq: outgoDetail.seq,
          factory_id: outgoDetail.factory_id,
          prod_id: outgoDetail.prod_id,
          lot_no: outgoDetail.lot_no,
          qty: outgoDetail.qty,
          price: outgoDetail.price,
          money_unit_id: outgoDetail.money_unit_id,
          exchange: outgoDetail.exchange,
          total_price: outgoDetail.total_price,
          unit_qty: outgoDetail.unit_qty,
          carry_fg: outgoDetail.carry_fg,
          order_detail_id: outgoDetail.order_detail_id,
          outgo_order_detail_id: outgoDetail.outgo_order_detail_id,
          from_store_id: outgoDetail.from_store_id,
          from_location_id: outgoDetail.from_location_id,
          remark: outgoDetail.remark,
          barcode: outgoDetail.barcode,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(outgoDetail, { individualHooks: true, transaction });

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
      // 📌 제품출하 전표일자 기준 조회시 일자 조회조건 추가
      let outgoWhereOptions: WhereOptions<SalOutgo>;
      if (params.start_date && params.end_date) {
        outgoWhereOptions = {
          [Op.and]: [
            { uuid: params.outgo_uuid ? params.outgo_uuid : { [Op.ne]: null } },
            {[Op.and]: [
              Sequelize.where(Sequelize.fn('date', Sequelize.col('salOutgo.reg_date')), '>=', params.start_date),
              Sequelize.where(Sequelize.fn('date', Sequelize.col('salOutgo.reg_date')), '<=', params.end_date),
            ]}
          ]
        }
      } else {
        outgoWhereOptions = { uuid: params.outgo_uuid ? params.outgo_uuid : { [Op.ne]: null } }
      }

      const result = await this.repo.findAll({ 
        include: [
          { 
            model: sequelize.models.SalOutgo, 
            attributes: [], 
            required: true, 
            where: outgoWhereOptions,
            include: [
              { 
                model: sequelize.models.StdPartner, 
                attributes: [], 
                required: true,
                where: { uuid: params.partner_uuid ? params.partner_uuid : { [Op.ne]: null } }
              },
            ]
          },
          { 
            model: sequelize.models.StdFactory, 
            attributes: [], 
            required: true, 
            where: { uuid: params.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
          },
          { 
            model: sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: sequelize.models.StdItemType, attributes: [], required: false },
              { model: sequelize.models.StdProdType, attributes: [], required: false },
              { model: sequelize.models.StdModel, attributes: [], required: false },
              { model: sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ],
          },
          { model: sequelize.models.StdMoneyUnit, attributes: [], required: true },
          { model: sequelize.models.SalOrderDetail, attributes: [], required: false },
          { model: sequelize.models.SalOutgoOrderDetail, attributes: [], required: false },
          { model: sequelize.models.StdStore, attributes: [], required: true },
          { model: sequelize.models.StdLocation, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('salOutgo.uuid'), 'outgo_uuid' ],
          [ Sequelize.col('salOutgoDetail.uuid'), 'outgo_detail_uuid' ],
          [ Sequelize.col('salOutgo.stmt_no'), 'stmt_no' ],
          'seq',
          [ Sequelize.fn('concat', Sequelize.col('salOutgo.stmt_no'), '-', Sequelize.col('salOutgoDetail.seq')), 'stmt_no_sub' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('salOrderDetail.uuid'), 'order_detail_uuid' ],
          [ Sequelize.col('salOutgoOrderDetail.uuid'), 'outgo_order_detail_uuid' ],
          [ Sequelize.col('stdProd.uuid'), 'prod_uuid' ],
          [ Sequelize.col('stdProd.prod_no'), 'prod_no' ],
          [ Sequelize.col('stdProd.prod_nm'), 'prod_nm' ],
          [ Sequelize.col('stdProd.stdItemType.uuid'), 'item_type_uuid' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_cd'), 'item_type_cd' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_nm'), 'item_type_nm' ],
          [ Sequelize.col('stdProd.stdProdType.uuid'), 'prod_type_uuid' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_cd'), 'prod_type_cd' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_nm'), 'prod_type_nm' ],
          [ Sequelize.col('stdProd.stdModel.uuid'), 'model_uuid' ],
          [ Sequelize.col('stdProd.stdModel.model_cd'), 'model_cd' ],
          [ Sequelize.col('stdProd.stdModel.model_nm'), 'model_nm' ],
          [ Sequelize.col('stdProd.rev'), 'rev' ],
          [ Sequelize.col('stdProd.prod_std'), 'prod_std' ],
          [ Sequelize.col('stdProd.stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('stdProd.stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('stdProd.stdUnit.unit_nm'), 'unit_nm' ],
          'lot_no',
          'qty',
          [ Sequelize.col('salOrderDetail.qty'), 'order_qty' ],
          [ Sequelize.col('salOutgoOrderDetail.qty'), 'outgo_order_qty' ],
          'price',
          [ Sequelize.col('stdMoneyUnit.uuid'), 'money_unit_uuid' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_cd'), 'money_unit_cd' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_nm'), 'money_unit_nm' ],
          'exchange',
          'total_price',
          'unit_qty',
          'carry_fg',
          [ Sequelize.col('stdStore.uuid'), 'from_store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'from_store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'from_store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'from_location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'from_location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'from_location_nm' ],
          'remark',
          'barcode',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', Sequelize.col('salOutgo.reg_date'), 'outgo_id', 'seq', 'outgo_detail_id' ],
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
          { 
            model: sequelize.models.SalOutgo, 
            attributes: [], 
            required: true, 
            include: [{ model: sequelize.models.StdPartner, attributes: [], required: true }]
          },
          { model: sequelize.models.StdFactory, attributes: [], required: true },
          { 
            model: sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: sequelize.models.StdItemType, attributes: [], required: false },
              { model: sequelize.models.StdProdType, attributes: [], required: false },
              { model: sequelize.models.StdModel, attributes: [], required: false },
              { model: sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ],
          },
          { model: sequelize.models.StdMoneyUnit, attributes: [], required: true },
          { model: sequelize.models.SalOrderDetail, attributes: [], required: false },
          { model: sequelize.models.SalOutgoOrderDetail, attributes: [], required: false },
          { model: sequelize.models.StdStore, attributes: [], required: true },
          { model: sequelize.models.StdLocation, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('salOutgo.uuid'), 'outgo_uuid' ],
          [ Sequelize.col('salOutgoDetail.uuid'), 'outgo_detail_uuid' ],
          [ Sequelize.col('salOutgo.stmt_no'), 'stmt_no' ],
          'seq',
          [ Sequelize.fn('concat', Sequelize.col('salOutgo.stmt_no'), '-', Sequelize.col('salOutgoDetail.seq')), 'stmt_no_sub' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('salOrderDetail.uuid'), 'order_detail_uuid' ],
          [ Sequelize.col('salOutgoOrderDetail.uuid'), 'outgo_order_detail_uuid' ],
          [ Sequelize.col('stdProd.uuid'), 'prod_uuid' ],
          [ Sequelize.col('stdProd.prod_no'), 'prod_no' ],
          [ Sequelize.col('stdProd.prod_nm'), 'prod_nm' ],
          [ Sequelize.col('stdProd.stdItemType.uuid'), 'item_type_uuid' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_cd'), 'item_type_cd' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_nm'), 'item_type_nm' ],
          [ Sequelize.col('stdProd.stdProdType.uuid'), 'prod_type_uuid' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_cd'), 'prod_type_cd' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_nm'), 'prod_type_nm' ],
          [ Sequelize.col('stdProd.stdModel.uuid'), 'model_uuid' ],
          [ Sequelize.col('stdProd.stdModel.model_cd'), 'model_cd' ],
          [ Sequelize.col('stdProd.stdModel.model_nm'), 'model_nm' ],
          [ Sequelize.col('stdProd.rev'), 'rev' ],
          [ Sequelize.col('stdProd.prod_std'), 'prod_std' ],
          [ Sequelize.col('stdProd.stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('stdProd.stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('stdProd.stdUnit.unit_nm'), 'unit_nm' ],
          'lot_no',
          'qty',
          [ Sequelize.col('salOrderDetail.qty'), 'order_qty' ],
          [ Sequelize.col('salOutgoOrderDetail.qty'), 'outgo_order_qty' ],
          'price',
          [ Sequelize.col('stdMoneyUnit.uuid'), 'money_unit_uuid' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_cd'), 'money_unit_cd' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_nm'), 'money_unit_nm' ],
          'exchange',
          'total_price',
          'unit_qty',
          'carry_fg',
          [ Sequelize.col('stdStore.uuid'), 'from_store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'from_store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'from_store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'from_location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'from_location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'from_location_nm' ],
          'remark',
          'barcode',
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

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: ISalOutgoDetail[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let outgoDetail of body) {
        const result = await this.repo.update(
          {
            qty: outgoDetail.qty != null ? outgoDetail.qty : null,
            price: outgoDetail.price != null ? outgoDetail.price : null,
            money_unit_id: outgoDetail.money_unit_id != null ? outgoDetail.money_unit_id : null,
            exchange: outgoDetail.exchange != null ? outgoDetail.exchange : null,
            total_price: outgoDetail.total_price != null ? outgoDetail.total_price : null,
            unit_qty: outgoDetail.unit_qty != null ? outgoDetail.unit_qty : null,
            carry_fg: outgoDetail.carry_fg != null ? outgoDetail.carry_fg : null,
            remark: outgoDetail.remark != null ? outgoDetail.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: outgoDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.SalOutgoDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: ISalOutgoDetail[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let outgoDetail of body) {
        const result = await this.repo.update(
          {
            qty: outgoDetail.qty,
            price: outgoDetail.price,
            money_unit_id: outgoDetail.money_unit_id,
            exchange: outgoDetail.exchange,
            total_price: outgoDetail.total_price,
            unit_qty: outgoDetail.unit_qty,
            carry_fg: outgoDetail.carry_fg,
            remark: outgoDetail.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: outgoDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.SalOutgoDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: ISalOutgoDetail[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let outgoDetail of body) {
        count += await this.repo.destroy({ where: { uuid: outgoDetail.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.SalOutgoDetail.getTableName() as string, previousRaws, uid, transaction);
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
   * @param outgoId 전표 ID
   * @param transaction Transaction
   * @returns 합계 금액, 수량 Object
   */
  getTotals = async(outgoId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('sum', Sequelize.col('qty')), 'total_qty' ],
          [ Sequelize.fn('sum', Sequelize.col('total_price')), 'total_price' ]
        ],
        where: { outgo_id: outgoId },
        group: [ 'outgo_id' ],
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
   * @param outgoId 전표 ID
   * @param transaction Transaction
   * @returns Max Sequence
   */
  getMaxSeq = async(outgoId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('max', Sequelize.col('seq')), 'seq' ],
        ],
        where: { outgo_id: outgoId },
        group: [ 'outgo_id' ],
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
   * @param outgoId 전표 ID
   * @param transaction Transaction
   * @returns 전표단위의 상세전표 개수
   */
  getCount = async(outgoId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('count', Sequelize.col('outgo_id')), 'count' ],
        ],
        where: { outgo_id: outgoId },
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

export default SalOutgoDetailRepo;