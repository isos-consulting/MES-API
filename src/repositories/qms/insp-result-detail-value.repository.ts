import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import QmsInspResultDetailValue from '../../models/qms/insp-result-detail-value.model';
import IQmsInspResultDetailValue from '../../interfaces/qms/insp-result-detail-value.interface';

class QmsInspResultDetailValueRepo {
repo: Repository<QmsInspResultDetailValue>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(QmsInspResultDetailValue);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IQmsInspResultDetailValue[], uid: number, transaction?: Transaction) => {
    try {
      const inspDetailValue = body.map((inspDetailValue) => {
        return {
          factory_id: inspDetailValue.factory_id,
          insp_result_detail_info_id: inspDetailValue.insp_result_detail_info_id,
          sample_no: inspDetailValue.sample_no,
          insp_result_fg: inspDetailValue.insp_result_fg,
          insp_value: inspDetailValue.insp_value,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(inspDetailValue, { individualHooks: true, transaction });

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
          { model: sequelize.models.StdFactory, attributes: [], required: true },
          { 
            model: sequelize.models.QmsInspResultDetailInfo, 
            attributes: [], 
            required: true,
            where: { uuid: params.insp_result_detail_info_uuid }
          },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInspResultDetailValue.uuid'), 'insp_result_detail_value_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('qmsInspResultDetailInfo.uuid'), 'insp_result_detail_info_uuid' ],
          'sample_no',
          'insp_value',
          'insp_result_fg',
          [ Sequelize.literal(`CASE WHEN qmsInspResultDetailValue.insp_result_fg = TRUE THEN '합격' ELSE '불합격' END`), 'insp_result_state' ],
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'insp_result_detail_info_id', 'sample_no' ],
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
          { model: sequelize.models.QmsInspResultDetailInfo, attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInspResultDetailValue.uuid'), 'insp_result_detail_value_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('qmsInspResultDetailInfo.uuid'), 'insp_result_detail_info_uuid' ],
          'sample_no',
          'insp_value',
          'insp_result_fg',
          [ Sequelize.literal(`CASE WHEN qmsInspResultDetailValue.insp_result_fg = TRUE THEN '합격' ELSE '불합격' END`), 'insp_result_state' ],
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
  public update = async(body: IQmsInspResultDetailValue[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let inspDetailValue of body) {
        const result = await this.repo.update(
          {
            insp_result_fg: inspDetailValue.insp_result_fg != null ? inspDetailValue.insp_result_fg : null,
            insp_value: inspDetailValue.insp_value != null ? inspDetailValue.insp_value : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: inspDetailValue.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.QmsInspResultDetailValue.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IQmsInspResultDetailValue[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let inspDetailValue of body) {
        const result = await this.repo.update(
          {
            insp_result_fg: inspDetailValue.insp_result_fg,
            insp_value: inspDetailValue.insp_value,
            updated_uid: uid,
          },
          { 
            where: { uuid: inspDetailValue.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.QmsInspResultDetailValue.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IQmsInspResultDetailValue[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let inspDetailValue of body) {
        count += await this.repo.destroy({ where: { uuid: inspDetailValue.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.QmsInspResultDetailValue.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[deleteByInfoIds]: 세부성적서정보 Id 를 통하여 Delete
  public deleteByInfoIds = async(ids: number[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await this.repo.findAll({ where: { insp_result_detail_info_id: ids }, transaction});

      count = await this.repo.destroy({ where: { insp_result_detail_info_id: ids }, transaction});

      await new AdmLogRepo().create('delete', sequelize.models.QmsInspResultDetailValue.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default QmsInspResultDetailValueRepo;