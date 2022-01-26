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
import QmsReworkDisassemble from '../../models/qms/rework-disassemble.model';
import IQmsReworkDisassemble from '../../interfaces/qms/rework-disassemble.interface';

class QmsReworkDisassembleRepo {
  repo: Repository<QmsReworkDisassemble>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(QmsReworkDisassemble);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IQmsReworkDisassemble[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((reworkDisassemble: any) => {
        return this.repo.create(
          {
            factory_id: reworkDisassemble.factory_id,
            rework_id: reworkDisassemble.rework_id,
            prod_id: reworkDisassemble.prod_id,
            lot_no: reworkDisassemble.lot_no,
            income_qty: reworkDisassemble.income_qty,
            return_qty: reworkDisassemble.return_qty,
            disposal_qty: reworkDisassemble.disposal_qty,
            income_store_id: reworkDisassemble.income_store_id,
            income_location_id: reworkDisassemble.income_location_id,
            return_store_id: reworkDisassemble.return_store_id,
            return_location_id: reworkDisassemble.return_location_id,
            remark: reworkDisassemble.remark,
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
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
              { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ],
            where: { uuid: params.prod_uuid ? params.prod_uuid : { [Op.ne]: null } }
          },
          { 
            model: this.sequelize.models.QmsRework, 
            attributes: [], 
            required: true,
            where: { uuid: params.rework_uuid ? params.rework_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.StdStore, as: 'incomeStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'incomeLocation', attributes: [], required: false },
          { model: this.sequelize.models.StdStore, as: 'returnStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'returnLocation', attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsReworkDisassemble.uuid'), 'rework_disassemble_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('qmsRework.uuid'), 'rework_uuid' ],
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
          'income_qty',
          'return_qty',
          'disposal_qty',
          [ Sequelize.col('incomeStore.uuid'), 'income_store_uuid' ],
          [ Sequelize.col('incomeStore.store_cd'), 'income_store_cd' ],
          [ Sequelize.col('incomeStore.store_nm'), 'income_store_nm' ],
          [ Sequelize.col('incomeLocation.uuid'), 'income_location_uuid' ],
          [ Sequelize.col('incomeLocation.location_cd'), 'income_location_cd' ],
          [ Sequelize.col('incomeLocation.location_nm'), 'income_location_nm' ],
          [ Sequelize.col('returnStore.uuid'), 'return_store_uuid' ],
          [ Sequelize.col('returnStore.store_cd'), 'return_store_cd' ],
          [ Sequelize.col('returnStore.store_nm'), 'return_store_nm' ],
          [ Sequelize.col('returnLocation.uuid'), 'return_location_uuid' ],
          [ Sequelize.col('returnLocation.location_cd'), 'return_location_cd' ],
          [ Sequelize.col('returnLocation.location_nm'), 'return_location_nm' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'prod_id' ],
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
          { model: this.sequelize.models.QmsRework, attributes: [], required: true },
          { model: this.sequelize.models.StdStore, as: 'incomeStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'incomeLocation', attributes: [], required: false },
          { model: this.sequelize.models.StdStore, as: 'returnStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'returnLocation', attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsReworkDisassemble.uuid'), 'rework_disassemble_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('qmsRework.uuid'), 'rework_uuid' ],
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
          'income_qty',
          'return_qty',
          'disposal_qty',
          [ Sequelize.col('incomeStore.uuid'), 'income_store_uuid' ],
          [ Sequelize.col('incomeStore.store_cd'), 'income_store_cd' ],
          [ Sequelize.col('incomeStore.store_nm'), 'income_store_nm' ],
          [ Sequelize.col('incomeLocation.uuid'), 'income_location_uuid' ],
          [ Sequelize.col('incomeLocation.location_cd'), 'income_location_cd' ],
          [ Sequelize.col('incomeLocation.location_nm'), 'income_location_nm' ],
          [ Sequelize.col('returnStore.uuid'), 'return_store_uuid' ],
          [ Sequelize.col('returnStore.store_cd'), 'return_store_cd' ],
          [ Sequelize.col('returnStore.store_nm'), 'return_store_nm' ],
          [ Sequelize.col('returnLocation.uuid'), 'return_location_uuid' ],
          [ Sequelize.col('returnLocation.location_cd'), 'return_location_cd' ],
          [ Sequelize.col('returnLocation.location_nm'), 'return_location_nm' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { uuid: uuid }
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

  // 📒 Fn[readRawsByReworkUuid]: rework_id로 Id 를 포함한 Raw Datas Read Function
  public readRawsByReworkIds = async(reworkIds: string[]) => {
    const result = await this.repo.findAll({ where: { rework_id: { [Op.in]: reworkIds } } });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IQmsReworkDisassemble[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((reworkDisassemble: any) => {
        return this.repo.update(
          {
            remark: reworkDisassemble.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: reworkDisassemble.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.QmsReworkDisassemble.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IQmsReworkDisassemble[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((reworkDisassemble: any) => {
        return this.repo.update(
          {
            remark: reworkDisassemble.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: reworkDisassemble.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.QmsReworkDisassemble.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IQmsReworkDisassemble[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((reworkDisassemble: any) => {
        return this.repo.destroy({ where: { uuid: reworkDisassemble.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.QmsReworkDisassemble.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[delete]: Default Delete Function
  public deleteByReworkId = async(body: IQmsReworkDisassemble[], uid: number, reworkIds: string[], transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);
      
      const promises = body.map((reworkId: any) => {
        return this.repo.destroy({ where: { rework_id: reworkId }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.QmsReworkDisassemble.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default QmsReworkDisassembleRepo;