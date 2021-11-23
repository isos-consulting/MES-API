import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdProd from '../../models/std/prod.model';
import IStdProd from '../../interfaces/std/prod.interface';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';

class StdProdRepo {
  repo: Repository<StdProd>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(StdProd);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdProd[], uid: number, transaction?: Transaction) => {
    try {
      const prod = body.map((prod) => {
        return {
          prod_no: prod.prod_no,
          prod_nm: prod.prod_nm,
          item_type_id: prod.item_type_id,
          prod_type_id: prod.prod_type_id,
          model_id: prod.model_id,
          unit_id: prod.unit_id,
          rev: prod.rev,
          prod_std: prod.prod_std,
          lot_fg: prod.lot_fg,
          use_fg: prod.use_fg,
          active_fg: prod.active_fg,
          bom_type_cd: prod.bom_type_cd,
          width: prod.width,
          length: prod.length,
          height: prod.height,
          material: prod.material,
          color: prod.color,
          weight: prod.weight,
          thickness: prod.thickness,
          mat_order_fg: prod.mat_order_fg,
          mat_unit_id: prod.mat_unit_id,
          mat_order_min_qty: prod.mat_order_min_qty,
          mat_supply_days: prod.mat_supply_days,
          sal_order_fg: prod.sal_order_fg,
          inv_use_fg: prod.inv_use_fg,
          inv_unit_qty: prod.inv_unit_qty,
          inv_safe_qty: prod.inv_safe_qty,
          inv_to_store_id: prod.inv_to_store_id,
          inv_to_location_id: prod.inv_to_location_id,
          qms_receive_insp_fg: prod.qms_receive_insp_fg,
          qms_proc_insp_fg: prod.qms_proc_insp_fg,
          qms_final_insp_fg: prod.qms_final_insp_fg,
          prd_active_fg: prod.prd_active_fg,
          prd_plan_type_cd: prod.prd_plan_type_cd,
          prd_min: prod.prd_min,
          prd_max: prod.prd_max,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(prod, { individualHooks: true, transaction });

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
          { model: sequelize.models.StdItemType, attributes: [], required: false },
          { model: sequelize.models.StdProdType, attributes: [], required: false },
          { model: sequelize.models.StdModel, attributes: [], required: false },
          { model: sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
          { model: sequelize.models.StdUnit, as: 'matUnit', attributes: [], required: false },
          { model: sequelize.models.StdStore, attributes: [], required: false },
          { model: sequelize.models.StdLocation, attributes: [], required: false },
          { model: sequelize.models.AdmBomType, attributes: [], required: false },
          { model: sequelize.models.AdmPrdPlanType, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdProd.uuid'), 'prod_uuid' ],
          'prod_no',
          'prod_nm',
          [ Sequelize.col('stdItemType.uuid'), 'item_type_uuid' ],
          [ Sequelize.col('stdItemType.item_type_cd'), 'item_type_cd' ],
          [ Sequelize.col('stdItemType.item_type_nm'), 'item_type_nm' ],
          [ Sequelize.col('stdProdType.uuid'), 'prod_type_uuid' ],
          [ Sequelize.col('stdProdType.prod_type_cd'), 'prod_type_cd' ],
          [ Sequelize.col('stdProdType.prod_type_nm'), 'prod_type_nm' ],
          [ Sequelize.col('stdModel.uuid'), 'model_uuid' ],
          [ Sequelize.col('stdModel.model_cd'), 'model_cd' ],
          [ Sequelize.col('stdModel.model_nm'), 'model_nm' ],
          'rev',
          'prod_std',
          [ Sequelize.col('stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('stdUnit.unit_nm'), 'unit_nm' ],
          'lot_fg',
          'use_fg',
          'active_fg',
          'bom_type_cd',
          [ Sequelize.col('AdmBomType.bom_type_nm'), 'bom_type_nm' ],
          'width',
          'length',
          'height',
          'material',
          'color',
          'weight',
          'thickness',
          'mat_order_fg',
          [ Sequelize.col('matUnit.uuid'), 'mat_unit_uuid' ],
          [ Sequelize.col('matUnit.unit_cd'), 'mat_unit_cd' ],
          [ Sequelize.col('matUnit.unit_nm'), 'mat_unit_nm' ],
          'mat_order_min_qty',
          'mat_supply_days',
          'sal_order_fg',
          'inv_use_fg',
          'inv_unit_qty',
          'inv_safe_qty',
          [ Sequelize.col('stdStore.uuid'), 'inv_to_store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'inv_to_store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'inv_to_store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'inv_to_location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'inv_to_location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'inv_to_location_nm' ],
          'qms_receive_insp_fg',
          'qms_proc_insp_fg',
          'qms_final_insp_fg',
          'prd_active_fg',
          'prd_plan_type_cd',
          [ Sequelize.col('AdmPrdPlanType.prd_plan_type_nm'), 'prd_plan_type_nm' ],
          'prd_min',
          'prd_max',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'prod_id' ],
        where: {
          [Op.and]: [
            params.use_fg != null ? { use_fg: params.use_fg } : {},
            params.qms_receive_insp_fg != null ? { qms_receive_insp_fg: params.qms_receive_insp_fg } : {},
            params.qms_proc_insp_fg != null ? { qms_proc_insp_fg: params.qms_proc_insp_fg } : {},
            params.qms_final_insp_fg != null ? { qms_final_insp_fg: params.qms_final_insp_fg } : {},
            params.prd_active_fg != null ? { prd_active_fg: params.prd_active_fg } : {},
          ]
        }
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
          { model: sequelize.models.StdItemType, attributes: [], required: false },
          { model: sequelize.models.StdProdType, attributes: [], required: false },
          { model: sequelize.models.StdModel, attributes: [], required: false },
          { model: sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
          { model: sequelize.models.StdUnit, as: 'matUnit', attributes: [], required: false },
          { model: sequelize.models.StdStore, attributes: [], required: false },
          { model: sequelize.models.StdLocation, attributes: [], required: false },
          { model: sequelize.models.AdmBomType, attributes: [], required: false },
          { model: sequelize.models.AdmPrdPlanType, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdProd.uuid'), 'prod_uuid' ],
          'prod_no',
          'prod_nm',
          [ Sequelize.col('stdItemType.uuid'), 'item_type_uuid' ],
          [ Sequelize.col('stdItemType.item_type_cd'), 'item_type_cd' ],
          [ Sequelize.col('stdItemType.item_type_nm'), 'item_type_nm' ],
          [ Sequelize.col('stdProdType.uuid'), 'prod_type_uuid' ],
          [ Sequelize.col('stdProdType.prod_type_cd'), 'prod_type_cd' ],
          [ Sequelize.col('stdProdType.prod_type_nm'), 'prod_type_nm' ],
          [ Sequelize.col('stdModel.uuid'), 'model_uuid' ],
          [ Sequelize.col('stdModel.model_cd'), 'model_cd' ],
          [ Sequelize.col('stdModel.model_nm'), 'model_nm' ],
          'rev',
          'prod_std',
          [ Sequelize.col('stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('stdUnit.unit_nm'), 'unit_nm' ],
          'lot_fg',
          'use_fg',
          'active_fg',
          'bom_type_cd',
          [ Sequelize.col('AdmBomType.bom_type_nm'), 'bom_type_nm' ],
          'width',
          'length',
          'height',
          'material',
          'color',
          'weight',
          'thickness',
          'mat_order_fg',
          [ Sequelize.col('matUnit.uuid'), 'mat_unit_uuid' ],
          [ Sequelize.col('matUnit.unit_cd'), 'mat_unit_cd' ],
          [ Sequelize.col('matUnit.unit_nm'), 'mat_unit_nm' ],
          'mat_order_min_qty',
          'mat_supply_days',
          'sal_order_fg',
          'inv_use_fg',
          'inv_unit_qty',
          'inv_safe_qty',
          [ Sequelize.col('stdStore.uuid'), 'inv_to_store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'inv_to_store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'inv_to_store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'inv_to_location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'inv_to_location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'inv_to_location_nm' ],
          'qms_receive_insp_fg',
          'qms_proc_insp_fg',
          'qms_final_insp_fg',
          'prd_active_fg',
          'prd_plan_type_cd',
          [ Sequelize.col('AdmPrdPlanType.prd_plan_type_nm'), 'prd_plan_type_nm' ],
          'prd_min',
          'prd_max',
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

  // 📒 Fn[readRawByPk]: Id 를 포함한 Raw Data Read Function
  public readRawByPk = async(id: number) => {
    const result = await this.repo.findOne({ where: { prod_id: id } });
    return convertReadResult(result);
  };

  // 📒 Fn[readRawByUnique]: Unique Key를 통하여 Raw Data Read Function
  public readRawByUnique = async(
    params: { prod_no: string, rev: string }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { prod_no: params.prod_no },
          { rev: params.rev }
        ]
      }
    });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdProd[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let prod of body) {
        const result = await this.repo.update(
          {
            prod_no: prod.prod_no != null ? prod.prod_no : null,
            prod_nm: prod.prod_nm != null ? prod.prod_nm : null,
            item_type_id: prod.item_type_id != null ? prod.item_type_id : null,
            prod_type_id: prod.prod_type_id != null ? prod.prod_type_id : null,
            model_id: prod.model_id != null ? prod.model_id : null,
            unit_id: prod.unit_id != null ? prod.unit_id : null,
            rev: prod.rev != null ? prod.rev : null,
            prod_std: prod.prod_std != null ? prod.prod_std : null,
            lot_fg: prod.lot_fg != null ? prod.lot_fg : null,
            use_fg: prod.use_fg != null ? prod.use_fg : null,
            active_fg: prod.active_fg != null ? prod.active_fg : null,
            bom_type_cd: prod.bom_type_cd != null ? prod.bom_type_cd : null,
            width: prod.width != null ? prod.width : null,
            length: prod.length != null ? prod.length : null,
            height: prod.height != null ? prod.height : null,
            material: prod.material != null ? prod.material : null,
            color: prod.color != null ? prod.color : null,
            weight: prod.weight != null ? prod.weight : null,
            thickness: prod.thickness != null ? prod.thickness : null,
            mat_order_fg: prod.mat_order_fg != null ? prod.mat_order_fg : null,
            mat_unit_id: prod.mat_unit_id != null ? prod.mat_unit_id : null,
            mat_order_min_qty: prod.mat_order_min_qty != null ? prod.mat_order_min_qty : null,
            mat_supply_days: prod.mat_supply_days != null ? prod.mat_supply_days : null,
            sal_order_fg: prod.sal_order_fg != null ? prod.sal_order_fg : null,
            inv_use_fg: prod.inv_use_fg != null ? prod.inv_use_fg : null,
            inv_unit_qty: prod.inv_unit_qty != null ? prod.inv_unit_qty : null,
            inv_safe_qty: prod.inv_safe_qty != null ? prod.inv_safe_qty : null,
            inv_to_store_id: prod.inv_to_store_id != null ? prod.inv_to_store_id : null,
            inv_to_location_id: prod.inv_to_location_id != null ? prod.inv_to_location_id : null,
            qms_receive_insp_fg: prod.qms_receive_insp_fg != null ? prod.qms_receive_insp_fg : null,
            qms_proc_insp_fg: prod.qms_proc_insp_fg != null ? prod.qms_proc_insp_fg : null,
            qms_final_insp_fg: prod.qms_final_insp_fg != null ? prod.qms_final_insp_fg : null,
            prd_active_fg: prod.prd_active_fg != null ? prod.prd_active_fg : null,
            prd_plan_type_cd: prod.prd_plan_type_cd != null ? prod.prd_plan_type_cd : null,
            prd_min: prod.prd_min != null ? prod.prd_min : null,
            prd_max: prod.prd_max != null ? prod.prd_max : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: prod.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.StdProd.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdProd[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let prod of body) {
        const result = await this.repo.update(
          {
            prod_no: prod.prod_no,
            prod_nm: prod.prod_nm,
            item_type_id: prod.item_type_id,
            prod_type_id: prod.prod_type_id,
            model_id: prod.model_id,
            unit_id: prod.unit_id,
            rev: prod.rev,
            prod_std: prod.prod_std,
            lot_fg: prod.lot_fg,
            use_fg: prod.use_fg,
            active_fg: prod.active_fg,
            bom_type_cd: prod.bom_type_cd,
            width: prod.width,
            length: prod.length,
            height: prod.height,
            material: prod.material,
            color: prod.color,
            weight: prod.weight,
            thickness: prod.thickness,
            mat_order_fg: prod.mat_order_fg,
            mat_unit_id: prod.mat_unit_id,
            mat_order_min_qty: prod.mat_order_min_qty,
            mat_supply_days: prod.mat_supply_days,
            sal_order_fg: prod.sal_order_fg,
            inv_use_fg: prod.inv_use_fg,
            inv_unit_qty: prod.inv_unit_qty,
            inv_safe_qty: prod.inv_safe_qty,
            inv_to_store_id: prod.inv_to_store_id,
            inv_to_location_id: prod.inv_to_location_id,
            qms_receive_insp_fg: prod.qms_receive_insp_fg,
            qms_proc_insp_fg: prod.qms_proc_insp_fg,
            qms_final_insp_fg: prod.qms_final_insp_fg,
            prd_active_fg: prod.prd_active_fg,
            prd_plan_type_cd: prod.prd_plan_type_cd,
            prd_min: prod.prd_min,
            prd_max: prod.prd_max,
            updated_uid: uid,
          },
          { 
            where: { uuid: prod.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.StdProd.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdProd[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let prod of body) {
        count += await this.repo.destroy({ where: { uuid: prod.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.StdProd.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default StdProdRepo;