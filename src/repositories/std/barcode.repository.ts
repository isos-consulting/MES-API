import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import { Sequelize } from "sequelize-typescript";
import { Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import ApiResult from "../../interfaces/common/api-result.interface";
import IStdBarcode from "../../interfaces/std/barcode.interface";
import StdBarcode from "../../models/std/barcode.model";
import convertReadResult from "../../utils/convertReadResult";
import { getSequelize } from "../../utils/getSequelize";
import { Op } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertResult from '../../utils/convertResult';
import _ from 'lodash';

class StdBarcodeRepo {
  repo: Repository<StdBarcode>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdBarcode);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdBarcode[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((barcode: IStdBarcode) => {
        return this.repo.create(
          {
            barcode: barcode.barcode,
            factory_id: barcode.factory_id,
            prod_id: barcode.prod_id,
            lot_no: barcode.lot_no,
            qty: barcode.qty,
            remark: barcode.remark,
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
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdBarcode.uuid'), 'barcode_uuid' ],
          'barcode',
          'lot_no',
          'qty',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'barcode_id' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async (uuid: string, params?: any) => {
    try {
      const result = await this.repo.findOne({
        include: [
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdBarcode.uuid'), 'barcode_uuid' ],
          'barcode',
          'lot_no',
          'qty',
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
  public readRawsByUuids = async (uuids: string[]) => {
    const result = await this.repo.findAll({ where: { uuid: { [Op.in]: uuids } } });
    return convertReadResult(result);
  };

  // 📒 Fn[readRawByUuid]: Id 를 포함한 Raw Data Read Function
  public readRawByUuid = async (uuid: string) => {
    const result = await this.repo.findOne({ where: { uuid } });
    return convertReadResult(result);
  };

  // 📒 Fn[readRawById]: Id 기준 Raw Data Read Function
  public readRawById = async (id: number) => {
    const result = await this.repo.findOne({ where: { barcode_id: id } });
    return convertReadResult(result);
  };

  // 📒 Fn[readRawByUnique]: Unique Key를 통하여 Raw Data Read Function
  public readRawByUnique = async (params: { barcode: string }) => {
    const result = await this.repo.findOne({ where: { barcode: params.barcode } });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async (body: IStdBarcode[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);
      
      const promises = body.map((barcode: any) => {
        return this.repo.update(
          {
            barcode: barcode.barcode ?? null,
            factory_id: barcode.factory_id ?? null,
            prod_id: barcode.prod_id ?? null,
            lot_no: barcode.lot_no ?? null,
            qty: barcode.qty ?? null,
            remark: barcode.remark ?? null,
            updated_uid: uid,
          } as any,
          {
            where: { uuid: barcode.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });

      const raws = await Promise.all(promises);
      
      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdBarcode.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };
  
  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async (body: IStdBarcode[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((barcode: any) => {
        return this.repo.update(
          {
            barcode: barcode.barcode,
            factory_id: barcode.factory_id,
            prod_id: barcode.prod_id,
            lot_no: barcode.lot_no,
            qty: barcode.qty,
            remark: barcode.remark,
            updated_uid: uid,
          } as any,
          {
            where: { uuid: barcode.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdBarcode.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async (body: IStdBarcode[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);
      
      const promises = body.map((barcode: any) => {
        return this.repo.destroy({ where: { uuid: barcode.uuid }, transaction });
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdBarcode.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default StdBarcodeRepo;