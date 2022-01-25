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
import PrdWorkInput from '../../models/prd/work-input.model';
import IPrdWorkInput from '../../interfaces/prd/work-input.interface';
import { readWorkInputs } from '../../queries/prd/work-input-ongoing.query';
import { readWorkInputGroups } from '../../queries/prd/work-input-ongoing-group.query';

class PrdWorkInputRepo {
  repo: Repository<PrdWorkInput>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(PrdWorkInput);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IPrdWorkInput[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((workInput: any) => {
        return this.repo.create(
          {
            factory_id: workInput.factory_id,
            work_id: workInput.work_id,
            prod_id: workInput.prod_id,
            lot_no: workInput.lot_no,
            qty: workInput.qty,
            c_usage: workInput.c_usage,
            unit_id: workInput.unit_id,
            from_store_id: workInput.from_store_id,
            from_location_id: workInput.from_location_id,
            remark: workInput.remark,
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
            where: params.factory_uuid ? { uuid: params.factory_uuid } : {}
          },
          { 
            model: this.sequelize.models.PrdWork,
            attributes: [], 
            required: true,
            where: params.work_uuid ? { uuid: params.work_uuid } : {}
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
            ]
          },
          { model: this.sequelize.models.StdUnit, attributes: [], required: true },
          { 
            model: this.sequelize.models.StdUnitConvert,
            attributes: [], 
            required: false,
            where: Sequelize.where(Sequelize.col('stdUnitConvert.to_unit_id'), '=', Sequelize.col('stdUnit.unit_id'))
          },
          { model: this.sequelize.models.StdStore, attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdWorkInput.uuid'), 'work_input_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
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
          'lot_no',
          'qty',
          [ Sequelize.literal('prdWorkInput.c_usage * COALESCE(stdUnitConvert.convert_value, 1)'), 'c_usage' ],
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
        order: [ 'factory_id', 'work_id' ]
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
          { model: this.sequelize.models.PrdWork, attributes: [], required: true },
          {
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
          { model: this.sequelize.models.StdUnit, attributes: [], required: true },
          { 
            model: this.sequelize.models.StdUnitConvert,
            attributes: [], 
            required: false,
            where: Sequelize.where(Sequelize.col('stdUnitConvert.to_unit_id'), '=', Sequelize.col('stdUnit.unit_id'))
          },
          { model: this.sequelize.models.StdStore, attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdWorkInput.uuid'), 'work_input_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
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
          'lot_no',
          'qty',
          [ Sequelize.literal('prdWorkInput.c_usage * COALESCE(stdUnitConvert.convert_value, 1)'), 'c_usage' ],
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

  // 📒 Fn[readRawsByWorkId]: 생산실적의 Id를 이용하여 Raw Data Read Function
  public readRawsByWorkId = async(workId: number, transaction?: Transaction) => {
    const result = await this.repo.findAll({ where: { work_id: workId }, transaction });
    return convertReadResult(result);
  };

  // 📒 Fn[readOngoing]: 진행중인 생산실적의 자재 투입데이터 Read Function
  public readOngoing = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readWorkInputs(params));
      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readOngoingGroup]: 진행중인 생산실적의 자재 투입데이터 Read Function
  public readOngoingGroup = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readWorkInputGroups(params));
      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[getWorkInputIdsByWorkId]: 생산실적의 Id를 이용하여 PK Read Function
  public getWorkInputIdsByWorkId = async(workId: number, transaction?: Transaction) => {
    const result = await this.repo.findAll({
      attributes: [ 'work_input_id' ],
      where: { work_id: workId }, 
      transaction 
    });
    const converted = convertReadResult(result);
    const workInputIds: number[] = []; 
    converted.raws.forEach((raw: any) => { workInputIds.push(raw.work_input_id); });

    return workInputIds;
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IPrdWorkInput[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workInput: any) => {
        return this.repo.update(
          {
            lot_no: workInput.lot_no ?? null,
            qty: workInput.qty ?? null,
            remark: workInput.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: workInput.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdWorkInput.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IPrdWorkInput[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workInput: any) => {
        return this.repo.update(
          {
            lot_no: workInput.lot_no,
            qty: workInput.qty,
            remark: workInput.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: workInput.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdWorkInput.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IPrdWorkInput[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workInput: any) => {
        return this.repo.destroy({ where: { uuid: workInput.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.PrdWorkInput.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[deleteByWorkId]: 생산실적 Id 기준 데이터 삭제
  public deleteByWorkId = async(workId: number, uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await this.repo.findAll({ where: { work_id: workId } })

      const count = await this.repo.destroy({ where: { work_id: workId }, transaction});

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.PrdWorkInput.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[deleteByWorkIds]: 생산실적 Id 기준 데이터 삭제
  public deleteByWorkIds = async(workIds: number[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await this.repo.findAll({ where: { work_id: workIds } })

      const count = await this.repo.destroy({ where: { work_id: workIds }, transaction});

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.PrdWorkInput.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default PrdWorkInputRepo;