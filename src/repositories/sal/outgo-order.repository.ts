import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import SalOutgoOrder from '../../models/sal/outgo-order.model';
import ISalOutgoOrder from '../../interfaces/sal/outgo-order.interface';

class SalOutgoOrderRepo {
  repo: Repository<SalOutgoOrder>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(SalOutgoOrder);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: ISalOutgoOrder[], uid: number, transaction?: Transaction) => {
    try {
      const outgoOrders = body.map((outgoOrder) => {
        return {
          factory_id: outgoOrder.factory_id,
          partner_id: outgoOrder.partner_id,
          delivery_id: outgoOrder.delivery_id,
          reg_date: outgoOrder.reg_date,
          order_id: outgoOrder.order_id,
          remark: outgoOrder.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(outgoOrders, { individualHooks: true, transaction });

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
            model: this.sequelize.models.StdFactory, 
            attributes: [], 
            required: true, 
            where: { uuid: params.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.StdPartner, attributes: [], required: true },
          { model: this.sequelize.models.StdDelivery, attributes: [], required: false },
          { model: this.sequelize.models.SalOrder, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('salOutgoOrder.uuid'), 'outgo_order_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('stdPartner.partner_cd'), 'partner_cd' ],
          [ Sequelize.col('stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('stdDelivery.uuid'), 'delivery_uuid' ],
          [ Sequelize.col('stdDelivery.delivery_cd'), 'delivery_cd' ],
          [ Sequelize.col('stdDelivery.delivery_nm'), 'delivery_nm' ],
          'reg_date',
          'total_qty',
          [ Sequelize.col('salOrder.uuid'), 'order_uuid' ],
          [ Sequelize.col('salOrder.stmt_no'), 'order_stmt_no' ],
          [ Sequelize.col('salOrder.total_qty'), 'order_total_qty' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.fn('date', Sequelize.col('salOutgoOrder.reg_date')), '>=', params.start_date),
            Sequelize.where(Sequelize.fn('date', Sequelize.col('salOutgoOrder.reg_date')), '<=', params.end_date),
          ]
        },
        order: [ 'factory_id', 'reg_date', 'partner_id', 'outgo_order_id' ],
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
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('salOutgoOrder.uuid'), 'outgo_order_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('stdPartner.partner_cd'), 'partner_cd' ],
          [ Sequelize.col('stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('stdDelivery.uuid'), 'delivery_uuid' ],
          [ Sequelize.col('stdDelivery.delivery_cd'), 'delivery_cd' ],
          [ Sequelize.col('stdDelivery.delivery_nm'), 'delivery_nm' ],
          'reg_date',
          'total_qty',
          [ Sequelize.col('salOrder.uuid'), 'order_uuid' ],
          [ Sequelize.col('salOrder.stmt_no'), 'order_stmt_no' ],
          [ Sequelize.col('salOrder.total_qty'), 'order_total_qty' ],
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

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: ISalOutgoOrder[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let outgoOrder of body) {
        const result = await this.repo.update(
          {
            delivery_id: outgoOrder.delivery_id != null ? outgoOrder.delivery_id : null,
            total_qty: outgoOrder.total_qty != null ? outgoOrder.total_qty : null,
            remark: outgoOrder.remark != null ? outgoOrder.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: outgoOrder.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.SalOutgoOrder.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: ISalOutgoOrder[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let outgoOrder of body) {
        const result = await this.repo.update(
          {
            delivery_id: outgoOrder.delivery_id,
            total_qty: outgoOrder.total_qty,
            remark: outgoOrder.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: outgoOrder.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.SalOutgoOrder.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: ISalOutgoOrder[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let outgoOrder of body) {
        count += await this.repo.destroy({ where: { uuid: outgoOrder.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.SalOutgoOrder.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default SalOutgoOrderRepo;