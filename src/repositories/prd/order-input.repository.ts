import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import PrdOrderInput from '../../models/prd/order-input.model';
import IPrdOrderInput from '../../interfaces/prd/order-input.interface';

class PrdOrderInputRepo {
  repo: Repository<PrdOrderInput>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(PrdOrderInput);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IPrdOrderInput[], uid: number, transaction?: Transaction) => {
    try {
      const orderInputs = body.map((orderInput) => {
        return {
          factory_id: orderInput.factory_id,
          order_id: orderInput.order_id,
          prod_id: orderInput.prod_id,
          c_usage: orderInput.c_usage,
          unit_id: orderInput.unit_id,
          from_store_id: orderInput.from_store_id,
          from_location_id: orderInput.from_location_id,
          remark: orderInput.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(orderInputs, { individualHooks: true, transaction });

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
            model: sequelize.models.StdFactory, 
            attributes: [], 
            required: true,
            where: params.factory_uuid ? { uuid: params.factory_uuid } : {}
          },
          { 
            model: sequelize.models.PrdOrder,
            attributes: [], 
            required: true,
            where: params.order_uuid ? { uuid: params.order_uuid } : {}
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
            ]
          },
          { model: sequelize.models.StdUnit, attributes: [], required: true },
          { 
            model: sequelize.models.StdUnitConvert,
            attributes: [], 
            required: false,
            where: Sequelize.where(Sequelize.col('stdUnitConvert.to_unit_id'), '=', Sequelize.col('stdUnit.unit_id'))
          },
          { model: sequelize.models.StdStore, attributes: [], required: false },
          { model: sequelize.models.StdLocation, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdOrderInput.uuid'), 'order_input_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdOrder.uuid'), 'order_uuid' ],
          [ Sequelize.col('prdOrder.order_no'), 'order_no' ],
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
          [ Sequelize.col('stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('stdUnit.unit_nm'), 'unit_nm' ],
          [ Sequelize.literal('prdOrderInput.c_usage * COALESCE(stdUnitConvert.convert_value, 1)'), 'c_usage' ],
          [ Sequelize.col('stdStore.uuid'), 'from_store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'from_store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'from_store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'from_location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'from_location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'from_location_nm' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'order_id' ]
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
          { model: sequelize.models.StdFactory, attributes: [], required: true },
          { model: sequelize.models.PrdOrder,attributes: [], required: true },
          {
            model: sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: sequelize.models.StdItemType, attributes: [], required: false },
              { model: sequelize.models.StdProdType, attributes: [], required: false },
              { model: sequelize.models.StdModel, attributes: [], required: false },
              { model: sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ]
          },
          { model: sequelize.models.StdUnit, attributes: [], required: true },
          { model: sequelize.models.StdUnitConvert,attributes: [], required: false },
          { model: sequelize.models.StdStore, attributes: [], required: false },
          { model: sequelize.models.StdLocation, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdOrderInput.uuid'), 'order_input_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdOrder.uuid'), 'order_uuid' ],
          [ Sequelize.col('prdOrder.order_no'), 'order_no' ],
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
          [ Sequelize.col('stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('stdUnit.unit_nm'), 'unit_nm' ],
          [ Sequelize.literal('prdOrderInput.c_usage * COALESCE(stdUnitConvert.convert_value, 1)'), 'c_usage' ],
          [ Sequelize.col('stdStore.uuid'), 'from_store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'from_store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'from_store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'from_location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'from_location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'from_location_nm' ],
          'remark',
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

  // 📒 Fn[readRawsByOrderId]: 작업지시의 Id를 이용하여 Raw Data Read Function
  public readRawsByOrderId = async(orderId: string, transaction?: Transaction) => {
    const result = await this.repo.findAll({ where: { order_id: orderId }, transaction });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IPrdOrderInput[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let orderInput of body) {
        const result = await this.repo.update(
          {
            c_usage: orderInput.c_usage != null ? orderInput.c_usage : null,
            unit_id: orderInput.unit_id != null ? orderInput.unit_id : null,
            from_store_id: orderInput.from_store_id != null ? orderInput.from_store_id : null,
            from_location_id: orderInput.from_location_id != null ? orderInput.from_location_id : null,
            remark: orderInput.remark != null ? orderInput.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: orderInput.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.PrdOrderInput.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IPrdOrderInput[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let orderInput of body) {
        const result = await this.repo.update(
          {
            c_usage: orderInput.c_usage,
            unit_id: orderInput.unit_id,
            from_store_id: orderInput.from_store_id,
            from_location_id: orderInput.from_location_id,
            remark: orderInput.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: orderInput.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.PrdOrderInput.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IPrdOrderInput[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let orderInput of body) {
        count += await this.repo.destroy({ where: { uuid: orderInput.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.PrdOrderInput.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[deleteByOrderIds]: 지시 Id 기준 투입 리스트 삭제
  public deleteByOrderIds = async(orderIds: number[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {
      const previousRaws = await this.repo.findAll({ where: { order_id: orderIds }});
      count += await this.repo.destroy({ where: { order_id: orderIds }, transaction});

      await new AdmLogRepo().create('delete', sequelize.models.PrdOrderInput.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default PrdOrderInputRepo;