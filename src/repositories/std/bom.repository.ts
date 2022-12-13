import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdBom from '../../models/std/bom.model';
import IStdBom from '../../interfaces/std/bom.interface';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Sequelize } from 'sequelize-typescript';
import { Op, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';
import { readBomTrees } from '../../queries/std/bom.tree.query';
import { readToProdOfDownTrees } from '../../queries/std/bom.down-tree.query';
  
class StdBomRepo {
  repo: Repository<StdBom>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdBom);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdBom[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((bom: any) => {
        return this.repo.create(
          {
            factory_id: bom.factory_id,
            p_prod_id: bom.p_prod_id,
            c_prod_id: bom.c_prod_id,
            c_usage: bom.c_usage,
            unit_id: bom.unit_id,
            sortby: bom.sortby,
            bom_input_type_id: bom.bom_input_type_id,
            from_store_id: bom.from_store_id,
            from_location_id: bom.from_location_id,
            remark: bom.remark,
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
          { 
            model: this.sequelize.models.StdFactory, 
            attributes: [], 
            required: true, 
            where: { uuid: params.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
          },
          { 
            as: 'stdPProd',
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            where: { uuid: params.p_prod_uuid ? params.p_prod_uuid : { [Op.ne]: null } },
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
              { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ]
          },
          { 
            as: 'stdCProd',
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
            ]
          },
          { model: this.sequelize.models.StdUnit, attributes: [], required: true },
          { model: this.sequelize.models.AdmBomInputType, attributes: [], required: true },
          { model: this.sequelize.models.StdStore, attributes: [], required: true },
          { model: this.sequelize.models.StdLocation, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdBom.uuid'), 'bom_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdPProd.uuid'), 'p_prod_uuid' ],
          [ Sequelize.col('stdPProd.prod_no'), 'p_prod_no' ],
          [ Sequelize.col('stdPProd.prod_nm'), 'p_prod_nm' ],
          [ Sequelize.col('stdPProd.stdItemType.uuid'), 'p_item_type_uuid' ],
          [ Sequelize.col('stdPProd.stdItemType.item_type_cd'), 'p_item_type_cd' ],
          [ Sequelize.col('stdPProd.stdItemType.item_type_nm'), 'p_item_type_nm' ],
          [ Sequelize.col('stdPProd.stdProdType.uuid'), 'p_prod_type_uuid' ],
          [ Sequelize.col('stdPProd.stdProdType.prod_type_cd'), 'p_prod_type_cd' ],
          [ Sequelize.col('stdPProd.stdProdType.prod_type_nm'), 'p_prod_type_nm' ],
          [ Sequelize.col('stdPProd.stdModel.uuid'), 'p_model_uuid' ],
          [ Sequelize.col('stdPProd.stdModel.model_cd'), 'p_model_cd' ],
          [ Sequelize.col('stdPProd.stdModel.model_nm'), 'p_model_nm' ],
          [ Sequelize.col('stdPProd.rev'), 'p_rev' ],
          [ Sequelize.col('stdPProd.prod_std'), 'p_prod_std' ],
          [ Sequelize.col('stdPProd.stdUnit.uuid'), 'p_unit_uuid' ],
          [ Sequelize.col('stdPProd.stdUnit.unit_cd'), 'p_unit_cd' ],
          [ Sequelize.col('stdPProd.stdUnit.unit_nm'), 'p_unit_nm' ],
          [ Sequelize.col('stdCProd.uuid'), 'c_prod_uuid' ],
          [ Sequelize.col('stdCProd.prod_no'), 'c_prod_no' ],
          [ Sequelize.col('stdCProd.prod_nm'), 'c_prod_nm' ],
          [ Sequelize.col('stdCProd.stdItemType.uuid'), 'c_item_type_uuid' ],
          [ Sequelize.col('stdCProd.stdItemType.item_type_cd'), 'c_item_type_cd' ],
          [ Sequelize.col('stdCProd.stdItemType.item_type_nm'), 'c_item_type_nm' ],
          [ Sequelize.col('stdCProd.stdProdType.uuid'), 'c_prod_type_uuid' ],
          [ Sequelize.col('stdCProd.stdProdType.prod_type_cd'), 'c_prod_type_cd' ],
          [ Sequelize.col('stdCProd.stdProdType.prod_type_nm'), 'c_prod_type_nm' ],
          [ Sequelize.col('stdCProd.stdModel.uuid'), 'c_model_uuid' ],
          [ Sequelize.col('stdCProd.stdModel.model_cd'), 'c_model_cd' ],
          [ Sequelize.col('stdCProd.stdModel.model_nm'), 'c_model_nm' ],
          [ Sequelize.col('stdCProd.rev'), 'c_rev' ],
          [ Sequelize.col('stdCProd.prod_std'), 'c_prod_std' ],
          [ Sequelize.col('stdUnit.uuid'), 'c_unit_uuid' ],
          [ Sequelize.col('stdUnit.unit_cd'), 'c_unit_cd' ],
          [ Sequelize.col('stdUnit.unit_nm'), 'c_unit_nm' ],
          'c_usage',
          'sortby',
          [ Sequelize.col('admBomInputType.uuid'), 'bom_input_type_uuid' ],
          [ Sequelize.col('admBomInputType.bom_input_type_cd'), 'bom_input_type_cd' ],
          [ Sequelize.col('admBomInputType.bom_input_type_nm'), 'bom_input_type_nm' ],
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
        order: [ 'factory_id', 'p_prod_id', 'sortby', 'bom_id' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.repo.findOne(
        { 
          include: [
            { model: this.sequelize.models.StdFactory, attributes: [], required: true },
            { 
              as: 'stdPProd',
              model: this.sequelize.models.StdProd, 
              attributes: [], 
              required: true,
              include: [
                { model: this.sequelize.models.StdItemType, attributes: [], required: false },
                { model: this.sequelize.models.StdProdType, attributes: [], required: false },
                { model: this.sequelize.models.StdModel, attributes: [], required: false },
                { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
              ]
            },
            { 
              as: 'stdCProd',
              model: this.sequelize.models.StdProd, 
              attributes: [], 
              required: true,
              include: [
                { model: this.sequelize.models.StdItemType, attributes: [], required: false },
                { model: this.sequelize.models.StdProdType, attributes: [], required: false },
                { model: this.sequelize.models.StdModel, attributes: [], required: false },
              ]
            },
            { model: this.sequelize.models.StdUnit, attributes: [], required: true },
            { model: this.sequelize.models.AdmBomInputType, attributes: [], required: false },
            { model: this.sequelize.models.StdStore, attributes: [], required: true },
            { model: this.sequelize.models.StdLocation, attributes: [], required: false },
            { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
            { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
          ],
          attributes: [
            [ Sequelize.col('stdBom.uuid'), 'bom_uuid' ],
            [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
            [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
            [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
            [ Sequelize.col('stdPProd.uuid'), 'p_prod_uuid' ],
            [ Sequelize.col('stdPProd.prod_no'), 'p_prod_no' ],
            [ Sequelize.col('stdPProd.prod_nm'), 'p_prod_nm' ],
            [ Sequelize.col('stdPProd.stdItemType.uuid'), 'p_item_type_uuid' ],
            [ Sequelize.col('stdPProd.stdItemType.item_type_cd'), 'p_item_type_cd' ],
            [ Sequelize.col('stdPProd.stdItemType.item_type_nm'), 'p_item_type_nm' ],
            [ Sequelize.col('stdPProd.stdProdType.uuid'), 'p_prod_type_uuid' ],
            [ Sequelize.col('stdPProd.stdProdType.prod_type_cd'), 'p_prod_type_cd' ],
            [ Sequelize.col('stdPProd.stdProdType.prod_type_nm'), 'p_prod_type_nm' ],
            [ Sequelize.col('stdPProd.stdModel.uuid'), 'p_model_uuid' ],
            [ Sequelize.col('stdPProd.stdModel.model_cd'), 'p_model_cd' ],
            [ Sequelize.col('stdPProd.stdModel.model_nm'), 'p_model_nm' ],
            [ Sequelize.col('stdPProd.rev'), 'p_rev' ],
            [ Sequelize.col('stdPProd.prod_std'), 'p_prod_std' ],
            [ Sequelize.col('stdPProd.stdUnit.uuid'), 'p_unit_uuid' ],
            [ Sequelize.col('stdPProd.stdUnit.unit_cd'), 'p_unit_cd' ],
            [ Sequelize.col('stdPProd.stdUnit.unit_nm'), 'p_unit_nm' ],
            [ Sequelize.col('stdCProd.uuid'), 'c_prod_uuid' ],
            [ Sequelize.col('stdCProd.prod_no'), 'c_prod_no' ],
            [ Sequelize.col('stdCProd.prod_nm'), 'c_prod_nm' ],
            [ Sequelize.col('stdCProd.stdItemType.uuid'), 'c_item_type_uuid' ],
            [ Sequelize.col('stdCProd.stdItemType.item_type_cd'), 'c_item_type_cd' ],
            [ Sequelize.col('stdCProd.stdItemType.item_type_nm'), 'c_item_type_nm' ],
            [ Sequelize.col('stdCProd.stdProdType.uuid'), 'c_prod_type_uuid' ],
            [ Sequelize.col('stdCProd.stdProdType.prod_type_cd'), 'c_prod_type_cd' ],
            [ Sequelize.col('stdCProd.stdProdType.prod_type_nm'), 'c_prod_type_nm' ],
            [ Sequelize.col('stdCProd.stdModel.uuid'), 'c_model_uuid' ],
            [ Sequelize.col('stdCProd.stdModel.model_cd'), 'c_model_cd' ],
            [ Sequelize.col('stdCProd.stdModel.model_nm'), 'c_model_nm' ],
            [ Sequelize.col('stdCProd.rev'), 'c_rev' ],
            [ Sequelize.col('stdCProd.prod_std'), 'c_prod_std' ],
            [ Sequelize.col('stdUnit.uuid'), 'c_unit_uuid' ],
            [ Sequelize.col('stdUnit.unit_cd'), 'c_unit_cd' ],
            [ Sequelize.col('stdUnit.unit_nm'), 'c_unit_nm' ],
            'c_usage',
            'sortby',
            [ Sequelize.col('admBomInputType.uuid'), 'bom_input_type_uuid' ],
            [ Sequelize.col('admBomInputType.bom_input_type_cd'), 'bom_input_type_cd' ],
            [ Sequelize.col('admBomInputType.bom_input_type_nm'), 'bom_input_type_nm' ],
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

  // 📒 Fn[readRawByUnique]: Unique Key를 통하여 Raw Data Read Function
  public readRawByUnique = async(
    params: { factory_id: number, p_prod_id: number, c_prod_id: number }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { factory_id: params.factory_id },
          { p_prod_id: params.p_prod_id },
          { c_prod_id: params.c_prod_id }
        ]
      }
    });
    return convertReadResult(result);
  };

  public readToTrees = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readBomTrees(params.factory_uuid, params.prod_uuid));
      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

	public readToProdOfDownTrees = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readToProdOfDownTrees(params.factory_uuid, params.prod_uuid));
      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByParent]: 부모 품목기준 BOM 하위 품목 조회
  public readByParent = async(factoryId: number, parentId: number) => {
    try {
      const result = await this.repo.findAll({
        order: [ 'factory_id', 'p_prod_id', 'sortby' ],
        where: { 
          [Op.and]: [
            { factory_id: factoryId },
            { p_prod_id: parentId }
          ]
        }
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdBom[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((bom: any) => {
        return this.repo.update(
          { 
            c_usage: bom.c_usage ?? null,
            unit_id: bom.unit_id ?? null,
            sortby: bom.sortby ?? null,
            bom_input_type_id: bom.bom_input_type_id ?? null,
            from_store_id: bom.from_store_id ?? null,
            from_location_id: bom.from_location_id ?? null,
            remark: bom.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: bom.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdBom.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdBom[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((bom: any) => {
        return this.repo.update(
          {
            c_usage: bom.c_usage,
            unit_id: bom.unit_id,
            sortby: bom.sortby,
            bom_input_type_id: bom.bom_input_type_id,
            from_store_id: bom.from_store_id,
            from_location_id: bom.from_location_id,
            remark: bom.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: bom.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdBom.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdBom[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((bom: any) => {
        return this.repo.destroy({ where: { uuid: bom.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdBom.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default StdBomRepo;