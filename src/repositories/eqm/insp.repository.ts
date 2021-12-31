import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import EqmInsp from '../../models/eqm/insp.model';
import IEqmInsp from '../../interfaces/eqm/insp.interface';

class EqmInspRepo {
  repo: Repository<EqmInsp>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(EqmInsp);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IEqmInsp[], uid: number, transaction?: Transaction) => {
    try {
      const insps = body.map((insp) => {
        return {
          factory_id: insp.factory_id,
          insp_no: insp.insp_no,
          equip_id: insp.equip_id,
          reg_date: insp.reg_date,
          apply_fg: insp.apply_fg,
          apply_date: insp.apply_date,
          contents: insp.contents,
          remark: insp.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(insps, { individualHooks: true, transaction });

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
            model: this.sequelize.models.StdEquip, 
            attributes: [], 
            required: true,
            include: [{ model: this.sequelize.models.StdEquipType, attributes: [], required: false }],
            where: { 
              [Op.and]: [
                { use_fg: true },
                { uuid: params.equip_uuid ? params.equip_uuid : { [Op.ne]: null } }
              ]
            }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('eqmInsp.uuid'), 'insp_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'insp_no',
          [ Sequelize.col('stdEquip.stdEqiupType.uuid'), 'equip_type_uuid' ],
          [ Sequelize.col('stdEquip.stdEqiupType.equip_type_cd'), 'equip_type_cd' ],
          [ Sequelize.col('stdEquip.stdEqiupType.equip_type_nm'), 'equip_type_nm' ],
          [ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
          'reg_date',
          'apply_date',
          'apply_fg',
          [ Sequelize.literal(`CASE WHEN eqmInsp.apply_fg = TRUE THEN '적용' ELSE '미적용' END `), 'apply_state' ],
          'contents',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: {
          apply_fg: params.apply_fg != null ? params.apply_fg : { [Op.ne]: null }
        },
        order: [ 'factory_id', 'equip_id', ['apply_fg', 'desc'], 'insp_id' ],
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
          { 
            model: this.sequelize.models.StdEquip, 
            attributes: [], 
            required: true,
            include: [{ model: this.sequelize.models.StdEquipType, attributes: [], required: false }],
            where: { use_fg: true },
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('eqmInsp.uuid'), 'insp_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'insp_no',
          [ Sequelize.col('stdEquip.stdEqiupType.uuid'), 'equip_type_uuid' ],
          [ Sequelize.col('stdEquip.stdEqiupType.equip_type_cd'), 'equip_type_cd' ],
          [ Sequelize.col('stdEquip.stdEqiupType.equip_type_nm'), 'equip_type_nm' ],
          [ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
          'reg_date',
          'apply_date',
          'apply_fg',
          [ Sequelize.literal(`CASE WHEN eqmInsp.apply_fg = TRUE THEN '적용' ELSE '미적용' END `), 'apply_state' ],
          'contents',
          'remark',
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

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IEqmInsp[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp of body) {
        const result = await this.repo.update(
          {
            insp_no: insp.insp_no ?? null,
            reg_date: insp.reg_date ?? null,
            apply_fg: insp.apply_fg ?? null,
            apply_date: insp.apply_date ?? null,
            contents: insp.contents ?? null,
            remark: insp.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: insp.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.EqmInsp.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  // 📒 Fn[updateApply]: Default Patch Function
  public updateApply = async(body: IEqmInsp[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp of body) {
        const result = await this.repo.update(
          {
            apply_date: insp.apply_date,
            apply_fg: insp.apply_fg,
            updated_uid: uid,
          },
          { 
            where: { uuid: insp.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.EqmInsp.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IEqmInsp[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp of body) {
        const result = await this.repo.update(
          {
            insp_no: insp.insp_no,
            reg_date: insp.reg_date,
            apply_fg: insp.apply_fg,
            apply_date: insp.apply_date,
            contents: insp.contents,
            remark: insp.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: insp.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.EqmInsp.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IEqmInsp[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp of body) {
        count += await this.repo.destroy({ where: { uuid: insp.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.EqmInsp.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default EqmInspRepo;