import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdUnitConvert from '../../models/std/unit-convert.model';
import IStdUnitConvert from '../../interfaces/std/unit-convert.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';

class StdUnitConvertRepo {
  repo: Repository<StdUnitConvert>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdUnitConvert);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdUnitConvert[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((unitConvert: any) => {
        return this.repo.create(
          {
            from_unit_id: unitConvert.from_unit_id,
            to_unit_id: unitConvert.to_unit_id,
            from_value: unitConvert.from_value,
            to_value: unitConvert.to_value,
            convert_value: (unitConvert.to_value / unitConvert.from_value),
            prod_id: unitConvert.prod_id,
            remark: unitConvert.remark,
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
            model: this.sequelize.models.StdUnit, 
            as: 'fromUnit', 
            attributes: [], 
            required: true,
            where: params.unit_uuid ? { uuid: params.unit_uuid } : {}
          },
          { model: this.sequelize.models.StdUnit, as: 'toUnit', attributes: [], required: false },
          { 
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: false,
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
              { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ]
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdUnitConvert.uuid'), 'unit_convert_uuid' ],
          [ Sequelize.col('fromUnit.uuid'), 'from_unit_uuid' ],
          [ Sequelize.col('fromUnit.unit_cd'), 'from_unit_cd' ],
          [ Sequelize.col('fromUnit.unit_nm'), 'from_unit_nm' ],
          [ Sequelize.col('toUnit.uuid'), 'to_unit_uuid' ],
          [ Sequelize.col('toUnit.unit_cd'), 'to_unit_cd' ],
          [ Sequelize.col('toUnit.unit_nm'), 'to_unit_nm' ],
          'from_value',
          'to_value',
          'convert_value',
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
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: params.prod_uuid ? Sequelize.where(Sequelize.col('stdProd.uuid'), '=', params.prod_uuid) : {},
        order: [ 'from_unit_id', 'unit_convert_id' ],
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
          { model: this.sequelize.models.StdUnit, as: 'fromUnit', attributes: [], required: false },
          { model: this.sequelize.models.StdUnit, as: 'toUnit', attributes: [], required: false },
          { 
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: false,
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
              { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ],
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdUnitConvert.uuid'), 'unit_convert_uuid' ],
          [ Sequelize.col('fromUnit.uuid'), 'from_unit_uuid' ],
          [ Sequelize.col('fromUnit.unit_cd'), 'from_unit_cd' ],
          [ Sequelize.col('fromUnit.unit_nm'), 'from_unit_nm' ],
          [ Sequelize.col('toUnit.uuid'), 'to_unit_uuid' ],
          [ Sequelize.col('toUnit.unit_cd'), 'to_unit_cd' ],
          [ Sequelize.col('toUnit.unit_nm'), 'to_unit_nm' ],
          'from_value',
          'to_value',
          'convert_value',
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
    params: { from_unit_id: number, to_unit_id: number, prod_id: number }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { from_unit_id: params.from_unit_id },
          { to_unit_id: params.to_unit_id },
          { prod_id: params.prod_id }
        ]
      }
    });
    return convertReadResult(result);
  };

  // 📒 Fn[getConvertValueByUnitId]: From To Unit ID를 통하여 단위 변환 계수 Return
  public getConvertValueByUnitId = async(fromUnitId: number, toUnitId: number, prodId?: number) => {
    const result = await this.repo.findAll({ 
      where: {
        [Op.and]: [
          { from_unit_id: fromUnitId },
          { to_unit_id: toUnitId },
        ] 
      } 
    });

    if (!result || result.length == 0) { return null; }
    let prodIndex = -1;
    let nullIndex = -1;
    for (let index = 0; index < result.length; index++) {
      if (result[index].prod_id == prodId) { prodIndex = index; }
      if (!result[index].prod_id) { nullIndex = index; }
    }

    if (prodIndex >= 0 ) { return result[prodIndex].convert_value; }
    if (nullIndex >= 0 ) { return result[nullIndex].convert_value; }

    return null;
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdUnitConvert[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((unitConvert: any) => {
        return this.repo.update(
          {
            from_value: unitConvert.from_value ?? null,
            to_value: unitConvert.to_value ?? null,
            convert_value: (unitConvert.to_value / unitConvert.from_value) ?? null,
            remark: unitConvert.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: unitConvert.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdUnitConvert.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdUnitConvert[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((unitConvert: any) => {
        return this.repo.update(
          {
            from_value: unitConvert.from_value,
            to_value: unitConvert.to_value,
            convert_value: (unitConvert.to_value / unitConvert.from_value),
            remark: unitConvert.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: unitConvert.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdUnitConvert.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdUnitConvert[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((unitConvert: any) => {
        return this.repo.destroy({ where: { uuid: unitConvert.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdUnitConvert.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
  
  //#endregion

  //#endregion
}

export default StdUnitConvertRepo;