import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdInspItem from '../../models/std/insp-item.model';
import IStdInspItem from '../../interfaces/std/insp-item.interface';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class StdInspItemRepo {
  repo: Repository<StdInspItem>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdInspItem);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdInspItem[], uid: number, transaction?: Transaction) => {
    try {
      const inspItem = body.map((inspItem) => {
        return {
          factory_id: inspItem.factory_id,
          insp_item_type_id: inspItem.insp_item_type_id,
          insp_item_cd: inspItem.insp_item_cd,
          insp_item_nm: inspItem.insp_item_nm,
          insp_tool_id: inspItem.insp_tool_id,
          insp_method_id: inspItem.insp_method_id,
          eqm_fg: inspItem.eqm_fg,
          qms_fg: inspItem.qms_fg,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(inspItem, { individualHooks: true, transaction });

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
            where: { uuid: params.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
          },
          { 
            model: this.sequelize.models.StdInspItemType, 
            attributes: [],
            where: { uuid: params.insp_item_type_uuid ? params.insp_item_type_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.StdInspTool, attributes: [], required: false },
          { model: this.sequelize.models.StdInspMethod, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdinspItem.uuid'), 'insp_item_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'insp_item_cd',
          'insp_item_nm',
          [ Sequelize.col('stdInspItemType.uuid'), 'insp_item_type_uuid' ],
          [ Sequelize.col('stdInspItemType.insp_item_type_cd'), 'insp_item_type_cd' ],
          [ Sequelize.col('stdInspItemType.insp_item_type_nm'), 'insp_item_type_nm' ],
          [ Sequelize.col('stdInspTool.uuid'), 'insp_tool_uuid' ],
          [ Sequelize.col('stdInspTool.insp_tool_cd'), 'insp_tool_cd' ],
          [ Sequelize.col('stdInspTool.insp_tool_nm'), 'insp_tool_nm' ],
          [ Sequelize.col('stdInspMethod.uuid'), 'insp_method_uuid' ],
          [ Sequelize.col('stdInspMethod.insp_method_cd'), 'insp_method_cd' ],
          [ Sequelize.col('stdInspMethod.insp_method_nm'), 'insp_method_nm' ],
          'eqm_fg',
          'qms_fg',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: {
          [Op.or]: [
            { eqm_fg: params.eqm_fg != null ? params.eqm_fg : { [Op.ne]: null } },
            { qms_fg: params.qms_fg != null ? params.qms_fg : { [Op.ne]: null } }
          ]
        },
        order: [ 'factory_id', 'insp_item_type_id', 'insp_item_id' ],
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
          { model: this.sequelize.models.StdInspItemType, attributes: [], required: false },
          { model: this.sequelize.models.StdInspTool, attributes: [], required: false },
          { model: this.sequelize.models.StdInspMethod, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdinspItem.uuid'), 'insp_item_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'insp_item_cd',
          'insp_item_nm',
          [ Sequelize.col('stdInspItemType.uuid'), 'insp_item_type_uuid' ],
          [ Sequelize.col('stdInspItemType.insp_item_type_cd'), 'insp_item_type_cd' ],
          [ Sequelize.col('stdInspItemType.insp_item_type_nm'), 'insp_item_type_nm' ],
          [ Sequelize.col('stdInspTool.uuid'), 'insp_tool_uuid' ],
          [ Sequelize.col('stdInspTool.insp_tool_cd'), 'insp_tool_cd' ],
          [ Sequelize.col('stdInspTool.insp_tool_nm'), 'insp_tool_nm' ],
          [ Sequelize.col('stdInspMethod.uuid'), 'insp_method_uuid' ],
          [ Sequelize.col('stdInspMethod.insp_method_cd'), 'insp_method_cd' ],
          [ Sequelize.col('stdInspMethod.insp_method_nm'), 'insp_method_nm' ],
          'eqm_fg',
          'qms_fg',
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
    params: { factory_id: number, insp_item_cd: string }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { factory_id: params.factory_id },
          { insp_item_cd: params.insp_item_cd }
        ]
      }
    });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdInspItem[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let inspItem of body) {
        const result = await this.repo.update(
          {
            insp_item_type_id: inspItem.insp_item_type_id ?? null,
            insp_item_cd: inspItem.insp_item_cd ?? null,
            insp_item_nm: inspItem.insp_item_nm ?? null,
            insp_tool_id: inspItem.insp_tool_id ?? null,
            insp_method_id: inspItem.insp_method_id ?? null,
            eqm_fg: inspItem.eqm_fg ?? null,
            qms_fg: inspItem.qms_fg ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: inspItem.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdInspItem.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdInspItem[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let inspItem of body) {
        const result = await this.repo.update(
          {
            insp_item_type_id: inspItem.insp_item_type_id,
            insp_item_cd: inspItem.insp_item_cd,
            insp_item_nm: inspItem.insp_item_nm,
            insp_tool_id: inspItem.insp_tool_id,
            insp_method_id: inspItem.insp_method_id,
            eqm_fg: inspItem.eqm_fg,
            qms_fg: inspItem.qms_fg,
            updated_uid: uid,
          },
          { 
            where: { uuid: inspItem.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdInspItem.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdInspItem[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let inspItem of body) {
        count += await this.repo.destroy({ where: { uuid: inspItem.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdInspItem.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default StdInspItemRepo;