import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, Sequelize, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import MatRelease from '../../models/mat/release.model';
import IMatRelease from '../../interfaces/mat/release.interface';
import { readReleaseReport } from '../../queries/mat/release-report.query';

class MatReleaseRepo {
  repo: Repository<MatRelease>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(MatRelease);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IMatRelease[], uid: number, transaction?: Transaction) => {
    try {
      const release = body.map((release) => {
        return {
          factory_id: release.factory_id,
          prod_id: release.prod_id,
          reg_date: release.reg_date,
          lot_no: release.lot_no,
          qty: release.qty,
          demand_id: release.demand_id,
          from_store_id: release.from_store_id,
          from_location_id: release.from_location_id,
          to_store_id: release.to_store_id,
          to_location_id: release.to_location_id,
          remark: release.remark,
          barcode: release.barcode,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(release, { individualHooks: true, transaction });

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
            model: sequelize.models.PrdDemand, 
            attributes: [], 
            required: false,
            include: [
              { model: sequelize.models.AdmDemandType, attributes: [], required: false },
            ],
          },

          { model: sequelize.models.StdStore, as: 'fromStore', attributes: [], required: false },
          { model: sequelize.models.StdLocation, as: 'fromLocation', attributes: [], required: false },
          { model: sequelize.models.StdStore, as: 'toStore', attributes: [], required: true },
          { model: sequelize.models.StdLocation, as: 'toLocation', attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('matRelease.uuid'), 'release_uuid' ],
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
          'lot_no',
          'qty',
          [ Sequelize.col('prdDemand.uuid'), 'demand_uuid' ],
          [ Sequelize.col('prdDemand.demand_type_cd'), 'demand_type_cd' ],
          [ Sequelize.col('prdDemand.admDemandType.demand_type_nm'), 'demand_type_nm' ],
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
            Sequelize.where(Sequelize.fn('date', Sequelize.col('matRelease.reg_date')), '>=', params.start_date),
            Sequelize.where(Sequelize.fn('date', Sequelize.col('matRelease.reg_date')), '<=', params.end_date),
          ],
        },
        order: [ 'factory_id', 'reg_date', 'prod_id' ],
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
            model: sequelize.models.PrdDemand, 
            attributes: [], 
            required: false,
            include: [
              { model: sequelize.models.AdmDemandType, attributes: [], required: false },
            ],
          },
          { model: sequelize.models.StdStore, as: 'fromStore', attributes: [], required: false },
          { model: sequelize.models.StdLocation, as: 'fromLocation', attributes: [], required: false },
          { model: sequelize.models.StdStore, as: 'toStore', attributes: [], required: true },
          { model: sequelize.models.StdLocation, as: 'toLocation', attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('matRelease.uuid'), 'release_uuid' ],
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
          'lot_no',
          'qty',
          [ Sequelize.col('prdDemand.uuid'), 'demand_uuid' ],
          [ Sequelize.col('prdDemand.demand_type_cd'), 'demand_type_cd' ],
          [ Sequelize.col('prdDemand.admDemandType.demand_type_nm'), 'demand_type_nm' ],
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
        where: { uuid: uuid },
        order: [ 'release_id' ],
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

  // 📒 Fn[readReport]: Read Release Repot Function
  public readReport = async(params?: any) => {
    try {
      const result = await sequelize.query(readReleaseReport(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IMatRelease[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let release of body) {
        const result = await this.repo.update(
          {
            qty: release.qty != null ? release.qty : null,
            remark: release.remark != null ? release.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: release.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.MatRelease.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IMatRelease[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let release of body) {
        const result = await this.repo.update(
          {
            qty: release.qty,
            remark: release.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: release.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.MatRelease.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IMatRelease[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let release of body) {
        count += await this.repo.destroy({ where: { uuid: release.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.MatRelease.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default MatReleaseRepo;