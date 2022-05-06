import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdDataGear from '../../models/gat/data-gear.model';
import IStdDataGear from '../../interfaces/gat/data-gear.interface';
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

class StdDataGearRepo {
  repo: Repository<StdDataGear>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdDataGear);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdDataGear[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((dataGear: any) => {
        return this.repo.create(
          {
            data_gear_cd: dataGear.data_gear_cd,
            data_gear_nm: dataGear.data_gear_nm,
						ip: dataGear.ip,
						port: dataGear.port,
						gear_type: dataGear.gear_type,
						connection_type: dataGear.connection_type,
						factory_id: dataGear.factory_id,
						manufacturer: dataGear.manufacturer,
						protocol: dataGear.protocol,
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
            model: this.sequelize.models.StdFactory, 
            attributes: [], 
            required: true, 
            where: { uuid: params.factory_uuid ?? { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdDataGear.uuid'), 'data_gear_uuid' ],
					[ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'data_gear_cd',
          'data_gear_nm',
					'ip',
					'port',
					'gear_type',
					'connection_type',
					'manufacturer',
					'protocol',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'data_gear_id' ],
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
          [ Sequelize.col('stdDataGear.uuid'), 'data_gear_uuid' ],
					[ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'data_gear_cd',
          'data_gear_nm',
					'ip',
					'port',
					'gear_type',
					'connection_type',
					'manufacturer',
					'protocol',
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
    const result = await this.repo.findOne({ where: { data_gear_id: id } });
    return convertReadResult(result);
  };

  // 📒 Fn[readRawByUnique]: Unique Key를 통하여 Raw Data Read Function
  public readRawByUnique = async(params: { data_gear_cd: string }) => {
    const result = await this.repo.findOne({ where: { data_gear_cd: params.data_gear_cd } });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdDataGear[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((dataGear: any) => {
        return this.repo.update(
          {
						factory_id: dataGear.factory_id ?? null,
            data_gear_cd: dataGear.data_gear_cd ?? null,
            data_gear_nm: dataGear.data_gear_nm ?? null,
            ip: dataGear.ip ?? null,
            port: dataGear.port ?? null,
            gear_type: dataGear.gear_type ?? null,
            connection_type: dataGear.connection_type ?? null,
						manufacturer: dataGear.manufacturer ?? null,
						protocol: dataGear.protocol ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: dataGear.uuid },
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
  public patch = async(body: IStdDataGear[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((dataGear: any) => {
        return this.repo.update(
          {
						factory_id: dataGear.factory_id,
            data_gear_cd: dataGear.data_gear_cd,
            data_gear_nm: dataGear.data_gear_nm,
            ip: dataGear.ip,
            port: dataGear.port,
            gear_type: dataGear.gear_type,
            connection_type: dataGear.connection_type,
						manufacturer: dataGear.manufacturer,
						protocol: dataGear.protocol,
            updated_uid: uid,
          },
          { 
            where: { uuid: dataGear.uuid },
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
  public delete = async(body: IStdDataGear[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((dataGear: any) => {
        return this.repo.destroy({ where: { uuid: dataGear.uuid }, transaction});
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

export default StdDataGearRepo;