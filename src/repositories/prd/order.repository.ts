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
import PrdOrder from '../../models/prd/order.model';
import IPrdOrder from '../../interfaces/prd/order.interface';
import { readOrders } from '../../queries/prd/order.query';
import { readMultiProcByOrder } from '../../queries/prd/multi-proc-by-order.query';

class PrdOrderRepo {
  repo: Repository<PrdOrder>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(PrdOrder);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IPrdOrder[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((order: any) => {
        return this.repo.create(
          {
            factory_id: order.factory_id,
            reg_date: order.reg_date,
            order_no: order.order_no,
            workings_id: order.workings_id,
            prod_id: order.prod_id,
            plan_qty: order.plan_qty,
            qty: order.qty,
            seq: order.seq,
            shift_id: order.shift_id,
            worker_group_id: order.worker_group_id,
            start_date: order.start_date,
            end_date: order.end_date,
            sal_order_detail_id: order.sal_order_detail_id,
						priority: order.priority,
            remark: order.remark,
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
      const result = await this.sequelize.query(readOrders(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.sequelize.query(readOrders({ order_uuid: uuid }));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[read]: 지시기준 Mulit-Process Read Report Function
  public readMultiProcByOrder = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readMultiProcByOrder(params));

      return convertReadResult(result[0]);
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

  // 📒 Fn[readRawByPk]: Id 를 포함한 Raw Data Read Function
  public readRawByPk = async(id: number) => {
    const result = await this.repo.findOne({ where: { order_id: id } });
    return convertReadResult(result);
  };

  // 📒 Fn[readWorkComparedOrder]: 지시대비실적 Read Fuction
  public readWorkComparedOrder = async(params?: any) => {
    try {
      const result = await this.sequelize.query(`
        SELECT
          AVG(COALESCE(p_w.qty, 0) / p_o.qty) AS rate
        FROM prd_order_tb p_o
        LEFT JOIN (
          SELECT p_w.order_id, sum(p_w.qty) AS qty
          FROM prd_work_tb p_w
          GROUP BY order_id
        ) p_w ON p_w.order_id = p_o.order_id
        WHERE DATE(p_o.reg_date) = '${params.reg_date}';
      `);

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IPrdOrder[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((order: any) => {
        return this.repo.update(
          {
            order_no: order.order_no ?? null,
            workings_id: order.workings_id ?? null,
            qty: order.qty ?? null,
            seq: order.seq ?? null,
            shift_id: order.shift_id ?? null,
            start_date: order.start_date ?? null,
            end_date: order.end_date ?? null,
						priority: order.priority ?? null,
            remark: order.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: order.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdOrder.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };
  
  // 📒 Fn[updateComplete]: 완료여부 및 완료일시 수정
  public updateComplete = async(body: IPrdOrder[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);
			
      const promises = body.map((order: any) => {
        return this.repo.update(
          {
            complete_fg: order.complete_fg,
            complete_date: order.complete_date,
            updated_uid: uid,
          },
          { 
            where: { uuid: order.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdOrder.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };
  
  // 📒 Fn[updateWorkFgById]: 생산진행여부 수정 Function
  public updateWorkFgById = async(id: number, workFg: boolean, uid: number, transaction?: Transaction) => {
    try {
      const previousRaw = await this.repo.findByPk(id);

      const result = await this.repo.update(
        {
          work_fg: workFg,
          updated_uid: uid,
        },
        { 
          where: { order_id: id },
          returning: true,
          individualHooks: true,
          transaction
        },
      );

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdOrder.getTableName() as string, previousRaw, uid, transaction);
      return convertResult([result]);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };
  
  // 📒 Fn[updateWorkerGroup]: 작업조 수정
  public updateWorkerGroup = async(body: IPrdOrder[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((order: any) => {
        return this.repo.update(
          {
            worker_group_id: order.worker_group_id,
            updated_uid: uid,
          },
          { 
            where: { uuid: order.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdOrder.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IPrdOrder[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((order: any) => {
        return this.repo.update(
          {
            order_no: order.order_no,
            workings_id: order.workings_id,
            qty: order.qty,
            seq: order.seq,
            shift_id: order.shift_id,
            start_date: order.start_date,
            end_date: order.end_date,
						priority: order.priority,
            remark: order.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: order.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdOrder.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IPrdOrder[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((order: any) => {
        return this.repo.destroy({ where: { uuid: order.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.PrdOrder.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default PrdOrderRepo;