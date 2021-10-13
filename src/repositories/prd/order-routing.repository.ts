import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import PrdOrderRouting from '../../models/prd/order-routing.model';
import IPrdOrderRouting from '../../interfaces/prd/order-routing.interface';

class PrdOrderRoutingRepo {
  repo: Repository<PrdOrderRouting>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(PrdOrderRouting);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IPrdOrderRouting[], uid: number, transaction?: Transaction) => {
    try {
      const orderRoutings = body.map((orderRouting) => {
        return {
          factory_id: orderRouting.factory_id,
          order_id: orderRouting.order_id,
          proc_id: orderRouting.proc_id,
          proc_no: orderRouting.proc_no,
          workings_id: orderRouting.workings_id,
          equip_id: orderRouting.equip_id,
          remark: orderRouting.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(orderRoutings, { individualHooks: true, transaction });

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
            where: params.factory_uuid ? { uuid: params.factory_uuid } : {}
          },
          { 
            model: sequelize.models.PrdOrder,
            attributes: [], 
            required: true,
            where: params.order_uuid ? { uuid: params.order_uuid } : {}
          },
          { model: sequelize.models.StdProc, attributes: [], required: true },
          { model: sequelize.models.StdWorkings, attributes: [], required: true },
          { model: sequelize.models.StdEquip, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdOrderRouting.uuid'), 'order_routing_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdOrder.uuid'), 'order_uuid' ],
          [ Sequelize.col('prdOrder.order_no'), 'order_no' ],
          [ Sequelize.col('stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('stdProc.proc_nm'), 'proc_nm' ],
          'proc_no',
          [ Sequelize.col('stdWorkings.uuid'), 'workings_uuid' ],
          [ Sequelize.col('stdWorkings.workings_cd'), 'workings_cd' ],
          [ Sequelize.col('stdWorkings.workings_nm'), 'workings_nm' ],
          [ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'order_id', 'proc_no' ]
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
          { model: sequelize.models.PrdOrder,attributes: [], required: true },
          { model: sequelize.models.StdProc, attributes: [], required: true },
          { model: sequelize.models.StdWorkings, attributes: [], required: true },
          { model: sequelize.models.StdEquip, attributes: [], required: false },
          { model: sequelize.models.StdUnitConvert,attributes: [], required: false },
          { model: sequelize.models.StdStore, attributes: [], required: false },
          { model: sequelize.models.StdLocation, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdOrderRouting.uuid'), 'order_routing_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdOrder.uuid'), 'order_uuid' ],
          [ Sequelize.col('prdOrder.order_no'), 'order_no' ],
          [ Sequelize.col('stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('stdProc.proc_nm'), 'proc_nm' ],
          'proc_no',
          [ Sequelize.col('stdWorkings.uuid'), 'workings_uuid' ],
          [ Sequelize.col('stdWorkings.workings_cd'), 'workings_cd' ],
          [ Sequelize.col('stdWorkings.workings_nm'), 'workings_nm' ],
          [ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
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

  // 📒 Fn[readRawsByOrderId]: 작업지시의 Id를 이용하여 Raw Data Read Function
  public readRawsByOrderId = async(orderId: string, transaction?: Transaction) => {
    const result = await this.repo.findAll({ where: { order_id: orderId }, transaction });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IPrdOrderRouting[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let orderRouting of body) {
        const result = await this.repo.update(
          {
            workings_id: orderRouting.workings_id != null ? orderRouting.workings_id : null,
            equip_id: orderRouting.equip_id != null ? orderRouting.equip_id : null,
            remark: orderRouting.remark != null ? orderRouting.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: orderRouting.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.PrdOrderRouting.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IPrdOrderRouting[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let orderRouting of body) {
        const result = await this.repo.update(
          {
            workings_id: orderRouting.workings_id,
            equip_id: orderRouting.equip_id,
            remark: orderRouting.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: orderRouting.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.PrdOrderRouting.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IPrdOrderRouting[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let orderRouting of body) {
        count += await this.repo.destroy({ where: { uuid: orderRouting.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.PrdOrderRouting.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[deleteByOrderIds]: 지시 Id 기준 라우팅 리스트 삭제
  public deleteByOrderIds = async(orderIds: number[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {
      const previousRaws = await this.repo.findAll({ where: { order_id: orderIds }});
      count += await this.repo.destroy({ where: { order_id: orderIds }, transaction});

      await new AdmLogRepo().create('delete', sequelize.models.PrdOrderRouting.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default PrdOrderRoutingRepo;