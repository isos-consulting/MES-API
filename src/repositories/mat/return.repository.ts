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
import MatReturn from '../../models/mat/return.model';
import IMatReturn from '../../interfaces/mat/return.interface';
import { readReturnReport } from '../../queries/mat/return-report.query';

class MatReturnRepo {
  repo: Repository<MatReturn>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(MatReturn);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IMatReturn[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((returnData: any) => {
        return this.repo.create(
          {
            factory_id: returnData.factory_id,
            partner_id: returnData.partner_id,
            supplier_id: returnData.supplier_id,
            stmt_no: returnData.stmt_no,
            reg_date: returnData.reg_date,
            receive_id: returnData.receive_id,
            remark: returnData.remark,
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
            model: this.sequelize.models.StdPartner, 
            attributes: [], 
            required: true,
            where: { uuid: params.partner_uuid ? params.partner_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.StdSupplier, attributes: [], required: false },
          { model: this.sequelize.models.MatReceive, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('matReturn.uuid'), 'return_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('stdPartner.partner_cd'), 'partner_cd' ],
          [ Sequelize.col('stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('stdSupplier.uuid'), 'supplier_uuid' ],
          [ Sequelize.col('stdSupplier.supplier_cd'), 'supplier_cd' ],
          [ Sequelize.col('stdSupplier.supplier_nm'), 'supplier_nm' ],
          'stmt_no',
          'reg_date',
          'total_price',
          'total_qty',
          [ Sequelize.col('matReceive.uuid'), 'receive_uuid' ],
          [ Sequelize.col('matReceive.reg_date'), 'receive_date' ],
          [ Sequelize.col('matReceive.stmt_no'), 'receive_stmt_no' ],
          [ Sequelize.col('matReceive.total_price'), 'receive_total_price' ],
          [ Sequelize.col('matReceive.total_qty'), 'receive_total_qty' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: {
          [ Op.and ]: [
            Sequelize.where(Sequelize.fn('date', Sequelize.col('matReturn.reg_date')), '>=', params.start_date),
            Sequelize.where(Sequelize.fn('date', Sequelize.col('matReturn.reg_date')), '<=', params.end_date),
          ]
        },
        order: [ 'factory_id', 'reg_date', 'stmt_no', 'partner_id', 'supplier_id' ],
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
          { model: this.sequelize.models.StdPartner, attributes: [], required: true },
          { model: this.sequelize.models.StdSupplier, attributes: [], required: false },
          { model: this.sequelize.models.MatReceive, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('matReturn.uuid'), 'return_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('stdPartner.partner_cd'), 'partner_cd' ],
          [ Sequelize.col('stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('stdSupplier.uuid'), 'supplier_uuid' ],
          [ Sequelize.col('stdSupplier.supplier_cd'), 'supplier_cd' ],
          [ Sequelize.col('stdSupplier.supplier_nm'), 'supplier_nm' ],
          'stmt_no',
          'reg_date',
          'total_price',
          'total_qty',
          [ Sequelize.col('matReceive.uuid'), 'receive_uuid' ],
          [ Sequelize.col('matReceive.reg_date'), 'receive_date' ],
          [ Sequelize.col('matReceive.stmt_no'), 'receive_stmt_no' ],
          [ Sequelize.col('matReceive.total_price'), 'receive_total_price' ],
          [ Sequelize.col('matReceive.total_qty'), 'receive_total_qty' ],
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

  // 📒 Fn[readReport]: Read Return Repot Function
  public readReport = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readReturnReport(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IMatReturn[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((returnData: any) => {
        return this.repo.update(
          {
            supplier_id: returnData.supplier_id ?? null,
            stmt_no: returnData.stmt_no ?? null,
            remark: returnData.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: returnData.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.MatReturn.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IMatReturn[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((returnData: any) => {
        return this.repo.update(
          {
            supplier_id: returnData.supplier_id,
            stmt_no: returnData.stmt_no,
            total_price: returnData.total_price,
            total_qty: returnData.total_qty,
            remark: returnData.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: returnData.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.MatReturn.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IMatReturn[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((returnData: any) => {
        return this.repo.destroy({ where: { uuid: returnData.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.MatReturn.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default MatReturnRepo;