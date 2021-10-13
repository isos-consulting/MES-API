import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AutPermission from '../../models/aut/permission.model';
import IAutPermission from '../../interfaces/aut/permission.interface';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';

class AutPermissionRepo {
  repo: Repository<AutPermission>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(AutPermission);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IAutPermission[], uid: number, transaction?: Transaction) => {
    try {
      const permissions = body.map((permission) => {
        return {
          permission_nm: permission.permission_nm,
          create_fg: permission.create_fg,
          read_fg: permission.read_fg,
          update_fg: permission.update_fg,
          delete_fg: permission.delete_fg,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(permissions, { individualHooks: true, transaction });

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
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true }
        ],
        attributes: [
          [ Sequelize.col('autPermission.uuid'), 'permission_uuid' ],
          'permission_nm',
          'create_fg',
          'read_fg',
          'update_fg',
          'delete_fg',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'permission_id' ]
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
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true }
        ],
        attributes: [
          [ Sequelize.col('autPermission.uuid'), 'permission_uuid' ],
          'permission_nm',
          'create_fg',
          'read_fg',
          'update_fg',
          'delete_fg',
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
  public update = async(body: IAutPermission[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let permission of body) {
        const result = await this.repo.update(
          {
            permission_nm: permission.permission_nm  != null ? permission.permission_nm : null,
            create_fg: permission.create_fg  != null ? permission.create_fg : null,
            read_fg: permission.read_fg  != null ? permission.read_fg : null,
            update_fg: permission.update_fg  != null ? permission.update_fg : null,
            delete_fg: permission.delete_fg  != null ? permission.delete_fg : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: permission.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.AutPermission.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAutPermission[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let permission of body) {
        const result = await this.repo.update(
          {
            permission_nm: permission.permission_nm,
            create_fg: permission.create_fg,
            read_fg: permission.read_fg,
            update_fg: permission.update_fg,
            delete_fg: permission.delete_fg,
            updated_uid: uid,
          },
          { 
            where: { uuid: permission.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.AutPermission.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAutPermission[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let permission of body) {
        count += await this.repo.destroy({ where: { uuid: permission.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.AutPermission.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AutPermissionRepo;