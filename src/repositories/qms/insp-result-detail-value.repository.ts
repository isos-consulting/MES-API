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
import QmsInspResultDetailValue from '../../models/qms/insp-result-detail-value.model';
import IQmsInspResultDetailValue from '../../interfaces/qms/insp-result-detail-value.interface';

class QmsInspResultDetailValueRepo {
  repo: Repository<QmsInspResultDetailValue>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(QmsInspResultDetailValue);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IQmsInspResultDetailValue[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((inspDetailValue: any) => {
        return this.repo.create(
          {
            factory_id: inspDetailValue.factory_id,
            insp_result_id: inspDetailValue.insp_result_id,
            insp_result_detail_info_id: inspDetailValue.insp_result_detail_info_id,
            sample_no: inspDetailValue.sample_no,
            insp_result_fg: inspDetailValue.insp_result_fg,
            insp_value: inspDetailValue.insp_value,
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
          { model: this.sequelize.models.StdFactory, attributes: [], required: true },
          { 
            model: this.sequelize.models.QmsInspResultDetailInfo, 
            attributes: [], 
            required: true,
            where: { uuid: params.insp_result_detail_info_uuid }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
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
          { model: this.sequelize.models.StdFactory, attributes: [], required: true },
          { model: this.sequelize.models.QmsInspResultDetailInfo, attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
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
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((inspDetailValue: any) => {
        return this.repo.update(
          {
            insp_result_fg: inspDetailValue.insp_result_fg ?? null,
            insp_value: inspDetailValue.insp_value ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: inspDetailValue.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.QmsInspResultDetailValue.getTableName() as string, previousRaws, uid, transaction);
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
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((inspDetailValue: any) => {
        return this.repo.update(
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
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.QmsInspResultDetailValue.getTableName() as string, previousRaws, uid, transaction);
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
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((inspDetailValue: any) => {
        return this.repo.destroy({ where: { uuid: inspDetailValue.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.QmsInspResultDetailValue.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[deleteByInfoIds]: 세부성적서정보 Id 를 통하여 Delete
  public deleteByInfoIds = async(ids: number[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await this.repo.findAll({ where: { insp_result_detail_info_id: ids }, transaction});

      const count = await this.repo.destroy({ where: { insp_result_detail_info_id: ids }, transaction});

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.QmsInspResultDetailValue.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default QmsInspResultDetailValueRepo;