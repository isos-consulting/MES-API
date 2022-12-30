import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdProd from '../../models/std/prod.model';
import IStdProd from '../../interfaces/std/prod.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';
import { readWithWorkings } from '../../queries/std/prod.prod-routingworkings.query';

class StdProdRepo {
  repo: Repository<StdProd>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdProd);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdProd[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((prod: any) => {
        return this.repo.create(
          {
            prod_no: prod.prod_no,
            prod_no_pre: prod.prod_no_pre,
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
            bom_type_id: prod.bom_type_id,
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
            prd_plan_type_id: prod.prd_plan_type_id,
            prd_min: prod.prd_min,
            prd_max: prod.prd_max,
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
      const result = await this.repo.findAll({ 
        include: [
          { model: this.sequelize.models.StdItemType, attributes: [], required: false },
          { model: this.sequelize.models.StdProdType, attributes: [], required: false },
          { model: this.sequelize.models.StdModel, attributes: [], required: false },
          { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
          { model: this.sequelize.models.StdUnit, as: 'matUnit', attributes: [], required: false },
          { model: this.sequelize.models.StdStore, attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, attributes: [], required: false },
          { model: this.sequelize.models.AdmBomType, attributes: [], required: false },
          { model: this.sequelize.models.AdmPrdPlanType, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdProd.uuid'), 'prod_uuid' ],
          'prod_no',
          'prod_no_pre',
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
          [ Sequelize.col('admBomType.uuid'), 'bom_type_uuid' ],
          [ Sequelize.col('admBomType.bom_type_cd'), 'bom_type_cd' ],
          [ Sequelize.col('admBomType.bom_type_nm'), 'bom_type_nm' ],
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
          [ Sequelize.col('AdmPrdPlanType.uuid'), 'prd_plan_type_uuid' ],
          [ Sequelize.col('AdmPrdPlanType.prd_plan_type_cd'), 'prd_plan_type_cd' ],
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
          { model: this.sequelize.models.StdItemType, attributes: [], required: false },
          { model: this.sequelize.models.StdProdType, attributes: [], required: false },
          { model: this.sequelize.models.StdModel, attributes: [], required: false },
          { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
          { model: this.sequelize.models.StdUnit, as: 'matUnit', attributes: [], required: false },
          { model: this.sequelize.models.StdStore, attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, attributes: [], required: false },
          { model: this.sequelize.models.AdmBomType, attributes: [], required: false },
          { model: this.sequelize.models.AdmPrdPlanType, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdProd.uuid'), 'prod_uuid' ],
          'prod_no',
          'prod_no_pre',
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
          [ Sequelize.col('admBomType.uuid'), 'bom_type_uuid' ],
          [ Sequelize.col('admBomType.bom_type_cd'), 'bom_type_cd' ],
          [ Sequelize.col('admBomType.bom_type_nm'), 'bom_type_nm' ],
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
          [ Sequelize.col('AdmPrdPlanType.uuid'), 'prd_plan_type_uuid' ],
          [ Sequelize.col('AdmPrdPlanType.prd_plan_type_cd'), 'prd_plan_type_cd' ],
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

  // 📒 Fn[readWithWorkings]: 작업장이 포함된 품목
  public readWithWorkings = async(params: any) => {
    const result = await this.sequelize.query(readWithWorkings(params))
    return convertReadResult(result[0]);
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
    params: { prod_no: string, rev?: string }
  ) => {
    const result = await this.repo.findOne({ 
      include: [
        { model: this.sequelize.models.StdItemType, attributes: [], required: false },
        { model: this.sequelize.models.StdProdType, attributes: [], required: false },
        { model: this.sequelize.models.StdModel, attributes: [], required: false },
        { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
        { model: this.sequelize.models.StdUnit, as: 'matUnit', attributes: [], required: false },
        { model: this.sequelize.models.StdStore, attributes: [], required: false },
        { model: this.sequelize.models.StdLocation, attributes: [], required: false },
        { model: this.sequelize.models.AdmBomType, attributes: [], required: false },
        { model: this.sequelize.models.AdmPrdPlanType, attributes: [], required: false },
        { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
        { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
      ],
      attributes: [
        'uuid',
        'prod_no',
        'prod_no_pre',
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
        [ Sequelize.col('admBomType.uuid'), 'bom_type_uuid' ],
        [ Sequelize.col('admBomType.bom_type_cd'), 'bom_type_cd' ],
        [ Sequelize.col('admBomType.bom_type_nm'), 'bom_type_nm' ],
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
        [ Sequelize.col('AdmPrdPlanType.uuid'), 'prd_plan_type_uuid' ],
        [ Sequelize.col('AdmPrdPlanType.prd_plan_type_cd'), 'prd_plan_type_cd' ],
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
          { prod_no: params.prod_no },
          params.rev ? { rev: params.rev } : {}
        ]
      }
    });
    return convertReadResult(result);
  };

  // 📒 Fn[readRawByUniques]: Unique Key를 통하여 Raw Datas Read Function
  public readRawByUniques = async(prodNos: string[]) => {
    const result = await this.repo.findAll({ where: { prod_no: { [Op.in]: prodNos } } });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdProd[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((prod: any) => {
        return this.repo.update(
          {
            prod_no: prod.prod_no ?? null,
            prod_no_pre: prod.prod_no_pre ?? null,
            prod_nm: prod.prod_nm ?? null,
            item_type_id: prod.item_type_id ?? null,
            prod_type_id: prod.prod_type_id ?? null,
            model_id: prod.model_id ?? null,
            unit_id: prod.unit_id ?? null,
            rev: prod.rev ?? null,
            prod_std: prod.prod_std ?? null,
            lot_fg: prod.lot_fg ?? null,
            use_fg: prod.use_fg ?? null,
            active_fg: prod.active_fg ?? null,
            bom_type_id: prod.bom_type_id ?? null,
            width: prod.width ?? null,
            length: prod.length ?? null,
            height: prod.height ?? null,
            material: prod.material ?? null,
            color: prod.color ?? null,
            weight: prod.weight ?? null,
            thickness: prod.thickness ?? null,
            mat_order_fg: prod.mat_order_fg ?? null,
            mat_unit_id: prod.mat_unit_id ?? null,
            mat_order_min_qty: prod.mat_order_min_qty ?? null,
            mat_supply_days: prod.mat_supply_days ?? null,
            sal_order_fg: prod.sal_order_fg ?? null,
            inv_use_fg: prod.inv_use_fg ?? null,
            inv_unit_qty: prod.inv_unit_qty ?? null,
            inv_safe_qty: prod.inv_safe_qty ?? null,
            inv_to_store_id: prod.inv_to_store_id ?? null,
            inv_to_location_id: prod.inv_to_location_id ?? null,
            qms_receive_insp_fg: prod.qms_receive_insp_fg ?? null,
            qms_proc_insp_fg: prod.qms_proc_insp_fg ?? null,
            qms_final_insp_fg: prod.qms_final_insp_fg ?? null,
            prd_active_fg: prod.prd_active_fg ?? null,
            prd_plan_type_id: prod.prd_plan_type_id ?? null,
            prd_min: prod.prd_min ?? null,
            prd_max: prod.prd_max ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: prod.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdProd.getTableName() as string, previousRaws, uid, transaction);
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
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((prod: any) => {
        return this.repo.update(
          {
            prod_no: prod.prod_no,
            prod_no_pre: prod.prod_no_pre,
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
            bom_type_id: prod.bom_type_id,
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
            prd_plan_type_id: prod.prd_plan_type_id,
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
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdProd.getTableName() as string, previousRaws, uid, transaction);
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
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((prod: any) => {
        return this.repo.destroy({ where: { uuid: prod.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdProd.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default StdProdRepo;