import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AutUser from '../../models/aut/user.model';
import IAutUser from '../../interfaces/aut/user.interface';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction, UniqueConstraintError } from 'sequelize';
import AutUserCache from '../../caches/aut/user.cache';
import UserWrapper from '../../wrappers/aut/user.wrapper';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';

class AutUserRepo {
  repo: Repository<AutUser>;
  cache: AutUserCache;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(AutUser);
    this.cache = new AutUserCache();
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IAutUser[], uid: number, transaction?: Transaction) => {
    try {
      const user = body.map((user) => {
        return {
          id: user.id,
          group_id: user.group_id,
          user_nm: user.user_nm,
          pwd: user.pwd,
          email: user.email,
          pwd_fg: user.pwd_fg,
          admin_fg: user.admin_fg,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(user, { individualHooks: true, transaction });

      return convertBulkResult(result);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };
  
  public read = async(params?: any) => {
    try {
      const result = await this.repo.findAll({ 
        include: [
          { 
            model: sequelize.models.AutGroup, 
            attributes: [], 
            required: false,
            where: params.group_uuid ? { uuid: params.group_uuid } : {}
          },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [ 
          [ Sequelize.col('autUser.uuid'), 'user_uuid' ], 
          [ Sequelize.col('autGroup.uuid'), 'group_uuid' ], 
          'id', 
          'user_nm', 
          'email', 
          'pwd_fg', 
          'admin_fg', 
          'created_at', 
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ] 
        ]
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  public readByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.repo.findOne({ 
        include: [
          { model: sequelize.models.AutGroup, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [ 
          [ Sequelize.col('autUser.uuid'), 'user_uuid' ], 
          [ Sequelize.col('autGroup.uuid'), 'group_uuid' ], 
          'id', 
          'user_nm', 
          'email', 
          'pwd_fg', 
          'admin_fg', 
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

  // 📒 Fn[readRawByUnique]: Unique Key를 통하여 Raw Data Read Function
  public readRawByUnique = async(params: { id: string }) => {
    const result = await this.repo.findOne({ where: { id: params.id } });
    return convertReadResult(result);
  };

  public readAuth = async(uuid: string) => {
    try {
      let user = await this.cache.read(uuid);
      if (!user) {
        user = await this.repo.findOne({
          attributes: [ 'uid', 'uuid', 'group_id', 'id', 'user_nm', 'pwd', 'email', 'pwd_fg', 'admin_fg' ],
          where: { uuid }
        });
        await this.cache.create(user);
      }

      return UserWrapper.create(user);
    } catch (error) {
      throw error;
    }
  };

  public readById = async(id: string) => {
    try {
      let user = await this.cache.readById(id);
      if (!user) {
        user = await this.repo.findOne({
          attributes: [ 'uid', 'uuid', 'group_id', 'id', 'user_nm', 'pwd', 'email', 'pwd_fg', 'admin_fg' ],
          where: { id }
        });
        await this.cache.create(user);
      }

      return UserWrapper.create(user);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IAutUser[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let user of body) {
        const result = await this.repo.update(
          {
            group_id: user.group_id != null ? user.group_id : null,
            email: user.email != null ? user.email : null,
            pwd_fg: user.pwd_fg != null ? user.pwd_fg : null,
            admin_fg: user.admin_fg != null ? user.admin_fg : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: user.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.AutUser.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  // 📒 Fn[updatePwd]: Password Update Function
  public updatePwd = async(body: IAutUser[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let user of body) {
        const result = await this.repo.update(
          {
            pwd: user.pwd,
            pwd_fg: user.pwd_fg,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: user.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.AutUser.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAutUser[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let user of body) {
        const result = await this.repo.update(
          {
            group_id: user.group_id,
            email: user.email,
            pwd_fg: user.pwd_fg,
            admin_fg: user.admin_fg,
            updated_uid: uid,
          },
          { 
            where: { uuid: user.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.AutUser.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAutUser[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let user of body) {
        count += await this.repo.destroy({ where: { uuid: user.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.AutUser.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
}

export default AutUserRepo;