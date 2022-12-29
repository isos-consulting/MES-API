import _ from "lodash";
import { Op } from "sequelize";
import { Transaction, UniqueConstraintError } from "sequelize";
import { Repository, Sequelize } from "sequelize-typescript";
import IAutBookmark from "../../interfaces/aut/bookmark.interface";
import ApiResult from "../../interfaces/common/api-result.interface";
import AutBookmark from "../../models/aut/bookmark.model";
import convertReadResult from "../../utils/convertReadResult";
import getPreviousRaws from "../../utils/getPreviousRaws";
import { getSequelize } from "../../utils/getSequelize";
import AdmLogRepo from "../adm/log.repository";

class AutBookmarkRepo {
  repo: Repository<AutBookmark>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AutBookmark);
  }
  // #endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async (body: IAutBookmark[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((bookmark: any) => {
        return this.repo.create(
          {
            uid: uid,
            menu_id: bookmark.menu_id,
            created_uid: uid,
            updated_uid: uid
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
  public read = async (params?: any) => {
    try {
      const result = await this.repo.findAll({
        include: [
          {
            model: this.sequelize.models.AutUser,
            as: 'autUser',
            attributes: [],
            required: true,
            where: { uid: params.uid ? params.uid : { [Op.ne]: null } }
          },
          {
            model: this.sequelize.models.AutMenu,
            attributes: [],
            required: true,
            where: { uuid: params.menu_uuid ? params.menu_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('autBookmark.uuid'), 'bookmark_uuid' ],
          [ Sequelize.col('autUser.uuid'), 'user_uuid' ],
          [ Sequelize.col('autUser.uid'), 'user_uid' ],
          [ Sequelize.col('autMenu.uuid'), 'menu_uuid' ],
          [ Sequelize.col('autMenu.menu_nm'), 'menu_nm' ],
          [ Sequelize.col('autMenu.menu_uri'), 'menu_uri' ],
          [ Sequelize.col('autMenu.component_nm'), 'component_nm' ],
          [ Sequelize.col('autMenu.icon'), 'icon' ],
          [ Sequelize.col('autMenu.use_fg'), 'use_fg' ],
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { uid: params.uid },
        order: [ 'menu_id' ],
      });
      
      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async (uuid: string, params?: any) => {
    try {
      const result = await this.repo.findAll({
        include: [
          {
            model: this.sequelize.models.AutUser,
            as: 'autUser',
            attributes: [],
            required: true,
            where: { uid: params?.uid ? params.uid : { [Op.ne]: null } }
          },
          {
            model: this.sequelize.models.AutMenu,
            attributes: [],
            required: true,
            where: { uuid: params?.menu_uuid ? params.menu_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('autBookmark.uuid'), 'bookmark_uuid' ],
          [ Sequelize.col('autUser.uuid'), 'user_uuid' ],
          [ Sequelize.col('autUser.uid'), 'user_uid' ],
          [ Sequelize.col('autMenu.uuid'), 'menu_uuid' ],
          [ Sequelize.col('autMenu.menu_nm'), 'menu_nm' ],
          [ Sequelize.col('autMenu.menu_uri'), 'menu_uri' ],
          [ Sequelize.col('autMenu.component_nm'), 'component_nm' ],
          [ Sequelize.col('autMenu.icon'), 'icon' ],
          [ Sequelize.col('autMenu.use_fg'), 'use_fg' ],
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
  }

  // 📒 Fn[readRawsByUuids]: Id 를 포함한 Raw Datas Read Function
  public readRawsByUuids = async(uuids: string[]) => {
    const result = await this.repo.findAll({ where: { uuid: { [Op.in]: uuids } } });
    return convertReadResult(result);
  }

  // 📒 Fn[readRawByUuid]: Id 를 포함한 Raw Data Read Function
  public readRawByUuid = async(uuid: number) => {
    const result = await this.repo.findOne({ where: { uuid } });
    return convertReadResult(result);
  }

  // 📒 Fn[readRawById]: Id 기준 Raw Data Read Function
  public readRawById = async(id: number) => {
    const result = await this.repo.findOne({ where: { bookmark_id: id } });
    return convertReadResult(result);
  }

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAutBookmark[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((bookmark: any) => {
        return this.repo.destroy({ where: { uuid: bookmark.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.AutBookmark.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  public deleteByMenuUuid = async(body: IAutBookmark[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((bookmark: any) => {
        return this.repo.destroy({ where: { 
          [Op.and]: [
            { menu_id: bookmark.menu_id },
            { uid },
          ]
        }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.AutBookmark.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AutBookmarkRepo;