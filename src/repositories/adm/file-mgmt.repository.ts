import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmFileMgmt from '../../models/adm/file-mgmt.model';
import IAdmFileMgmt from '../../interfaces/adm/file-mgmt.interface';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from './log.repository';
import convertReadResult from '../../utils/convertReadResult';

class AdmFileMgmtRepo {
  repo: Repository<AdmFileMgmt>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(AdmFileMgmt);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IAdmFileMgmt[], uid: number, transaction?: Transaction) => {
    try {
      const fileMgmts = body.map((fileMgmt) => {
        return {
          file_mgmt_cd: fileMgmt.file_mgmt_cd,
          reference_id: fileMgmt.reference_id,
          reference_uuid: fileMgmt.reference_uuid,
          file_nm: fileMgmt.file_nm,
          file_extension: fileMgmt.file_extension,
          ip: fileMgmt.ip,
          remark: fileMgmt.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(fileMgmts, { individualHooks: true, transaction });

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
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('admfileMgmt.uuid'), 'file_mgmt_uuid' ],
          'file_mgmt_cd',
          'reference_uuid',
          'file_nm',
          'file_extension',
          'ip',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: {  
          [Op.and]: [
            params.file_mgmt_cd ? { file_mgmt_cd: params.file_mgmt_cd } : {},
            params.reference_uuid ? { reference_uuid: params.reference_uuid } : {},
          ]
        },
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
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('admfileMgmt.uuid'), 'file_mgmt_uuid' ],
          'file_mgmt_cd',
          'reference_uuid',
          'file_nm',
          'file_extension',
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
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let fileMgmt of body) {
        const result = await this.repo.update(
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
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.AdmFileMgmt.getTableName() as string, previousRaws, uid, transaction);
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
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let fileMgmt of body) {
        const result = await this.repo.update(
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

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.AdmFileMgmt.getTableName() as string, previousRaws, uid, transaction);
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
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let file_mgmt of body) {
        count += await this.repo.destroy({ where: { uuid: file_mgmt.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.AdmFileMgmt.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AdmFileMgmtRepo;