import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AutGroupPermission from '../../models/aut/group-permission.model';
import IAutGroupPermission from '../../interfaces/aut/group-permission.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';
import AutMenuTree from '../../models/aut/menu-tree.model';

class AutGroupPermissionRepo {
  repo: Repository<AutGroupPermission>;
  menuTreeRepo: Repository<AutMenuTree>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AutGroupPermission);
    this.menuTreeRepo = this.sequelize.getRepository(AutMenuTree);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IAutGroupPermission[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((groupPermission: any) => {
        return this.repo.create(
          {
            group_id: groupPermission.group_id,
            menu_id: groupPermission.menu_id,
            permission_id: groupPermission.permission_id,
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
            model: this.sequelize.models.AutGroupPermission, 
            attributes: [], 
            required: false,
            include: [
              { 
                model: this.sequelize.models.AutGroup, 
                attributes: [], 
                required: true, 
                where: { uuid: params.group_uuid }
              },
              { model: this.sequelize.models.AutPermission, attributes: [], required: false },
              { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
              { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true }
            ]
          },
          { model: this.sequelize.models.AutMenu, as: 'firstMenu', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('autMenu.uuid'), 'menu_uuid' ],
          [ Sequelize.col('autMenu.menu_nm'), 'menu_nm' ],
          [ Sequelize.col('firstMenu.menu_nm'), 'first_menu_nm' ],
          'lv',
          'sortby',
          [ Sequelize.col('autMenu.autMenuType.uuid'), 'menu_type_uuid' ],
          [ Sequelize.col('autMenu.autMenuType.menu_type_nm'), 'menu_type_nm' ],
          [ Sequelize.col('autGroupPermission.uuid'), 'group_permission_uuid' ],
          [ Sequelize.col('autGroupPermission.autPermission.uuid'), 'permission_uuid'],
          [ Sequelize.col('autGroupPermission.autPermission.permission_nm'), 'permission_nm'],
          [ Sequelize.col('autGroupPermission.createUser.created_at'), 'created_at' ],
          [ Sequelize.col('autGroupPermission.createUser.user_nm'), 'created_nm' ],
          [ Sequelize.col('autGroupPermission.updateUser.updated_at'), 'updated_at' ],
          [ Sequelize.col('autGroupPermission.updateUser.user_nm'), 'updated_nm' ]
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
  public update = async(body: IAutGroupPermission[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((groupPermission: any) => {
        return this.repo.update(
          {
            permission_id: groupPermission.permission_id ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: groupPermission.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AutGroupPermission.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAutGroupPermission[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((groupPermission: any) => {
        return this.repo.update(
          {
            permission_id: groupPermission.permission_id,
            updated_uid: uid,
          },
          { 
            where: { uuid: groupPermission.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AutGroupPermission.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAutGroupPermission[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);
      
      const promises = body.map((groupPermission: any) => {
        return this.repo.destroy({ where: { uuid: groupPermission.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.AutGroupPermission.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AutGroupPermissionRepo;