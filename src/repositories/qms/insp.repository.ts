import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import QmsInsp from '../../models/qms/insp.model';
import IQmsInsp from '../../interfaces/qms/insp.interface';

class QmsInspRepo {
repo: Repository<QmsInsp>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(QmsInsp);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IQmsInsp[], uid: number, transaction?: Transaction) => {
    try {
      const insp = body.map((insp) => {
        return {
          factory_id: insp.factory_id,
          insp_type_cd: insp.insp_type_cd,
          insp_no: insp.insp_no,
          prod_id: insp.prod_id,
          reg_date: insp.reg_date,
          apply_fg: insp.apply_fg,
          apply_date: insp.apply_date,
          contents: insp.contents,
          remark: insp.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(insp, { individualHooks: true, transaction });

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
          { model: sequelize.models.AdmInspType, attributes: [], required: true },
          { 
            model: sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: sequelize.models.StdItemType, attributes: [], required: false },
              { model: sequelize.models.StdProdType, attributes: [], required: false },
              { model: sequelize.models.StdModel, attributes: [], required: false },
              { model: sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ],
            where: { uuid: params.prod_uuid ? params.prod_uuid : { [Op.ne]: null } }
          },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInsp.uuid'), 'insp_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'insp_type_cd',
          [ Sequelize.col('admInspType.insp_type_nm'), 'insp_type_nm' ],
          'insp_no',
          [ Sequelize.col('stdProd.uuid'), 'prod_uuid' ],
          [ Sequelize.col('stdProd.prod_no'), 'prod_no' ],
          [ Sequelize.col('stdProd.prod_nm'), 'prod_nm' ],
          [ Sequelize.col('stdProd.stdItemType.uuid'), 'item_type_uuid' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_cd'), 'item_type_cd' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_nm'), 'item_type_nm' ],
          [ Sequelize.col('stdProd.stdProdType.uuid'), 'prod_type_uuid' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_cd'), 'prod_type_cd' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_nm'), 'prod_type_nm' ],
          [ Sequelize.col('stdProd.stdModel.uuid'), 'model_uuid' ],
          [ Sequelize.col('stdProd.stdModel.model_cd'), 'model_cd' ],
          [ Sequelize.col('stdProd.stdModel.model_nm'), 'model_nm' ],
          [ Sequelize.col('stdProd.rev'), 'rev' ],
          [ Sequelize.col('stdProd.prod_std'), 'prod_std' ],
          [ Sequelize.col('stdProd.stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('stdProd.stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('stdProd.stdUnit.unit_nm'), 'unit_nm' ],
          'reg_date',
          'apply_date',
          'apply_fg',
          [ Sequelize.literal(`CASE WHEN qmsInsp.apply_fg = TRUE THEN '적용' ELSE '미적용' END `), 'apply_state' ],
          'contents',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: {
          [Op.and]: [
            { insp_type_cd: params.insp_type_cd ? params.insp_type_cd : { [Op.ne]: null } },
            { apply_fg: params.apply_fg != null ? params.apply_fg : { [Op.ne]: null } }
          ]
        },
        order: [ 'factory_id', 'prod_id', ['apply_fg', 'desc'], 'insp_id' ],
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
          { model: sequelize.models.AdmInspType, attributes: [], required: true },
          { 
            model: sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: sequelize.models.StdItemType, attributes: [], required: false },
              { model: sequelize.models.StdProdType, attributes: [], required: false },
              { model: sequelize.models.StdModel, attributes: [], required: false },
              { model: sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ],
          },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInsp.uuid'), 'insp_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'insp_type_cd',
          [ Sequelize.col('admInspType.insp_type_nm'), 'insp_type_nm' ],
          'insp_no',
          [ Sequelize.col('stdProd.uuid'), 'prod_uuid' ],
          [ Sequelize.col('stdProd.prod_no'), 'prod_no' ],
          [ Sequelize.col('stdProd.prod_nm'), 'prod_nm' ],
          [ Sequelize.col('stdProd.stdItemType.uuid'), 'item_type_uuid' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_cd'), 'item_type_cd' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_nm'), 'item_type_nm' ],
          [ Sequelize.col('stdProd.stdProdType.uuid'), 'prod_type_uuid' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_cd'), 'prod_type_cd' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_nm'), 'prod_type_nm' ],
          [ Sequelize.col('stdProd.stdModel.uuid'), 'model_uuid' ],
          [ Sequelize.col('stdProd.stdModel.model_cd'), 'model_cd' ],
          [ Sequelize.col('stdProd.stdModel.model_nm'), 'model_nm' ],
          [ Sequelize.col('stdProd.rev'), 'rev' ],
          [ Sequelize.col('stdProd.prod_std'), 'prod_std' ],
          [ Sequelize.col('stdProd.stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('stdProd.stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('stdProd.stdUnit.unit_nm'), 'unit_nm' ],
          'reg_date',
          'apply_date',
          'apply_fg',
          [ Sequelize.literal(`CASE WHEN qmsInsp.apply_fg = TRUE THEN '적용' ELSE '미적용' END `), 'apply_state' ],
          'contents',
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
  public update = async(body: IQmsInsp[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp of body) {
        const result = await this.repo.update(
          {
            insp_no: insp.insp_no != null ? insp.insp_no : null,
            contents: insp.contents != null ? insp.contents : null,
            apply_fg: insp.apply_fg != null ? insp.apply_fg : null,
            apply_date: insp.apply_date != null ? insp.apply_date : null,
            remark: insp.remark != null ? insp.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: insp.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.QmsInsp.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  // 📒 Fn[updateApply]: Default Patch Function
  public updateApply = async(body: IQmsInsp[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp of body) {
        const result = await this.repo.update(
          {
            apply_date: insp.apply_date,
            apply_fg: insp.apply_fg,
            updated_uid: uid,
          },
          { 
            where: { uuid: insp.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.QmsInsp.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IQmsInsp[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp of body) {
        const result = await this.repo.update(
          {
            insp_no: insp.insp_no,
            apply_date: insp.apply_date,
            apply_fg: insp.apply_fg,
            contents: insp.contents,
            remark: insp.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: insp.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.QmsInsp.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IQmsInsp[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp of body) {
        count += await this.repo.destroy({ where: { uuid: insp.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.QmsInsp.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default QmsInspRepo;