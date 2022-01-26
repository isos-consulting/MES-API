import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AutMenu from '../../models/aut/menu.model';
import IAutMenu from '../../interfaces/aut/menu.interface';
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
import { readMenuWithPermission } from '../../queries/aut/menu-with-permission.query';

class AutMenuRepo {
  repo: Repository<AutMenu>;
  menuTreeRepo: Repository<AutMenuTree>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AutMenu);
    this.menuTreeRepo = this.sequelize.getRepository(AutMenuTree);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IAutMenu[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((menu: any) => {
        return this.repo.create(
          {
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
          { model: this.sequelize.models.AutMenuType, attributes: [], required: false },
          { 
            model: this.sequelize.models.AutMenu, 
            attributes: [], 
            required: true,
            as: 'autMenu',
            include: [
              { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
              { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true }
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
          { model: this.sequelize.models.AutMenuType, attributes: [], required: false },
          { 
            model: this.sequelize.models.AutMenu, 
            attributes: [], 
            required: true,
            as: 'autMenu',
            include: [
              { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
              { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true }
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
      const result = await this.sequelize.query(readMenuWithPermission(uid));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IAutMenu[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((menu: any) => {
        return this.repo.update(
          {
            menu_type_id: menu.menu_type_id ?? null,
            menu_nm: menu.menu_nm ?? null,
            menu_uri: menu.menu_uri ?? null,
            component_nm: menu.component_nm ?? null,
            icon: menu.icon ?? null,
            parent_id: menu.parent_id ?? null,
            sortby: menu.sortby ?? null,
            use_fg: menu.use_fg ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: menu.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AutMenu.getTableName() as string, previousRaws, uid, transaction);
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
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((menu: any) => {
        return this.repo.update(
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
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AutMenu.getTableName() as string, previousRaws, uid, transaction);
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
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((menu: any) => {
        return this.repo.destroy({ where: { uuid: menu.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.AutMenu.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AutMenuRepo;