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
import SalOutgo from '../../models/sal/outgo.model';
import ISalOutgo from '../../interfaces/sal/outgo.interface';
import { readOutgoReport } from '../../queries/sal/outgo-report.query';
import { readLotForwardReport } from '../../queries/sal/lot-forward-tracking.query';

class SalOutgoRepo {
  repo: Repository<SalOutgo>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(SalOutgo);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: ISalOutgo[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((outgo: any) => {
        return this.repo.create(
          {
            factory_id: outgo.factory_id,
            partner_id: outgo.partner_id,
            delivery_id: outgo.delivery_id,
            stmt_no: outgo.stmt_no,
            reg_date: outgo.reg_date,
            order_id: outgo.order_id,
            outgo_order_id: outgo.outgo_order_id,
            remark: outgo.remark,
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
          { model: this.sequelize.models.StdDelivery, attributes: [], required: false },
          { model: this.sequelize.models.SalOrder, attributes: [], required: false },
          { model: this.sequelize.models.SalOutgoOrder, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('salOutgo.uuid'), 'outgo_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('stdPartner.partner_cd'), 'partner_cd' ],
          [ Sequelize.col('stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('stdDelivery.uuid'), 'delivery_uuid' ],
          [ Sequelize.col('stdDelivery.delivery_cd'), 'delivery_cd' ],
          [ Sequelize.col('stdDelivery.delivery_nm'), 'delivery_nm' ],
          'stmt_no',
          'reg_date',
          'total_price',
          'total_qty',
          [ Sequelize.col('salOrder.uuid'), 'order_uuid' ],
          [ Sequelize.col('salOrder.stmt_no'), 'order_stmt_no' ],
          [ Sequelize.col('salOrder.reg_date'), 'order_date' ],
          [ Sequelize.col('salOrder.total_price'), 'order_total_price' ],
          [ Sequelize.col('salOrder.total_qty'), 'order_total_qty' ],
          [ Sequelize.col('salOutgoOrder.uuid'), 'outgo_order_uuid' ],
          [ Sequelize.col('salOutgoOrder.reg_date'), 'outgo_order_date' ],
          [ Sequelize.col('salOutgoOrder.total_qty'), 'outgo_order_total_qty' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.fn('date', Sequelize.col('salOutgo.reg_date')), '>=', params.start_date),
            Sequelize.where(Sequelize.fn('date', Sequelize.col('salOutgo.reg_date')), '<=', params.end_date),
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
          { model: this.sequelize.models.StdDelivery, attributes: [], required: false },
          { model: this.sequelize.models.SalOrder, attributes: [], required: false },
          { model: this.sequelize.models.SalOutgoOrder, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('salOutgo.uuid'), 'outgo_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('stdPartner.partner_cd'), 'partner_cd' ],
          [ Sequelize.col('stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('stdDelivery.uuid'), 'delivery_uuid' ],
          [ Sequelize.col('stdDelivery.delivery_cd'), 'delivery_cd' ],
          [ Sequelize.col('stdDelivery.delivery_nm'), 'delivery_nm' ],
          'stmt_no',
          'reg_date',
          'total_price',
          'total_qty',
          [ Sequelize.col('salOrder.uuid'), 'order_uuid' ],
          [ Sequelize.col('salOrder.stmt_no'), 'order_stmt_no' ],
          [ Sequelize.col('salOrder.reg_date'), 'order_date' ],
          [ Sequelize.col('salOrder.total_price'), 'order_total_price' ],
          [ Sequelize.col('salOrder.total_qty'), 'order_total_qty' ],
          [ Sequelize.col('salOutgoOrder.uuid'), 'outgo_order_uuid' ],
          [ Sequelize.col('salOutgoOrder.reg_date'), 'outgo_order_date' ],
          [ Sequelize.col('salOutgoOrder.total_qty'), 'outgo_order_total_qty' ],
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

  // 📒 Fn[readReport]: Read Outgo Repot Function
  public readReport = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readOutgoReport(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  public readLotTrackingToForward = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readLotForwardReport(params));
      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: ISalOutgo[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((outgo: any) => {
        return this.repo.update(
          {
            delivery_id: outgo.delivery_id ?? null,
            stmt_no: outgo.stmt_no ?? null,
            remark: outgo.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: outgo.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.SalOutgo.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: ISalOutgo[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((outgo: any) => {
        return this.repo.update(
          {
            delivery_id: outgo.delivery_id,
            stmt_no: outgo.stmt_no,
            total_price: outgo.total_price,
            total_qty: outgo.total_qty,
            remark: outgo.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: outgo.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.SalOutgo.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: ISalOutgo[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((outgo: any) => {
        return this.repo.destroy({ where: { uuid: outgo.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.SalOutgo.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default SalOutgoRepo;