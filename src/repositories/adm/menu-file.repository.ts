import _ from "lodash";
import { Op, Transaction, UniqueConstraintError } from "sequelize";
import { Repository, Sequelize } from "sequelize-typescript";
import IAdmMenuFile from "../../interfaces/adm/menu-file.interface";
import ApiResult from "../../interfaces/common/api-result.interface";
import AdmMenuFile from "../../models/adm/menu-file.model";
import { TFileType } from "../../types/file-type.type";
import convertReadResult from "../../utils/convertReadResult";
import convertResult from "../../utils/convertResult";
import getPreviousRaws from "../../utils/getPreviousRaws";
import { getSequelize } from "../../utils/getSequelize";
import AdmLogRepo from "./log.repository";

class AdmMenuFileRepo {
  repo: Repository<AdmMenuFile>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmMenuFile);
  }
  // #endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async (body: IAdmMenuFile[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((menuFile: any) => {
        return this.repo.create(
          {         
            menu_id: menuFile.menu_id,
            file_type: menuFile.file_type,
            file_name: menuFile.file_name,
            file_extension: menuFile.file_extension,
            use_fg: menuFile.use_fg,
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
            model: this.sequelize.models.AutMenu,
            attributes: [],
            required: true,
            where: { uuid: params.menu_uuid ? params.menu_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('admMenuFile.uuid'), 'menu_file_uuid' ],
          [ Sequelize.col('autMenu.uuid'), 'menu_uuid' ],
          [ Sequelize.col('autMenu.menu_nm'), 'menu_nm' ],
          [ Sequelize.col('autMenu.menu_uri'), 'menu_uri' ],
          'file_type',
          'file_name',
          'file_extension',
          'use_fg',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { [Op.and]: [
          { file_type: params.file_type ? params.file_type : { [Op.ne]: null } },
          { use_fg: params.use_fg ?? { [Op.ne]: null } }
        ] }, 
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
            model: this.sequelize.models.AutMenu,
            attributes: [],
            required: true,
            where: { uuid: params.menu_uuid ? params.menu_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('admMenuFile.uuid'), 'menu_file_uuid' ],
          [ Sequelize.col('autMenu.uuid'), 'menu_uuid' ],
          [ Sequelize.col('autMenu.menu_nm'), 'menu_nm' ],
          [ Sequelize.col('autMenu.menu_uri'), 'menu_uri' ],
          'file_type',
          'file_name',
          'file_extension',
          'use_fg',
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

  // 📒 Fn[readByMenuId]: Default Read With MenuId Function
  public readByMenuId = async (menu_id: string, file_type: TFileType) => {
    try {
      const result = await this.repo.findAll({
        include: [
          {
            model: this.sequelize.models.AutMenu,
            attributes: [],
            required: true,
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('admMenuFile.uuid'), 'menu_file_uuid' ],
          [ Sequelize.col('autMenu.uuid'), 'menu_uuid' ],
          [ Sequelize.col('autMenu.menu_nm'), 'menu_nm' ],
          [ Sequelize.col('autMenu.menu_uri'), 'menu_uri' ],
          'file_type',
          'file_name',
          'file_extension',
          'use_fg',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { [Op.and]: [
          { menu_id },
          { file_type }
        ] },
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
    const result = await this.repo.findOne({ where: { menu_file_id: id } });
    return convertReadResult(result);
  }

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async (body: IAdmMenuFile[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);
      
      const promises = body.map((menuFile: any) => {
        return this.repo.update(
          {         
            menu_id: menuFile.menu_id,
            file_type: menuFile.file_type,
            file_name: menuFile.file_name,
            file_extension: menuFile.file_extension,
            use_fg: menuFile.use_fg,
            created_uid: uid,
            updated_uid: uid
          } as any,
          {
            where: { uuid: menuFile.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });

      const raws = await Promise.all(promises);
      
      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmMenuFile.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };
  
  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAdmMenuFile[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((menuFile: any) => {
        return this.repo.destroy({ where: { uuid: menuFile.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.AdmMenuFile.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
  //#endregion

  //#endregion
}

export default AdmMenuFileRepo;