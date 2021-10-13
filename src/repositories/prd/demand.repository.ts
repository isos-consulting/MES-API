import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import PrdDemand from '../../models/prd/demand.model';
import IPrdDemand from '../../interfaces/prd/demand.interface';
import { readDemands } from '../../queries/prd/demand.query';

class PrdDemandRepo {
  repo: Repository<PrdDemand>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(PrdDemand);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IPrdDemand[], uid: number, transaction?: Transaction) => {
    try {
      const demand = body.map((demand) => {
        return {
          factory_id: demand.factory_id,
          order_id: demand.order_id,
          reg_date: demand.reg_date,
          demand_type_cd: demand.demand_type_cd,
          proc_id: demand.proc_id,
          equip_id: demand.equip_id,
          prod_id: demand.prod_id,
          qty: demand.qty,
          complete_fg: demand.complete_fg,
          dept_id: demand.dept_id,
          due_date: demand.due_date,
          to_store_id: demand.to_store_id,
          to_location_id: demand.to_location_id,
          remark: demand.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(demand, { individualHooks: true, transaction });

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
      const result = await sequelize.query(
        readDemands({
          complete_state: params.complete_state,
          start_date: params.start_date,
          end_date: params.end_date,
          factory_uuid: params.factory_uuid,
          order_uuid: params.order_uuid,
          to_store_uuid: params.to_store_uuid
        })
      );

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await sequelize.query(
        readDemands({ demand_uuid: params.demand_uuid })
      );

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

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IPrdDemand[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let demand of body) {
        const result = await this.repo.update(
          {
            qty: demand.qty != null ? demand.qty : null,
            due_date: demand.due_date != null ? demand.due_date : null,
            remark: demand.remark != null ? demand.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: demand.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.PrdDemand.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  // 📒 Fn[updateComplete]: Update Complete(완료여부) Function
  public updateComplete = async(body: IPrdDemand[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let demand of body) {
        const result = await this.repo.update(
          {
            complete_fg: demand.complete_fg,
            updated_uid: uid,
          },
          { 
            where: { uuid: demand.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.PrdDemand.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IPrdDemand[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let demand of body) {
        const result = await this.repo.update(
          {
            qty: demand.qty,
            complete_fg: demand.complete_fg,
            due_date: demand.due_date,
            remark: demand.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: demand.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.PrdDemand.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IPrdDemand[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let demand of body) {
        count += await this.repo.destroy({ where: { uuid: demand.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.PrdDemand.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default PrdDemandRepo;