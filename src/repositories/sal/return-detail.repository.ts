import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError, WhereOptions } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import SalReturnDetail from '../../models/sal/return-detail.model';
import ISalReturnDetail from '../../interfaces/sal/return-detail.interface';
import { Sequelize } from 'sequelize-typescript';

class SalReturnDetailRepo {
  repo: Repository<SalReturnDetail>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(SalReturnDetail);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: ISalReturnDetail[], uid: number, transaction?: Transaction) => {
    try {
      const returnDetail = body.map((returnDetail) => {
        return {
          return_id: returnDetail.return_id,
          seq: returnDetail.seq,
          factory_id: returnDetail.factory_id,
          prod_id: returnDetail.prod_id,
          lot_no: returnDetail.lot_no,
          qty: returnDetail.qty,
          price: returnDetail.price,
          money_unit_id: returnDetail.money_unit_id,
          exchange: returnDetail.exchange,
          total_price: returnDetail.total_price,
          reject_id: returnDetail.reject_id,
          outgo_detail_id: returnDetail.outgo_detail_id,
          to_store_id: returnDetail.to_store_id,
          to_location_id: returnDetail.to_location_id,
          remark: returnDetail.remark,
          barcode: returnDetail.barcode,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(returnDetail, { individualHooks: true, transaction });

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
      // 제품반입 전표일자 기준 조회시 일자 조회조건 추가
      let returnWhereOptions: WhereOptions;
      if (params.start_date && params.end_date) {
        returnWhereOptions = {
          [Op.and]: [
            { uuid: params.return_uuid ? params.return_uuid : { [Op.ne]: null } },
            {[Op.and]: [
              Sequelize.where(Sequelize.fn('date', Sequelize.col('salReturn.reg_date')), '>=', params.start_date),
              Sequelize.where(Sequelize.fn('date', Sequelize.col('salReturn.reg_date')), '<=', params.end_date),
            ]}
          ]
        }
      } else {
        returnWhereOptions = { uuid: params.return_uuid ? params.return_uuid : { [Op.ne]: null } }
      }

      const result = await this.repo.findAll({ 
        include: [
          { 
            model: sequelize.models.SalReturn, 
            attributes: [], 
            required: true, 
            where: returnWhereOptions,
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
          { 
            model: sequelize.models.StdReject, 
            attributes: [], 
            required: false,
            include: [
              { model: sequelize.models.StdRejectType, attributes: [], required: true },
            ],
          },
          { model: sequelize.models.SalOutgoDetail, attributes: [], required: false },
          { model: sequelize.models.StdMoneyUnit, attributes: [], required: true },
          { model: sequelize.models.StdStore, attributes: [], required: true },
          { model: sequelize.models.StdLocation, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('salReturn.uuid'), 'return_uuid' ],
          [ Sequelize.col('salReturnDetail.uuid'), 'return_detail_uuid' ],
          [ Sequelize.col('salReturn.stmt_no'), 'stmt_no' ],
          'seq',
          [ Sequelize.fn('concat', Sequelize.col('salReturn.stmt_no'), '-', Sequelize.col('salReturnDetail.seq')), 'stmt_no_sub' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('salOutgoDetail.uuid'), 'outgo_detail_uuid' ],
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
          [ Sequelize.col('salOutgoDetail.qty'), 'outgo_qty' ],
          'qty',
          'price',
          [ Sequelize.col('stdMoneyUnit.uuid'), 'money_unit_uuid' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_cd'), 'money_unit_cd' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_nm'), 'money_unit_nm' ],
          'exchange',
          'total_price',
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
          [ Sequelize.col('stdStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'to_location_nm' ],
          'remark',
          'barcode',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'return_id', 'seq', 'return_detail_id' ],
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
          { model: sequelize.models.SalReturn, attributes: [], required: true },
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
          { 
            model: sequelize.models.StdReject, 
            attributes: [], 
            required: false,
            include: [
              { model: sequelize.models.StdRejectType, attributes: [], required: true },
            ],
          },
          { model: sequelize.models.SalOutgoDetail, attributes: [], required: false },
          { model: sequelize.models.StdMoneyUnit, attributes: [], required: true },
          { model: sequelize.models.StdStore, attributes: [], required: true },
          { model: sequelize.models.StdLocation, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('salReturn.uuid'), 'return_uuid' ],
          [ Sequelize.col('salReturnDetail.uuid'), 'return_detail_uuid' ],
          [ Sequelize.col('salReturn.stmt_no'), 'stmt_no' ],
          'seq',
          [ Sequelize.fn('concat', Sequelize.col('salReturn.stmt_no'), '-', Sequelize.col('salReturnDetail.seq')), 'stmt_no_sub' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('salOutgoDetail.uuid'), 'outgo_detail_uuid' ],
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
          [ Sequelize.col('salOutgoDetail.qty'), 'outgo_qty' ],
          'qty',
          'price',
          [ Sequelize.col('stdMoneyUnit.uuid'), 'money_unit_uuid' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_cd'), 'money_unit_cd' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_nm'), 'money_unit_nm' ],
          'exchange',
          'total_price',
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
          [ Sequelize.col('stdStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'to_location_nm' ],
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
  public update = async(body: ISalReturnDetail[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let returnDetail of body) {
        const result = await this.repo.update(
          {
            qty: returnDetail.qty != null ? returnDetail.qty : null ,
            price: returnDetail.price != null ? returnDetail.price : null ,
            money_unit_id: returnDetail.money_unit_id != null ? returnDetail.money_unit_id : null ,
            exchange: returnDetail.exchange != null ? returnDetail.exchange : null ,
            total_price: returnDetail.total_price != null ? returnDetail.total_price : null ,
            remark: returnDetail.remark != null ? returnDetail.remark : null ,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: returnDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.SalReturnDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: ISalReturnDetail[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let returnDetail of body) {
        const result = await this.repo.update(
          {
            qty: returnDetail.qty,
            price: returnDetail.price,
            money_unit_id: returnDetail.money_unit_id,
            exchange: returnDetail.exchange,
            total_price: returnDetail.total_price,
            remark: returnDetail.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: returnDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.SalReturnDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: ISalReturnDetail[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let returnDetail of body) {
        count += await this.repo.destroy({ where: { uuid: returnDetail.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.SalReturnDetail.getTableName() as string, previousRaws, uid, transaction);
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
   * @param returnId 전표 ID
   * @param transaction Transaction
   * @returns 합계 금액, 수량 Object
   */
  getTotals = async(returnId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('sum', Sequelize.col('qty')), 'total_qty' ],
          [ Sequelize.fn('sum', Sequelize.col('total_price')), 'total_price' ]
        ],
        where: { return_id: returnId },
        group: [ 'return_id' ],
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
   * @param returnId 전표 ID
   * @param transaction Transaction
   * @returns Max Sequence
   */
  getMaxSeq = async(returnId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('max', Sequelize.col('seq')), 'seq' ],
        ],
        where: { return_id: returnId },
        group: [ 'return_id' ],
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
   * @param returnId 전표 ID
   * @param transaction Transaction
   * @returns 전표단위의 상세전표 개수
   */
  getCount = async(returnId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('count', Sequelize.col('return_id')), 'count' ],
        ],
        where: { return_id: returnId },
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

export default SalReturnDetailRepo;