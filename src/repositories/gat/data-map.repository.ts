import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdDataMap from '../../models/gat/data-map.model';
import IStdDataMap from '../../interfaces/gat/data-map.interface';
import { Sequelize } from 'sequelize-typescript';
import convertResult from '../../utils/convertResult';
import _ from 'lodash';
import { Op, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';

class StdDataMapRepo {
  repo: Repository<StdDataMap>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdDataMap);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdDataMap[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((dataMap: any) => {
        return this.repo.create(
          {
            data_gear_id: dataMap.data_gear_id,
						data_item_id: dataMap.data_item_id,
						equip_id: dataMap.equip_id,
						data_map_nm: dataMap.data_map_nm,
						data_channel: dataMap.data_channel,
						history_yn: dataMap.history_yn,
						weight: dataMap.weight,
						work_fg: dataMap.work_fg,
						community_function: dataMap.community_function,
						slave: dataMap.slave,
						alarm_fg: dataMap.alarm_fg,
						ieee752_fg: dataMap.ieee752_fg,
						monitoring_fg: dataMap.monitoring_fg,
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
      const result = await this.repo.findAll({ 
        include: [
					{ 
						model: this.sequelize.models.StdDataItem, 
						attributes: [], 
						required: true, 
						where: { uuid: params.data_item_uuid ?? { [Op.ne]: null } }
					},
					{ 
            model: this.sequelize.models.StdDataGear, 
            attributes: [], 
            required: true, 
            where: { uuid: params.data_gear_uuid ?? { [Op.ne]: null } }
          },
					{ 
            model: this.sequelize.models.StdEquip, 
            attributes: [], 
            required: true, 
            where: { uuid: params.equip_uuid ?? { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdDataMap.uuid'), 'data_map_uuid' ],
					[ Sequelize.col('stdDataItem.uuid'), 'data_item_uuid' ],
					[ Sequelize.col('stdDataItem.data_item_cd'), 'data_item_cd' ],
					[ Sequelize.col('stdDataItem.data_item_nm'), 'data_item_nm' ],
					[ Sequelize.col('stdDataGear.uuid'), 'data_gear_uuid' ],
					[ Sequelize.col('stdDataGear.data_gear_cd'), 'data_gear_cd' ],
					[ Sequelize.col('stdDataGear.data_gear_nm'), 'data_gear_nm' ],
					[ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
					[ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
					[ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
					'data_map_nm',
					'data_channel',
					'history_yn',
					'weight',
					'work_fg',
					'community_function',
					'slave',
					'alarm_fg',
					'ieee752_fg',
					'monitoring_fg',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
				where: {
          [Op.and]: [
						params.monitoring_fg != null ? { monitoring_fg: params.monitoring_fg } : {},
          ]
				},
        order: [ 'data_map_id' ],
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
					{ model: this.sequelize.models.StdDataGear, attributes: [], required: true },
					{ model: this.sequelize.models.StdDataItem, attributes: [], required: true },
					{ model: this.sequelize.models.StdEquip, attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdDataMap.uuid'), 'data_map_uuid' ],
					[ Sequelize.col('stdDataItem.uuid'), 'data_item_uuid' ],
					[ Sequelize.col('stdDataItem.data_item_cd'), 'data_item_cd' ],
					[ Sequelize.col('stdDataItem.data_item_nm'), 'data_item_nm' ],
					[ Sequelize.col('stdDataGear.uuid'), 'data_gear_uuid' ],
					[ Sequelize.col('stdDataGear.data_gear_cd'), 'data_gear_cd' ],
					[ Sequelize.col('stdDataGear.data_gear_nm'), 'data_gear_nm' ],
					[ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
					[ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
					[ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
					'data_map_nm',
					'data_channel',
					'history_yn',
					'weight',
					'work_fg',
					'community_function',
					'slave',
					'alarm_fg',
					'ieee752_fg',
					'monitoring_fg',
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

  // 📒 Fn[readRawById]: Id 기준 Raw Data Read Function
  public readRawById = async(id: number) => {
    const result = await this.repo.findOne({ where: { data_map_id: id } });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdDataMap[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((dataMap: any) => {
        return this.repo.update(
          {
						data_map_nm: dataMap.data_map_nm ?? null,
						data_gear_id: dataMap.data_gear_id ?? null,
						data_item_id: dataMap.data_item_id ?? null,
						equip_id: dataMap.equip_id ?? null,
						data_channel: dataMap.data_channel ?? null,
						history_yn: dataMap.history_yn ?? null,
						weight: dataMap.weight ?? null,
						work_fg: dataMap.work_fg ?? null,
						community_function: dataMap.community_function ?? null,
						slave: dataMap.slave ?? null,
						alarm_fg: dataMap.alarm_fg ?? null,
						ieee752_fg: dataMap.ieee752_fg ?? null,
						monitoring_fg: dataMap.monitoring_fg ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: dataMap.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdFactory.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdDataMap[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((dataMap: any) => {
        return this.repo.update(
          {
						data_map_nm: dataMap.data_map_nm,
						data_gear_id: dataMap.data_gear_id,
						data_item_id: dataMap.data_item_id,
						equip_id: dataMap.equip_id,
						data_channel: dataMap.data_channel,
						history_yn: dataMap.history_yn,
						weight: dataMap.weight,
						work_fg: dataMap.work_fg,
						community_function: dataMap.community_function,
						slave: dataMap.slave,
						alarm_fg: dataMap.alarm_fg,
						ieee752_fg: dataMap.ieee752_fg,
						monitoring_fg: dataMap.monitoring_fg,
            updated_uid: uid,
          },
          { 
            where: { uuid: dataMap.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdFactory.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdDataMap[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((dataMap: any) => {
        return this.repo.destroy({ where: { uuid: dataMap.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdFactory.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default StdDataMapRepo;