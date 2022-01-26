import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmFileMgmt from '../../models/adm/file-mgmt.model';
import IAdmFileMgmt from '../../interfaces/adm/file-mgmt.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from './log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';

class AdmFileMgmtRepo {
  repo: Repository<AdmFileMgmt>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmFileMgmt);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IAdmFileMgmt[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((fileMgmt: any) => {
        return this.repo.create(
          {
            file_mgmt_detail_type_id: fileMgmt.file_mgmt_detail_type_id,
            reference_uuid: fileMgmt.reference_uuid,
            file_nm: fileMgmt.file_nm,
            file_extension: fileMgmt.file_extension,
            file_size: fileMgmt.file_size,
            ip: fileMgmt.ip,
            remark: fileMgmt.remark,
            uuid: fileMgmt.uuid,
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
            model: this.sequelize.models.AdmFileMgmtDetailType, 
            attributes: [], 
            required: true,
            include: [
              { 
                model: this.sequelize.models.AdmFileMgmtType, 
                attributes: [], 
                required: true,
                where: {
                  [Op.and]: [
                    { uuid: params.file_mgmt_type_uuid ?? { [Op.ne]: null } },
                    { file_mgmt_type_cd: params.file_mgmt_type_cd ?? { [Op.ne]: null } },
                  ]
                } 
              }
            ],
            where: {
              [Op.and]: [
                { uuid: params.file_mgmt_detail_type_uuid ?? { [Op.ne]: null } },
                { file_mgmt_detail_type_cd: params.file_mgmt_detail_type_cd ?? { [Op.ne]: null } }
              ]
            } 
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('admfileMgmt.uuid'), 'file_mgmt_uuid' ],
          [ Sequelize.col('admFileMgmtDetailType.admFileMgmtType.uuid'), 'file_mgmt_type_uuid' ],
          [ Sequelize.col('admFileMgmtDetailType.admFileMgmtType.file_mgmt_type_cd'), 'file_mgmt_type_cd' ],
          [ Sequelize.col('admFileMgmtDetailType.admFileMgmtType.file_mgmt_type_nm'), 'file_mgmt_type_nm' ],
          [ Sequelize.col('admFileMgmtDetailType.uuid'), 'file_mgmt_detail_type_uuid' ],
          [ Sequelize.col('admFileMgmtDetailType.file_mgmt_detail_type_cd'), 'file_mgmt_detail_type_cd' ],
          [ Sequelize.col('admFileMgmtDetailType.file_mgmt_detail_type_nm'), 'file_mgmt_detail_type_nm' ],
          'reference_uuid',
          'file_nm',
          'file_extension',
          'file_size',
          'ip',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { reference_uuid: params.reference_uuid ?? { [Op.ne]: null } },
        order: [ 'reference_uuid', 'created_at' ],
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
          { 
            model: this.sequelize.models.AdmFileMgmtDetailType, 
            attributes: [], 
            required: true,
            include: [{ model: this.sequelize.models.AdmFileMgmtType, attributes: [], required: true }],
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('admfileMgmt.uuid'), 'file_mgmt_uuid' ],
          [ Sequelize.col('admFileMgmtDetailType.admFileMgmtType.uuid'), 'file_mgmt_type_uuid' ],
          [ Sequelize.col('admFileMgmtDetailType.admFileMgmtType.file_mgmt_type_cd'), 'file_mgmt_type_cd' ],
          [ Sequelize.col('admFileMgmtDetailType.admFileMgmtType.file_mgmt_type_nm'), 'file_mgmt_type_nm' ],
          [ Sequelize.col('admFileMgmtDetailType.uuid'), 'file_mgmt_detail_type_uuid' ],
          [ Sequelize.col('admFileMgmtDetailType.file_mgmt_detail_type_cd'), 'file_mgmt_detail_type_cd' ],
          [ Sequelize.col('admFileMgmtDetailType.file_mgmt_detail_type_nm'), 'file_mgmt_detail_type_nm' ],
          'reference_uuid',
          'file_nm',
          'file_extension',
          'file_size',
          'ip',
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

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IAdmFileMgmt[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((fileMgmt: any) => {
        return this.repo.update(
          {
            file_nm: fileMgmt.file_nm ?? null,
            file_extension: fileMgmt.file_extension ?? null,
            ip: fileMgmt.ip ?? null,
            remark: fileMgmt.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: fileMgmt.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmFileMgmt.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAdmFileMgmt[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((fileMgmt: any) => {
        return this.repo.update(
          {
            file_nm: fileMgmt.file_nm,
            file_extension: fileMgmt.file_extension,
            ip: fileMgmt.ip,
            remark: fileMgmt.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: fileMgmt.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmFileMgmt.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAdmFileMgmt[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((fileMgmt: any) => {
        return this.repo.destroy({ where: { uuid: fileMgmt.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.AdmFileMgmt.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[deleteByReferenceUuids]: 파일관련 Table의 Row에 해당하는 File 데이터 삭제
  deleteByReferenceUuids = async(uuids: string[], uid: number, transaction?: Transaction) => {
    try {      
      let count: number = 0;
      let previousRaws: any[] = [];

      for await (let uuid of uuids) {
        const find = await this.repo.findAll({ where: { reference_uuid: uuid }})
        previousRaws = [...previousRaws, ...find];

        count += await this.repo.destroy({ 
          where: { reference_uuid: uuid }, 
          transaction
        });
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.AdmFileMgmt.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AdmFileMgmtRepo;