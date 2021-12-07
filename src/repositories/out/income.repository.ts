import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import OutIncome from '../../models/out/income.model';
import IOutIncome from '../../interfaces/out/income.interface';

class OutIncomeRepo {
  repo: Repository<OutIncome>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(OutIncome);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IOutIncome[], uid: number, transaction?: Transaction) => {
    try {
      const income = body.map((income) => {
        return {
          factory_id: income.factory_id,
          prod_id: income.prod_id,
          reg_date: income.reg_date,
          lot_no: income.lot_no,
          qty: income.qty,
          receive_detail_id: income.receive_detail_id,
          to_store_id: income.to_store_id,
          to_location_id: income.to_location_id,
          remark: income.remark,
          barcode: income.barcode,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(income, { individualHooks: true, transaction });

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
        // include: [
        //   { 
        //     model: this.sequelize.models.StdFactory, 
        //     attributes: [], 
        //     required: true, 
        //     where: { uuid: params.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
        //   },
        //   { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
        //   { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        // ],
        // attributes: [
        //   [ Sequelize.col('stdEquip.uuid'), 'income_uuid' ],
        //   [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
        //   [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
        //   [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
        //   'income_cd',
        //   'income_nm',
        //   'created_at',
        //   [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
        //   'updated_at',
        //   [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        // ],
        // order: [ 'factory_id', 'income_id' ],
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
        // include: [
        //   { model: this.sequelize.models.StdFactory, attributes: [], required: true },
        //   { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
        //   { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        // ],
        // attributes: [
        //   [ Sequelize.col('stdEquip.uuid'), 'income_uuid' ],
        //   [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
        //   [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
        //   [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
        //   'income_cd',
        //   'income_nm',
        //   'created_at',
        //   [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
        //   'updated_at',
        //   [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        // ],
        // where: { uuid },
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

  // 📒 Fn[readIncomeIdsToReceiveDetailUuids]: 입하 상세의 Uuid를 통하여 Id 를 포함한 Raw Data Read Function
  public readIncomeIdsToReceiveDetailUuids = async(uuids: string[]) => {
    const result = await this.repo.findAll({ 
      include: [
        { 
          model: this.sequelize.models.OutReceiveDetail, 
          attributes: [], 
          required: true,
          where: { uuid: uuids }
        },
      ],
      attributes: [ 'income_id' ],
    });

    const incomeIds = convertReadResult(result).raws.map((data: any) => {
      return data.income_id;
    })

    return incomeIds;
  };

  // 📒 Fn[readIncomeIdsToReceiveDetailIds]: 입하 상세의 Id를 통하여 Id 를 포함한 Raw Data Read Function
  public readIncomeIdsToReceiveDetailIds = async(ids: number[]) => {
    const result = await this.repo.findAll({ 
      include: [
        { 
          model: this.sequelize.models.OutReceiveDetail, 
          attributes: [], 
          required: true,
          where: { receive_detail_id: ids }
        },
      ],
      attributes: [ 'income_id' ],
    });

    const incomeIds = convertReadResult(result).raws.map((data: any) => {
      return data.income_id;
    })

    return incomeIds;
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IOutIncome[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let income of body) {
        const result = await this.repo.update(
          {
            qty: income.qty != null ? income.qty : null,
            remark: income.remark != null ? income.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: income.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.OutIncome.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  // 📒 Fn[update]: Pk(income_id)를 통하여 입고 데이터 수정
  updateToPk = async(body: IOutIncome[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let income of body) {
        const result = await this.repo.update(
          {
            qty: income.qty,
            remark: income.remark,
            updated_uid: uid,
          } as any,
          { 
            where: { income_id: income.income_id },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.OutIncome.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  }

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IOutIncome[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let income of body) {
        const result = await this.repo.update(
          {
            qty: income.qty,
            remark: income.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: income.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.OutIncome.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IOutIncome[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let income of body) {
        count += await this.repo.destroy({ where: { uuid: income.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.OutIncome.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[update]: Pk(income_id)를 통하여 입고 데이터 삭제
  deleteToPk = async(body: IOutIncome[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let income of body) {
        count += await this.repo.destroy({ where: { income_id: income.income_id }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.OutIncome.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default OutIncomeRepo;