import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import InvStockReject from '../../models/inv/stock-reject.model';
import IInvStockReject from '../../interfaces/inv/stock-reject.interface';

class InvStockRejectRepo {
  repo: Repository<InvStockReject>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(InvStockReject);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IInvStockReject[], uid: number, transaction?: Transaction) => {
    try {
      const stockReject = body.map((stockReject) => {
        return {
          factory_id: stockReject.factory_id,
          reg_date: stockReject.reg_date,
          prod_id: stockReject.prod_id,
          reject_id: stockReject.reject_id,
          lot_no: stockReject.lot_no,
          qty: stockReject.qty,
          from_store_id: stockReject.from_store_id,
          from_location_id: stockReject.from_location_id,
          to_store_id: stockReject.to_store_id,
          to_location_id: stockReject.to_location_id,
          remark: stockReject.remark,
          barcode: stockReject.barcode,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(stockReject, { individualHooks: true, transaction });

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
      const result = await this.repo.findAll({ 
        include: [
          { 
            model: this.sequelize.models.StdFactory, 
            attributes: [], 
            required: true, 
            where: { uuid: params.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
          },
          { 
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
              { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ],
          },
          { 
            model: this.sequelize.models.StdReject, 
            attributes: [], 
            required: true,
            include: [{ model: this.sequelize.models.StdRejectType, attributes: [], required: false }],
          },
          { 
            model: this.sequelize.models.StdStore, 
            as: 'fromStore', 
            attributes: [], 
            required: true,
            where: { uuid: params.from_store_uuid ? params.from_store_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.StdLocation, as: 'fromLocation', attributes: [], required: false },
          { model: this.sequelize.models.StdStore, as: 'toStore', attributes: [], required: true },
          { model: this.sequelize.models.StdLocation, as: 'toLocation', attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('invStockReject.uuid'), 'stock_reject_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'reg_date',
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
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          'lot_no',
          'qty',
          [ Sequelize.col('fromStore.uuid'), 'from_store_uuid' ],
          [ Sequelize.col('fromStore.store_cd'), 'from_store_cd' ],
          [ Sequelize.col('fromStore.store_nm'), 'from_store_nm' ],
          [ Sequelize.col('fromLocation.uuid'), 'from_location_uuid' ],
          [ Sequelize.col('fromLocation.location_cd'), 'from_location_cd' ],
          [ Sequelize.col('fromLocation.location_nm'), 'from_location_nm' ],
          [ Sequelize.col('toStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('toStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('toStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('toLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('toLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('toLocation.location_nm'), 'to_location_nm' ],
          'remark',
          'barcode',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { 
          [Op.and]: [
            Sequelize.where(Sequelize.fn('date', Sequelize.col('invStockReject.reg_date')), '>=', params.start_date),
            Sequelize.where(Sequelize.fn('date', Sequelize.col('invStockReject.reg_date')), '<=', params.end_date),
          ]
        },
        order: [ 'factory_id', 'reg_date', 'from_store_id', 'from_location_id' ],
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
          { model: this.sequelize.models.StdFactory, attributes: [], required: true },
          { 
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
              { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ],
          },
          { 
            model: this.sequelize.models.StdReject, 
            attributes: [], 
            required: true,
            include: [{ model: this.sequelize.models.StdRejectType, attributes: [], required: false }],
          },
          { model: this.sequelize.models.StdStore, as: 'fromStore', attributes: [], required: true },
          { model: this.sequelize.models.StdLocation, as: 'fromLocation', attributes: [], required: false },
          { model: this.sequelize.models.StdStore, as: 'toStore', attributes: [], required: true },
          { model: this.sequelize.models.StdLocation, as: 'toLocation', attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('invStockReject.uuid'), 'stock_reject_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'reg_date',
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
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          'lot_no',
          'qty',
          [ Sequelize.col('fromStore.uuid'), 'from_store_uuid' ],
          [ Sequelize.col('fromStore.store_cd'), 'from_store_cd' ],
          [ Sequelize.col('fromStore.store_nm'), 'from_store_nm' ],
          [ Sequelize.col('fromLocation.uuid'), 'from_location_uuid' ],
          [ Sequelize.col('fromLocation.location_cd'), 'from_location_cd' ],
          [ Sequelize.col('fromLocation.location_nm'), 'from_location_nm' ],
          [ Sequelize.col('toStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('toStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('toStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('toLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('toLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('toLocation.location_nm'), 'to_location_nm' ],
          'remark',
          'barcode',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { uuid },
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
  public update = async(body: IInvStockReject[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let stockReject of body) {
        const result = await this.repo.update(
          {
            qty: stockReject.qty != null ? stockReject.qty : null,
            remark: stockReject.remark != null ? stockReject.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: stockReject.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.InvStockReject.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IInvStockReject[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let stockReject of body) {
        const result = await this.repo.update(
          {
            qty: stockReject.qty,
            remark: stockReject.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: stockReject.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.InvStockReject.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IInvStockReject[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let stockReject of body) {
        count += await this.repo.destroy({ where: { uuid: stockReject.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.InvStockReject.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default InvStockRejectRepo;