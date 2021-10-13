import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import SalReturn from '../../models/sal/return.model';
import ISalReturn from '../../interfaces/sal/return.interface';
import { readReturnReport } from '../../queries/sal/return-report.query';

class SalReturnRepo {
  repo: Repository<SalReturn>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(SalReturn);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: ISalReturn[], uid: number, transaction?: Transaction) => {
    try {
      const returnData = body.map((returnData) => {
        return {
          factory_id: returnData.factory_id,
          partner_id: returnData.partner_id,
          delivery_id: returnData.delivery_id,
          stmt_no: returnData.stmt_no,
          reg_date: returnData.reg_date,
          outgo_id: returnData.outgo_id,
          remark: returnData.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(returnData, { individualHooks: true, transaction });

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
            model: sequelize.models.StdPartner, 
            attributes: [], 
            required: true,
            where: { uuid: params.partner_uuid ? params.partner_uuid : { [Op.ne]: null } }
          },
          { model: sequelize.models.StdDelivery, attributes: [], required: false },
          { model: sequelize.models.SalOutgo, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('salReturn.uuid'), 'return_uuid' ],
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
          [ Sequelize.col('salOutgo.uuid'), 'outgo_uuid' ],
          [ Sequelize.col('salOutgo.reg_date'), 'outgo_date' ],
          [ Sequelize.col('salOutgo.stmt_no'), 'outgo_stmt_no' ],
          [ Sequelize.col('salOutgo.total_price'), 'outgo_total_price' ],
          [ Sequelize.col('salOutgo.total_qty'), 'outgo_total_qty' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: {
          [ Op.and ]: [
            Sequelize.where(Sequelize.fn('date', Sequelize.col('salReturn.reg_date')), '>=', params.start_date),
            Sequelize.where(Sequelize.fn('date', Sequelize.col('salReturn.reg_date')), '<=', params.end_date),
          ]
        },
        order: [ 'factory_id', 'reg_date', 'stmt_no', 'partner_id', 'delivery_id' ],
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
          { model: sequelize.models.StdPartner, attributes: [], required: true },
          { model: sequelize.models.StdDelivery, attributes: [], required: false },
          { model: sequelize.models.SalOutgo, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('salReturn.uuid'), 'return_uuid' ],
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
          [ Sequelize.col('salOutgo.uuid'), 'outgo_uuid' ],
          [ Sequelize.col('salOutgo.reg_date'), 'outgo_date' ],
          [ Sequelize.col('salOutgo.stmt_no'), 'outgo_stmt_no' ],
          [ Sequelize.col('salOutgo.total_price'), 'outgo_total_price' ],
          [ Sequelize.col('salOutgo.total_qty'), 'outgo_total_qty' ],
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
      const result = await sequelize.query(readReturnReport(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: ISalReturn[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let returnData of body) {
        const result = await this.repo.update(
          {
            delivery_id: returnData.delivery_id != null ? returnData.delivery_id : null,
            stmt_no: returnData.stmt_no != null ? returnData.stmt_no : null,
            remark: returnData.remark != null ? returnData.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: returnData.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.SalReturn.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: ISalReturn[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let returnData of body) {
        const result = await this.repo.update(
          {
            delivery_id: returnData.delivery_id,
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

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.SalReturn.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: ISalReturn[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let returnData of body) {
        count += await this.repo.destroy({ where: { uuid: returnData.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.SalReturn.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default SalReturnRepo;