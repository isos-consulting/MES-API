import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction, UniqueConstraintError, WhereOptions } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import OutReleaseDetail from '../../models/out/release-detail.model';
import IOutReleaseDetail from '../../interfaces/out/release-detail.interface';
import OutRelease from '../../models/out/release.model';

class OutReleaseDetailRepo {
  repo: Repository<OutReleaseDetail>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(OutReleaseDetail);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IOutReleaseDetail[], uid: number, transaction?: Transaction) => {
    try {
      const releaseDetails = body.map((releaseDetail) => {
        return {
          release_id: releaseDetail.release_id,
          seq: releaseDetail.seq,
          factory_id: releaseDetail.factory_id,
          prod_id: releaseDetail.prod_id,
          lot_no: releaseDetail.lot_no,
          qty: releaseDetail.qty,
          price: releaseDetail.price,
          money_unit_id: releaseDetail.money_unit_id,
          exchange: releaseDetail.exchange,
          total_price: releaseDetail.total_price,
          unit_qty: releaseDetail.unit_qty,
          order_detail_id: releaseDetail.order_detail_id,
          from_store_id: releaseDetail.from_store_id,
          from_location_id: releaseDetail.from_location_id,
          remark: releaseDetail.remark,
          barcode: releaseDetail.barcode,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(releaseDetails, { individualHooks: true, transaction });

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
      // 외주출고 전표일자 기준 조회시 일자 조회조건 추가
      let releaseWhereOptions: WhereOptions<OutRelease>;
      if (params.start_date && params.end_date) {
        releaseWhereOptions = {
          [Op.and]: [
            { uuid: params.release_uuid ? params.release_uuid : { [Op.ne]: null } },
            {[Op.and]: [
              Sequelize.where(Sequelize.fn('date', Sequelize.col('outRelease.reg_date')), '>=', params.start_date),
              Sequelize.where(Sequelize.fn('date', Sequelize.col('outRelease.reg_date')), '<=', params.end_date),
            ]}
          ]
        }
      } else {
        releaseWhereOptions = { uuid: params.release_uuid ? params.release_uuid : { [Op.ne]: null } }
      }

      const result = await this.repo.findAll({ 
        include: [
          { 
            model: sequelize.models.OutRelease, 
            attributes: [], 
            required: true, 
            where: releaseWhereOptions,
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
          { model: sequelize.models.MatOrderDetail, attributes: [], required: false },
          { model: sequelize.models.StdStore, attributes: [], required: true },
          { model: sequelize.models.StdLocation, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('outRelease.uuid'), 'release_uuid' ],
          [ Sequelize.col('outReleaseDetail.uuid'), 'release_detail_uuid' ],
          [ Sequelize.col('outRelease.stmt_no'), 'stmt_no' ],
          'seq',
          [ Sequelize.fn('concat', Sequelize.col('outRelease.stmt_no'), '-', Sequelize.col('outReleaseDetail.seq')), 'stmt_no_sub' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('matOrderDetail.uuid'), 'order_detail_uuid' ],
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
          [ Sequelize.col('matOrderDetail.qty'), 'order_qty' ],
          'qty',
          'price',
          [ Sequelize.col('stdMoneyUnit.uuid'), 'money_unit_uuid' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_cd'), 'money_unit_cd' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_nm'), 'money_unit_nm' ],
          'exchange',
          'total_price',
          [ Sequelize.col('stdStore.uuid'), 'from_store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'from_location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'location_nm' ],
          'remark',
          'barcode',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'release_id', 'seq', 'release_detail_id' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.repo.findAll({ 
        include: [
          { 
            model: sequelize.models.OutRelease, 
            attributes: [], 
            required: true, 
            include: [
              { model: sequelize.models.StdPartner, attributes: [], required: true },
            ]
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
          { model: sequelize.models.MatOrderDetail, attributes: [], required: false },
          { model: sequelize.models.StdStore, attributes: [], required: true },
          { model: sequelize.models.StdLocation, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('outRelease.uuid'), 'release_uuid' ],
          [ Sequelize.col('outReleaseDetail.uuid'), 'release_detail_uuid' ],
          [ Sequelize.col('outRelease.stmt_no'), 'stmt_no' ],
          'seq',
          [ Sequelize.fn('concat', Sequelize.col('outRelease.stmt_no'), '-', Sequelize.col('outReleaseDetail.seq')), 'stmt_no_sub' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('matOrderDetail.uuid'), 'order_detail_uuid' ],
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
          [ Sequelize.col('matOrderDetail.qty'), 'order_qty' ],
          'qty',
          'price',
          [ Sequelize.col('stdMoneyUnit.uuid'), 'money_unit_uuid' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_cd'), 'money_unit_cd' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_nm'), 'money_unit_nm' ],
          'exchange',
          'total_price',
          [ Sequelize.col('stdStore.uuid'), 'from_store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'from_location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'location_nm' ],
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
  public update = async(body: IOutReleaseDetail[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let releaseDetail of body) {
        const result = await this.repo.update(
          {
            qty: releaseDetail.qty != null ? releaseDetail.qty : null,
            price: releaseDetail.price != null ? releaseDetail.price : null,
            money_unit_id: releaseDetail.money_unit_id != null ? releaseDetail.money_unit_id : null,
            exchange: releaseDetail.exchange != null ? releaseDetail.exchange : null,
            total_price: releaseDetail.total_price != null ? releaseDetail.total_price : null,
            unit_qty: releaseDetail.unit_qty != null ? releaseDetail.unit_qty : null,
            remark: releaseDetail.remark != null ? releaseDetail.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: releaseDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.OutReleaseDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IOutReleaseDetail[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let releaseDetail of body) {
        const result = await this.repo.update(
          {
            qty: releaseDetail.qty,
            price: releaseDetail.price,
            money_unit_id: releaseDetail.money_unit_id,
            exchange: releaseDetail.exchange,
            total_price: releaseDetail.total_price,
            unit_qty: releaseDetail.unit_qty,
            remark: releaseDetail.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: releaseDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.OutReleaseDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IOutReleaseDetail[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let releaseDetail of body) {
        count += await this.repo.destroy({ where: { uuid: releaseDetail.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.OutReleaseDetail.getTableName() as string, previousRaws, uid, transaction);
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
   * @param releaseId 전표 ID
   * @param transaction Transaction
   * @returns 합계 금액, 수량 Object
   */
  getTotals = async(releaseId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('sum', Sequelize.col('qty')), 'total_qty' ],
          [ Sequelize.fn('sum', Sequelize.col('total_price')), 'total_price' ]
        ],
        where: { release_id: releaseId },
        group: [ 'release_id' ],
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
   * @param releaseId 전표 ID
   * @param transaction Transaction
   * @returns Max Sequence
   */
  getMaxSeq = async(releaseId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('max', Sequelize.col('seq')), 'seq' ],
        ],
        where: { release_id: releaseId },
        group: [ 'release_id' ],
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
   * @param releaseId 전표 ID
   * @param transaction Transaction
   * @returns 전표단위의 상세전표 개수
   */
  getCount = async(releaseId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('count', Sequelize.col('release_id')), 'count' ],
        ],
        where: { release_id: releaseId },
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

export default OutReleaseDetailRepo;