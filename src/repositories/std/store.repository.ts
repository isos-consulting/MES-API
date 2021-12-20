import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdStore from '../../models/std/store.model';
import IStdStore from '../../interfaces/std/store.interface';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class StdStoreRepo {
  repo: Repository<StdStore>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdStore);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdStore[], uid: number, transaction?: Transaction) => {
    try {
      const store = body.map((store) => {
        return {
          factory_id: store.factory_id,
          store_cd: store.store_cd,
          store_nm: store.store_nm,
          reject_store_fg: store.reject_store_fg,
          return_store_fg: store.return_store_fg,
          outgo_store_fg: store.outgo_store_fg,
          final_insp_store_fg: store.final_insp_store_fg,
          outsourcing_store_fg: store.outsourcing_store_fg,
          available_store_fg: store.available_store_fg,
          position_type: store.position_type,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(store, { individualHooks: true, transaction });

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
          { 
            model: this.sequelize.models.StdFactory, 
            attributes: [], 
            required: true, 
            where: { uuid: params?.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdStore.uuid'), 'store_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'store_cd',
          'store_nm',
          'reject_store_fg',
          'return_store_fg',
          'outgo_store_fg',
          'final_insp_store_fg',
          'outsourcing_store_fg',
          'available_store_fg',
          'position_type',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: this.getStoreWhereOptions(params, params.store_type),
        order: [ 'factory_id', 'store_id' ],
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
          { model: this.sequelize.models.StdFactory, attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdStore.uuid'), 'store_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'store_cd',
          'store_nm',
          'reject_store_fg',
          'return_store_fg',
          'outgo_store_fg',
          'final_insp_store_fg',
          'outsourcing_store_fg',
          'available_store_fg',
          'position_type',
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

  // 📒 Fn[readRawByUnique]: Unique Key를 통하여 Raw Data Read Function
  public readRawByUnique = async(
    params: { factory_id: number, store_cd: string }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { factory_id: params.factory_id },
          { store_cd: params.store_cd }
        ]
      }
    });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdStore[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let store of body) {
        const result = await this.repo.update(
          {
            store_cd: store.store_cd != null ? store.store_cd : null,
            store_nm: store.store_nm != null ? store.store_nm : null,
            reject_store_fg: store.reject_store_fg != null ? store.reject_store_fg : null,
            return_store_fg: store.return_store_fg != null ? store.return_store_fg : null,
            outgo_store_fg: store.outgo_store_fg != null ? store.outgo_store_fg : null,
            final_insp_store_fg: store.final_insp_store_fg != null ? store.final_insp_store_fg : null,
            outsourcing_store_fg: store.outsourcing_store_fg != null ? store.outsourcing_store_fg : null,
            available_store_fg: store.available_store_fg != null ? store.available_store_fg : null,
            position_type: store.position_type != null ? store.position_type : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: store.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdStore.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdStore[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let store of body) {
        const result = await this.repo.update(
          {
            store_cd: store.store_cd,
            store_nm: store.store_nm,
            reject_store_fg: store.reject_store_fg,
            return_store_fg: store.return_store_fg,
            outgo_store_fg: store.outgo_store_fg,
            final_insp_store_fg: store.final_insp_store_fg,
            outsourcing_store_fg: store.outsourcing_store_fg,
            available_store_fg: store.available_store_fg,
            position_type: store.position_type,
            updated_uid: uid,
          },
          { 
            where: { uuid: store.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdStore.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdStore[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let store of body) {
        count += await this.repo.destroy({ where: { uuid: store.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdStore.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
  
  //#endregion

  //#endregion

  //#region ✅ Other Functions
  // 📒 Fn[getStoreWhereOptions]: 창고 조회 유형에 따라 조건문 생성
  /**
   * 창고 조회 유형에 따라 조건문 생성
   * @param params Request Parameter
   * @param storeType 창고 조회 유형
   * @returns 유형에 따른 창고 조회 조건문
   */
  getStoreWhereOptions = (params?: any, storeType?: string) => {
    let whereOptions: WhereOptions<StdStore> = {};

    switch (storeType) {
      // 📌 전체 창고 조회
      case 'all':
        break;

      // 📌 가용 재고 창고 조회
      case 'available':
        whereOptions = { available_store_fg: true };
        break;

      // 📌 부적합 창고 조회
      case 'reject':
        whereOptions = { reject_store_fg: true };
        break;

      // 📌 반출 창고 조회
      case 'return':
        whereOptions = { return_store_fg: true };
        break;

      // 📌 출하 창고 조회
      case 'outgo':
        whereOptions = { return_store_fg: true };
        break;

      // 📌 최종검사 창고 조회
      case 'finalInsp':
        whereOptions = { final_insp_store_fg: true };
        break;

      // 📌 외주 창고 조회
      case 'outsourcing':
        whereOptions = { outsourcing_store_fg: true };
        break;

      default:
        break;
    }

    return whereOptions;
  }
  //#endregion
}

export default StdStoreRepo;