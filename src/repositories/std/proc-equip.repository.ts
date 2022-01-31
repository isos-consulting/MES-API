import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdProcEquip from '../../models/std/proc-equip.model';
import IStdProcEquip from '../../interfaces/std/proc-equip.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';

class StdProcEquipRepo {
  repo: Repository<StdProcEquip>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdProcEquip);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdProcEquip[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((procEquip: any) => {
        return this.repo.create(
          {
            factory_id: procEquip.factory_id,
            proc_id: procEquip.proc_id,
            equip_id: procEquip.equip_id,
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
          { 
            model: this.sequelize.models.StdProc, 
            attributes: [], 
            required: true, 
            where: { uuid: params.proc_uuid ?? { [Op.ne]: null } }
          },
          { 
            model: this.sequelize.models.StdEquip, 
            attributes: [], 
            required: true, 
            include: [{ model: this.sequelize.models.StdEquipType, attributes: [], required: false }],
            where: {
              [Op.and]: [
                { use_fg: params.use_fg != null ? params.use_fg : { [Op.ne]: null } },
                { prd_fg: params.prd_fg != null ? params.prd_fg : { [Op.ne]: null } }
              ]
            }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdProcEquip.uuid'), 'proc_equip_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('stdProc.proc_nm'), 'proc_nm' ],
          [ Sequelize.col('stdEquip.stdEquipType.uuid'), 'equip_type_uuid' ],
          [ Sequelize.col('stdEquip.stdEquipType.equip_type_cd'), 'equip_type_cd' ],
          [ Sequelize.col('stdEquip.stdEquipType.equip_type_nm'), 'equip_type_nm' ],
          [ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'proc_id' ]
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
          { model: this.sequelize.models.StdProc, attributes: [], required: true },
          { 
            model: this.sequelize.models.StdEquip, 
            attributes: [], 
            required: true, 
            include: [{ model: this.sequelize.models.StdEquipType, attributes: [], required: false }],
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdProcEquip.uuid'), 'proc_equip_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('stdProc.proc_nm'), 'proc_nm' ],
          [ Sequelize.col('stdEquip.stdEquipType.uuid'), 'equip_type_uuid' ],
          [ Sequelize.col('stdEquip.stdEquipType.equip_type_cd'), 'equip_type_cd' ],
          [ Sequelize.col('stdEquip.stdEquipType.equip_type_nm'), 'equip_type_nm' ],
          [ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
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
  public readRawByUnique = async(
    params: { factory_id: number, proc_id: number, equip_id: number }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { factory_id: params.factory_id },
          { proc_id: params.proc_id },
          { equip_id: params.equip_id }
        ]
      }
    });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdProcEquip[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((procEquip: any) => {
        return this.repo.update(
          {
            proc_id: procEquip.proc_id ?? null,
            equip_id: procEquip.equip_id ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: procEquip.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdProcEquip.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdProcEquip[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((procEquip: any) => {
        return this.repo.update(
          {
            proc_id: procEquip.proc_id,
            equip_id: procEquip.equip_id,
            updated_uid: uid,
          },
          { 
            where: { uuid: procEquip.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdProcEquip.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdProcEquip[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((procEquip: any) => {
        return this.repo.destroy({ where: { uuid: procEquip.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdProcEquip.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default StdProcEquipRepo;