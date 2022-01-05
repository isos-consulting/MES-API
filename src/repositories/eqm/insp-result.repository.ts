import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import EqmInspResult from '../../models/eqm/insp-result.model';
import IEqmInspResult from '../../interfaces/eqm/insp-result.interface';

class EqmInspResultRepo {
  repo: Repository<EqmInspResult>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(EqmInspResult);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IEqmInspResult[], uid: number, transaction?: Transaction) => {
    try {
      const inspResults = body.map((inspResult) => {
        return {
          factory_id: inspResult.factory_id,
          insp_detail_id: inspResult.insp_detail_id,
          equip_id: inspResult.equip_id,
          emp_id: inspResult.emp_id,
          reg_date: inspResult.reg_date,
          insp_value: inspResult.insp_value,
          insp_result_fg: inspResult.insp_result_fg,
          remark: inspResult.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(inspResults, { individualHooks: true, transaction });

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
            model: this.sequelize.models.EqmInspDetail, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdInspMethod, attributes: [], required: false },
              { model: this.sequelize.models.StdInspTool, attributes: [], required: false },
              { model: this.sequelize.models.AdmDailyInspCycle, attributes: [], required: false },
              { model: this.sequelize.models.AdmCycleUnit, attributes: [], required: false },
              { 
                model: this.sequelize.models.StdInspItem, 
                attributes: [], 
                required: true,
                include: [{ model: this.sequelize.models.StdInspItemType, attributes: [], required: false }]
              },
              { 
                model: this.sequelize.models.EqmInsp, 
                attributes: [], 
                required: true,
                where: { uuid: params.insp_uuid ? params.insp_uuid : { [Op.ne]: null } }
              }
            ],
            where: { 
              [Op.and]: [
                { uuid: params.insp_detail_uuid ? params.insp_detail_uuid : { [Op.ne]: null } },
                { periodicity_fg: params.periodicity_fg != null ? params.periodicity_fg : { [Op.ne]: null } },
              ]
            }
          },
          {
            model: this.sequelize.models.StdEquip, 
            attributes: [], 
            required: true,
            include: [{ model: this.sequelize.models.StdEquipType, attributes: [], required: false }],
            where: { uuid: params.equip_uuid ? params.equip_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.StdEmp, attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('eqmInspResult.uuid'), 'insp_result_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('eqmInspDetail.eqmInsp.uuid'), 'insp_uuid' ],
          [ Sequelize.col('eqmInspDetail.eqmInsp.insp_no'), 'insp_no' ],
          [ Sequelize.col('eqmInspDetail.uuid'), 'insp_detail_uuid' ],
          [ Sequelize.fn('concat', Sequelize.col('eqmInspDetail.eqmInsp.insp_no'), '-', Sequelize.col('eqmInspDetail.seq')), 'insp_no_sub' ],
          [ Sequelize.col('eqmInspDetail.stdInspItem.stdInspItemType.uuid'), 'insp_item_type_uuid' ],
          [ Sequelize.col('eqmInspDetail.stdInspItem.stdInspItemType.insp_item_type_cd'), 'insp_item_type_cd' ],
          [ Sequelize.col('eqmInspDetail.stdInspItem.stdInspItemType.insp_item_type_nm'), 'insp_item_type_nm' ],
          [ Sequelize.col('eqmInspDetail.stdInspItem.uuid'), 'insp_item_uuid' ],
          [ Sequelize.col('eqmInspDetail.stdInspItem.insp_item_cd'), 'insp_item_cd' ],
          [ Sequelize.col('eqmInspDetail.stdInspItem.insp_item_nm'), 'insp_item_nm' ],
          [ Sequelize.col('eqmInspDetail.insp_item_desc'), 'insp_item_desc' ],
          [ Sequelize.col('eqmInspDetail.periodicity_fg'), 'periodicity_fg' ],
          [ Sequelize.col('eqmInspDetail.spec_std'), 'spec_std' ],
          [ Sequelize.col('eqmInspDetail.spec_min'), 'spec_min' ],
          [ Sequelize.col('eqmInspDetail.spec_max'), 'spec_max' ],
          [ Sequelize.col('eqmInspDetail.stdInspTool.uuid'), 'insp_tool_uuid' ],
          [ Sequelize.col('eqmInspDetail.stdInspTool.insp_tool_cd'), 'insp_tool_cd' ],
          [ Sequelize.col('eqmInspDetail.stdInspTool.insp_tool_nm'), 'insp_tool_nm' ],
          [ Sequelize.col('eqmInspDetail.stdInspMethod.uuid'), 'insp_method_uuid' ],
          [ Sequelize.col('eqmInspDetail.stdInspMethod.insp_method_cd'), 'insp_method_cd' ],
          [ Sequelize.col('eqmInspDetail.stdInspMethod.insp_method_nm'), 'insp_method_nm' ],
          [ Sequelize.col('eqmInspDetail.admDailyInspCycle.uuid'), 'daily_insp_cycle_uuid' ],
          [ Sequelize.col('eqmInspDetail.admDailyInspCycle.daily_insp_cycle_cd'), 'daily_insp_cycle_cd' ],
          [ Sequelize.col('eqmInspDetail.admDailyInspCycle.daily_insp_cycle_nm'), 'daily_insp_cycle_nm' ],
          [ Sequelize.col('eqmInspDetail.admCycleUnit.uuid'), 'cycle_unit_uuid' ],
          [ Sequelize.col('eqmInspDetail.admCycleUnit.cycle_unit_cd'), 'cycle_unit_cd' ],
          [ Sequelize.col('eqmInspDetail.admCycleUnit.cycle_unit_nm'), 'cycle_unit_nm' ],
          [ Sequelize.col('eqmInspDetail.base_date'), 'base_date' ],
          [ Sequelize.col('eqmInspDetail.cycle'), 'cycle' ],
          [ Sequelize.col('stdEquip.stdEquipType.uuid'), 'equip_type_uuid' ],
          [ Sequelize.col('stdEquip.stdEquipType.equip_type_cd'), 'equip_type_cd' ],
          [ Sequelize.col('stdEquip.stdEquipType.equip_type_nm'), 'equip_type_nm' ],
          [ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
          [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
          [ Sequelize.col('stdEmp.emp_cd'), 'emp_cd' ],
          [ Sequelize.col('stdEmp.emp_nm'), 'emp_nm' ],
          'reg_date',
          'insp_value',
          'insp_result_fg',
          [ Sequelize.literal(`CASE eqmInspResult.insp_result_fg WHEN TRUE THEN '합격' WHEN FALSE THEN '불합격' END`), 'insp_result_state' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: {
          [Op.and]: [
            params.start_date && params.end_date ? 
            {
              [Op.and]: [
                Sequelize.where(Sequelize.fn('date', Sequelize.col('eqmInspResult.reg_date')), '>=', params.start_date),
                Sequelize.where(Sequelize.fn('date', Sequelize.col('eqmInspResult.reg_date')), '<=', params.end_date),
              ]
            } : {}
          ]
        },
        order: [ 'factory_id', 'equip_id', 'insp_detail_id', 'reg_date' ]
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
            model: this.sequelize.models.EqmInspDetail, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdInspMethod, attributes: [], required: false },
              { model: this.sequelize.models.StdInspTool, attributes: [], required: false },
              { model: this.sequelize.models.AdmDailyInspCycle, attributes: [], required: false },
              { model: this.sequelize.models.AdmCycleUnit, attributes: [], required: false },
              { 
                model: this.sequelize.models.StdInspItem, 
                attributes: [], 
                required: true,
                include: [{ model: this.sequelize.models.StdInspItemType, attributes: [], required: false }]
              },
              { model: this.sequelize.models.EqmInsp, attributes: [], required: true }
            ],
          },
          {
            model: this.sequelize.models.StdEquip, 
            attributes: [], 
            required: true,
            include: [{ model: this.sequelize.models.StdEquipType, attributes: [], required: false }],
          },
          { model: this.sequelize.models.StdEmp, attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('eqmInspResult.uuid'), 'insp_result_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('eqmInspDetail.eqmInsp.uuid'), 'insp_uuid' ],
          [ Sequelize.col('eqmInspDetail.eqmInsp.insp_no'), 'insp_no' ],
          [ Sequelize.col('eqmInspDetail.uuid'), 'insp_detail_uuid' ],
          [ Sequelize.fn('concat', Sequelize.col('eqmInspDetail.eqmInsp.insp_no'), '-', Sequelize.col('eqmInspDetail.seq')), 'insp_no_sub' ],
          [ Sequelize.col('eqmInspDetail.stdInspItem.stdInspItemType.uuid'), 'insp_item_type_uuid' ],
          [ Sequelize.col('eqmInspDetail.stdInspItem.stdInspItemType.insp_item_type_cd'), 'insp_item_type_cd' ],
          [ Sequelize.col('eqmInspDetail.stdInspItem.stdInspItemType.insp_item_type_nm'), 'insp_item_type_nm' ],
          [ Sequelize.col('eqmInspDetail.stdInspItem.uuid'), 'insp_item_uuid' ],
          [ Sequelize.col('eqmInspDetail.stdInspItem.insp_item_cd'), 'insp_item_cd' ],
          [ Sequelize.col('eqmInspDetail.stdInspItem.insp_item_nm'), 'insp_item_nm' ],
          [ Sequelize.col('eqmInspDetail.insp_item_desc'), 'insp_item_desc' ],
          [ Sequelize.col('eqmInspDetail.periodicity_fg'), 'periodicity_fg' ],
          [ Sequelize.col('eqmInspDetail.spec_std'), 'spec_std' ],
          [ Sequelize.col('eqmInspDetail.spec_min'), 'spec_min' ],
          [ Sequelize.col('eqmInspDetail.spec_max'), 'spec_max' ],
          [ Sequelize.col('eqmInspDetail.stdInspTool.uuid'), 'insp_tool_uuid' ],
          [ Sequelize.col('eqmInspDetail.stdInspTool.insp_tool_cd'), 'insp_tool_cd' ],
          [ Sequelize.col('eqmInspDetail.stdInspTool.insp_tool_nm'), 'insp_tool_nm' ],
          [ Sequelize.col('eqmInspDetail.stdInspMethod.uuid'), 'insp_method_uuid' ],
          [ Sequelize.col('eqmInspDetail.stdInspMethod.insp_method_cd'), 'insp_method_cd' ],
          [ Sequelize.col('eqmInspDetail.stdInspMethod.insp_method_nm'), 'insp_method_nm' ],
          [ Sequelize.col('eqmInspDetail.admDailyInspCycle.uuid'), 'daily_insp_cycle_uuid' ],
          [ Sequelize.col('eqmInspDetail.admDailyInspCycle.daily_insp_cycle_cd'), 'daily_insp_cycle_cd' ],
          [ Sequelize.col('eqmInspDetail.admDailyInspCycle.daily_insp_cycle_nm'), 'daily_insp_cycle_nm' ],
          [ Sequelize.col('eqmInspDetail.admCycleUnit.uuid'), 'cycle_unit_uuid' ],
          [ Sequelize.col('eqmInspDetail.admCycleUnit.cycle_unit_cd'), 'cycle_unit_cd' ],
          [ Sequelize.col('eqmInspDetail.admCycleUnit.cycle_unit_nm'), 'cycle_unit_nm' ],
          [ Sequelize.col('eqmInspDetail.base_date'), 'base_date' ],
          [ Sequelize.col('eqmInspDetail.cycle'), 'cycle' ],
          [ Sequelize.col('stdEquip.stdEquipType.uuid'), 'equip_type_uuid' ],
          [ Sequelize.col('stdEquip.stdEquipType.equip_type_cd'), 'equip_type_cd' ],
          [ Sequelize.col('stdEquip.stdEquipType.equip_type_nm'), 'equip_type_nm' ],
          [ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
          [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
          [ Sequelize.col('stdEmp.emp_cd'), 'emp_cd' ],
          [ Sequelize.col('stdEmp.emp_nm'), 'emp_nm' ],
          'reg_date',
          'insp_value',
          'insp_result_fg',
          [ Sequelize.literal(`CASE eqmInspResult.insp_result_fg WHEN TRUE THEN '합격' WHEN FALSE THEN '불합격' END`), 'insp_result_state' ],
          'remark',
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

  // // 📒 Fn[readByRegDate]: RegDate를 통하여 Raw Data Read Function
  // public readByRegDate = async(date: string) => {
  //   const result = await this.repo.findAll({ where: { reg_date: date } });
  //   return convertReadResult(result);
  // };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IEqmInspResult[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp of body) {
        const result = await this.repo.update(
          {
            emp_id: insp.emp_id ?? null,
            reg_date: insp.reg_date ?? null,
            insp_value: insp.insp_value ?? null,
            insp_result_fg: insp.insp_result_fg ?? null,
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

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.EqmInspResult.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IEqmInspResult[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp of body) {
        const result = await this.repo.update(
          {
            emp_id: insp.emp_id,
            reg_date: insp.reg_date,
            insp_value: insp.insp_value,
            insp_result_fg: insp.insp_result_fg,
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

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.EqmInspResult.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IEqmInspResult[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp of body) {
        count += await this.repo.destroy({ where: { uuid: insp.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.EqmInspResult.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion

  //#region ✅ Other Functions

  // 📒 Fn[getMaxSeq]: 성적서의 Max Sequence 조회
  /**
   * 성적서의 Max Sequence 조회
   * @param inspTypeCd 검사유형 코드
   * @param inspDetailTypeCd 세부검사유형 코드
   * @param inspReferenceId 전표 ID
   * @param transaction Transaction
   * @returns Max Sequence
   */
  getMaxSeq = async(inspTypeCd: string, inspDetailTypeCd: string, inspReferenceId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('max', Sequelize.col('seq')), 'seq' ],
        ],
        where: { 
          [Op.and]: [
            { insp_type_cd: inspTypeCd },
            { insp_detail_type_cd: inspDetailTypeCd },
            { insp_reference_id: inspReferenceId },
          ]
        },
        group: [ 'insp_type_cd', 'insp_detail_type_cd', 'insp_reference_id' ],
        transaction
      });

      if (!result) { return result; }

      const maxSeq: number = (result as any).dataValues.seq;

      return maxSeq;
    } catch (error) {
      return 0;
    }
  }

  //#endregion
}

export default EqmInspResultRepo;