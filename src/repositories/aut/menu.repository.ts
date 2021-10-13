import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AutMenu from '../../models/aut/menu.model';
import IAutMenu from '../../interfaces/aut/menu.interface';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import AutMenuTree from '../../models/aut/menu-tree.model';
import { readMenuWithPermission } from '../../queries/aut/menu-with-permission.query';

class AutMenuRepo {
  repo: Repository<AutMenu>;
  menuTreeRepo: Repository<AutMenuTree>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(AutMenu);
    this.menuTreeRepo = sequelize.getRepository(AutMenuTree);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IAutMenu[], uid: number, transaction?: Transaction) => {
    try {
      const menus = body.map((menu) => {
        return {
          menu_type_id: menu.menu_type_id,
          menu_nm: menu.menu_nm,
          menu_uri: menu.menu_uri,
          component_nm: menu.component_nm,
          icon: menu.icon,
          parent_id: menu.parent_id,
          sortby: menu.sortby,
          use_fg: menu.use_fg,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(menus, { individualHooks: true, transaction });

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
          { model: sequelize.models.AutMenuType, attributes: [], required: false },
          { 
            model: sequelize.models.AutMenu, 
            attributes: [], 
            required: true,
            as: 'autMenu',
            include: [
              { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
              { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true }
            ],
            where: params.use_fg != null ? { use_fg: params.use_fg } : {}
          }
        ],
        attributes: [
          [ Sequelize.col('autMenu.uuid'), 'menu_uuid' ],
          [ Sequelize.col('autMenu.menu_nm'), 'menu_nm' ],
          [ Sequelize.col('autMenuType.uuid'), 'menu_type_uuid' ],
          [ Sequelize.col('autMenuType.menu_type_nm'), 'menu_type_nm' ],
          [ Sequelize.col('autMenu.menu_uri'), 'menu_uri' ],
          [ Sequelize.col('autMenu.component_nm'), 'component_nm' ],
          [ Sequelize.col('autMenu.icon'), 'icon' ],
          [ Sequelize.col('autMenu.use_fg'), 'use_fg' ],
          'lv',
          'sortby',
          [ Sequelize.col('autMenu.createUser.created_at'), 'created_at' ],
          [ Sequelize.col('autMenu.createUser.user_nm'), 'created_nm' ],
          [ Sequelize.col('autMenu.updateUser.updated_at'), 'updated_at' ],
          [ Sequelize.col('autMenu.updateUser.user_nm'), 'updated_nm' ]
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
      const result = await this.menuTreeRepo.findOne({ 
        include: [
          { model: sequelize.models.AutMenuType, attributes: [], required: false },
          { 
            model: sequelize.models.AutMenu, 
            attributes: [], 
            required: true,
            as: 'autMenu',
            include: [
              { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
              { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true }
            ],
            where: { uuid }
          }
        ],
        attributes: [
          [ Sequelize.col('autMenu.uuid'), 'menu_uuid' ],
          [ Sequelize.col('autMenu.menu_nm'), 'menu_nm' ],
          [ Sequelize.col('autMenuType.uuid'), 'menu_type_uuid' ],
          [ Sequelize.col('autMenuType.menu_type_nm'), 'menu_type_nm' ],
          [ Sequelize.col('autMenu.menu_uri'), 'menu_uri' ],
          [ Sequelize.col('autMenu.component_nm'), 'component_nm' ],
          [ Sequelize.col('autMenu.icon'), 'icon' ],
          [ Sequelize.col('autMenu.use_fg'), 'use_fg' ],
          'lv',
          'sortby',
          [ Sequelize.col('autMenu.createUser.created_at'), 'created_at' ],
          [ Sequelize.col('autMenu.createUser.user_nm'), 'created_nm' ],
          [ Sequelize.col('autMenu.updateUser.updated_at'), 'updated_at' ],
          [ Sequelize.col('autMenu.updateUser.user_nm'), 'updated_nm' ]
        ]
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

  // 📒 Fn[readMenuWithPermissionByUid]: 사용자 기준 메뉴 및 권한 조회
  public readMenuWithPermissionByUid = async(uid: number) => {
    try {
      const result = await sequelize.query(readMenuWithPermission(uid));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IAutMenu[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let menu of body) {
        const result = await this.repo.update(
          {
            menu_type_id: menu.menu_type_id != null ? menu.menu_type_id : null,
            menu_nm: menu.menu_nm != null ? menu.menu_nm : null,
            menu_uri: menu.menu_uri != null ? menu.menu_uri : null,
            component_nm: menu.component_nm != null ? menu.component_nm : null,
            icon: menu.icon != null ? menu.icon : null,
            parent_id: menu.parent_id != null ? menu.parent_id : null,
            sortby: menu.sortby != null ? menu.sortby : null,
            use_fg: menu.use_fg != null ? menu.use_fg : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: menu.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.AutMenu.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAutMenu[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let menu of body) {
        const result = await this.repo.update(
          {
            menu_type_id: menu.menu_type_id,
            menu_nm: menu.menu_nm,
            menu_uri: menu.menu_uri,
            component_nm: menu.component_nm,
            icon: menu.icon,
            parent_id: menu.parent_id,
            sortby: menu.sortby,
            use_fg: menu.use_fg,
            updated_uid: uid,
          },
          { 
            where: { uuid: menu.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.AutMenu.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAutMenu[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let menu of body) {
        count += await this.repo.destroy({ where: { uuid: menu.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.AutMenu.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AutMenuRepo;