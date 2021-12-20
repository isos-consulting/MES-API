import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AutUserPermission from '../../models/aut/user-permission.model';
import IAutUserPermission from '../../interfaces/aut/user-permission.interface';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import AutMenuTree from '../../models/aut/menu-tree.model';

class AutUserPermissionRepo {
  repo: Repository<AutUserPermission>;
  menuTreeRepo: Repository<AutMenuTree>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AutUserPermission);
    this.menuTreeRepo = this.sequelize.getRepository(AutMenuTree);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IAutUserPermission[], uid: number, transaction?: Transaction) => {
    try {
      const userPermissions = body.map((userPermission) => {
        return {
          uid: userPermission.uid,
          menu_id: userPermission.menu_id,
          permission_id: userPermission.permission_id,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(userPermissions, { individualHooks: true, transaction });

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
      const result = await this.menuTreeRepo.findAll({ 
        include: [
          { 
            model: this.sequelize.models.AutMenu, 
            as: 'autMenu', 
            attributes: [], 
            required: true,
            include: [{ model: this.sequelize.models.AutMenuType, attributes: [], required: false }]
          },
          { 
            model: this.sequelize.models.AutUserPermission, 
            attributes: [], 
            required: false,
            include: [
              { 
                model: this.sequelize.models.AutUser, 
                as: 'autUser',
                attributes: [], 
                required: true,
                where: { uuid: params.user_uuid }
              },
              { model: this.sequelize.models.AutPermission, attributes: [], required: false },
              { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
              { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true }
            ]
          },
          { 
            model: this.sequelize.models.AutGroupPermission, 
            attributes: [], 
            required: false,
            include: [{ model: this.sequelize.models.AutPermission, attributes: [], required: false }],
            where: Sequelize.where(Sequelize.col('autGroupPermission.group_id'), '=', Sequelize.col('autUserPermission.autUser.group_id'))
          },
          { model: this.sequelize.models.AutMenu, as: 'firstMenu', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('autMenu.uuid'), 'menu_uuid' ],
          [ Sequelize.col('autMenu.menu_nm'), 'menu_nm' ],
          [ Sequelize.col('firstMenu.menu_nm'), 'first_menu_nm' ],
          'sortby',
          [ Sequelize.col('autMenu.autMenuType.uuid'), 'menu_type_uuid' ],
          [ Sequelize.col('autMenu.autMenuType.menu_type_nm'), 'menu_type_nm' ],
          [ Sequelize.col('autUserPermission.uuid'), 'user_permission_uuid' ],
          [ Sequelize.fn('COALESCE', Sequelize.col('autUserPermission.autPermission.uuid'), Sequelize.col('autGroupPermission.autPermission.uuid')), 'permission_uuid'],
          [ Sequelize.fn('COALESCE', Sequelize.col('autUserPermission.autPermission.permission_nm'), Sequelize.col('autGroupPermission.autPermission.permission_nm')), 'permission_nm'],
          [ Sequelize.col('autUserPermission.createUser.created_at'), 'created_at' ],
          [ Sequelize.col('autUserPermission.createUser.user_nm'), 'created_nm' ],
          [ Sequelize.col('autUserPermission.updateUser.updated_at'), 'updated_at' ],
          [ Sequelize.col('autUserPermission.updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'sortby' ]
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
  public update = async(body: IAutUserPermission[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let userPermission of body) {
        const result = await this.repo.update(
          {
            permission_id: userPermission.permission_id != null ? userPermission.permission_id : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: userPermission.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AutUserPermission.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAutUserPermission[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let userPermission of body) {
        const result = await this.repo.update(
          {
            permission_id: userPermission.permission_id,
            updated_uid: uid,
          },
          { 
            where: { uuid: userPermission.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AutUserPermission.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAutUserPermission[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let userPermission of body) {
        count += await this.repo.destroy({ where: { uuid: userPermission.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.AutUserPermission.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AutUserPermissionRepo;