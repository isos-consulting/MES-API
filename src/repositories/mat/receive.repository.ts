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
import MatReceive from '../../models/mat/receive.model';
import IMatReceive from '../../interfaces/mat/receive.interface';
import { readReceiveReport } from '../../queries/mat/receive-report.query';
import { readLotReverseReport } from '../../queries/mat/lot-reverse-tracking.query';

class MatReceiveRepo {
  repo: Repository<MatReceive>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(MatReceive);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IMatReceive[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((receive: any) => {
        return this.repo.create(
          {
            factory_id: receive.factory_id,
            partner_id: receive.partner_id,
            supplier_id: receive.supplier_id,
            stmt_no: receive.stmt_no,
            reg_date: receive.reg_date,
            order_id: receive.order_id,
            remark: receive.remark,
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
          { model: this.sequelize.models.StdPartner, attributes: [], required: true },
          { model: this.sequelize.models.StdSupplier, attributes: [], required: false },
          { model: this.sequelize.models.MatOrder, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('matReceive.uuid'), 'receive_uuid' ],
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
          [ Sequelize.col('matOrder.stmt_no'), 'order_stmt_no' ],
          [ Sequelize.col('matOrder.reg_date'), 'order_date' ],
          [ Sequelize.col('matOrder.total_price'), 'order_total_price' ],
          [ Sequelize.col('matOrder.total_qty'), 'order_total_qty' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.fn('date', Sequelize.col('matReceive.reg_date')), '>=', params.start_date),
            Sequelize.where(Sequelize.fn('date', Sequelize.col('matReceive.reg_date')), '<=', params.end_date),
          ]
        },
        order: [ 'factory_id', 'reg_date', 'stmt_no', 'partner_id', 'order_id' ],
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
          { model: this.sequelize.models.MatOrder, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('matReceive.uuid'), 'receive_uuid' ],
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
          [ Sequelize.col('matOrder.stmt_no'), 'order_stmt_no' ],
          [ Sequelize.col('matOrder.reg_date'), 'order_date' ],
          [ Sequelize.col('matOrder.total_price'), 'order_total_price' ],
          [ Sequelize.col('matOrder.total_qty'), 'order_total_qty' ],
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

  // 📒 Fn[readReport]: Read Receive Repot Function
  public readReport = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readReceiveReport(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

// 📒 Fn[readLotTrackingToReverse]: 입하기준 lot 추적
  public readLotTrackingToReverse = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readLotReverseReport(params));
      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };


  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IMatReceive[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((receive: any) => {
        return this.repo.update(
          {
            supplier_id: receive.supplier_id ?? null,
            stmt_no: receive.stmt_no ?? null,
            remark: receive.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: receive.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.MatReceive.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IMatReceive[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((receive: any) => {
        return this.repo.update(
          {
            supplier_id: receive.supplier_id,
            stmt_no: receive.stmt_no,
            total_price: receive.total_price,
            total_qty: receive.total_qty,
            remark: receive.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: receive.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.MatReceive.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IMatReceive[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((receive: any) => {
        return this.repo.destroy({ where: { uuid: receive.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.MatReceive.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default MatReceiveRepo;