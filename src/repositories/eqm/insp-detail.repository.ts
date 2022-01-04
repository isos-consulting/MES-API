import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import EqmInspDetail from '../../models/eqm/insp-detail.model';
import IEqmInspDetail from '../../interfaces/eqm/insp-detail.interface';

class EqmInspDetailRepo {
  repo: Repository<EqmInspDetail>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(EqmInspDetail);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IEqmInspDetail[], uid: number, transaction?: Transaction) => {
    try {
      const inspDetails = body.map((inspDetail) => {
        return {
          insp_id: inspDetail.insp_id,
          seq: inspDetail.seq,
          factory_id: inspDetail.factory_id,
          insp_item_id: inspDetail.insp_item_id,
          insp_item_desc: inspDetail.insp_item_desc,
          periodicity_fg: inspDetail.periodicity_fg,
          spec_std: inspDetail.spec_std,
          spec_min: inspDetail.spec_min,
          spec_max: inspDetail.spec_max,
          insp_tool_id: inspDetail.insp_tool_id,
          insp_method_id: inspDetail.insp_method_id,
          base_date: inspDetail.base_date,
          daily_insp_cycle_id: inspDetail.daily_insp_cycle_id,
          cycle_unit_id: inspDetail.cycle_unit_id,
          cycle: inspDetail.cycle,
          sortby: inspDetail.sortby,
          remark: inspDetail.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(inspDetails, { individualHooks: true, transaction });

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
            model: this.sequelize.models.EqmInsp, 
            attributes: [], 
            required: true, 
            where: { uuid: params.insp_uuid ? params.insp_uuid : { [Op.ne]: null } }
          },
          { 
            model: this.sequelize.models.StdInspItem, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdInspItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdInspMethod, attributes: [], required: false },
              { model: this.sequelize.models.StdInspTool, attributes: [], required: false },
            ],
          },
          { model: this.sequelize.models.StdInspMethod, attributes: [], required: false },
          { model: this.sequelize.models.StdInspTool, attributes: [], required: false },
          { model: this.sequelize.models.AdmDailyInspCycle, attributes: [], required: false },
          { model: this.sequelize.models.AdmCycleUnit, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('eqmInspDetail.uuid'), 'insp_detail_uuid' ],
          [ Sequelize.col('eqmInsp.uuid'), 'insp_uuid' ],
          'seq',
          [ Sequelize.col('eqmInsp.insp_no'), 'insp_no' ],
          [ Sequelize.fn('concat', Sequelize.col('eqmInsp.insp_no'), '-', Sequelize.col('eqmInspDetail.seq')), 'insp_no_sub' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdInspItem.stdInspItemType.uuid'), 'insp_item_type_uuid' ],
          [ Sequelize.col('stdInspItem.stdInspItemType.insp_item_type_cd'), 'insp_item_type_cd' ],
          [ Sequelize.col('stdInspItem.stdInspItemType.insp_item_type_nm'), 'insp_item_type_nm' ],
          [ Sequelize.col('stdInspItem.uuid'), 'insp_item_uuid' ],
          [ Sequelize.col('stdInspItem.insp_item_cd'), 'insp_item_cd' ],
          [ Sequelize.col('stdInspItem.insp_item_nm'), 'insp_item_nm' ],
          'insp_item_desc',
          'periodicity_fg',
          'spec_std',
          'spec_min',
          'spec_max',
          [ Sequelize.col('stdInspTool.uuid'), 'insp_tool_uuid' ],
          [ Sequelize.col('stdInspTool.insp_tool_cd'), 'insp_tool_cd' ],
          [ Sequelize.col('stdInspTool.insp_tool_nm'), 'insp_tool_nm' ],
          [ Sequelize.col('stdInspMethod.uuid'), 'insp_method_uuid' ],
          [ Sequelize.col('stdInspMethod.insp_method_cd'), 'insp_method_cd' ],
          [ Sequelize.col('stdInspMethod.insp_method_nm'), 'insp_method_nm' ],
          'base_date',
          [ Sequelize.col('admDailyInspCycle.uuid'), 'daily_insp_cycle_uuid' ],
          [ Sequelize.col('admDailyInspCycle.daily_insp_cycle_cd'), 'daily_insp_cycle_cd' ],
          [ Sequelize.col('admDailyInspCycle.daily_insp_cycle_nm'), 'daily_insp_cycle_nm' ],
          [ Sequelize.col('admCycleUnit.uuid'), 'cycle_unit_uuid' ],
          [ Sequelize.col('admCycleUnit.cycle_unit_cd'), 'cycle_unit_cd' ],
          [ Sequelize.col('admCycleUnit.cycle_unit_nm'), 'cycle_unit_nm' ],
          'cycle',
          'sortby',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { periodicity_fg: params.periodicity_fg != null ? params.periodicity_fg : { [Op.ne]: null } },
        order: [ 'factory_id', 'insp_id', 'seq', 'insp_detail_id' ],
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
          { model: this.sequelize.models.EqmInsp, attributes: [], required: true },
          { 
            model: this.sequelize.models.StdInspItem, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdInspItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdInspMethod, attributes: [], required: false },
              { model: this.sequelize.models.StdInspTool, attributes: [], required: false },
            ],
          },
          { model: this.sequelize.models.StdInspMethod, attributes: [], required: false },
          { model: this.sequelize.models.StdInspTool, attributes: [], required: false },
          { model: this.sequelize.models.AdmDailyInspCycle, attributes: [], required: false },
          { model: this.sequelize.models.AdmCycleUnit, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('eqmInspDetail.uuid'), 'insp_detail_uuid' ],
          [ Sequelize.col('eqmInsp.uuid'), 'insp_uuid' ],
          'seq',
          [ Sequelize.col('eqmInsp.insp_no'), 'insp_no' ],
          [ Sequelize.fn('concat', Sequelize.col('eqmInsp.insp_no'), '-', Sequelize.col('eqmInspDetail.seq')), 'insp_no_sub' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdInspItem.stdInspItemType.uuid'), 'insp_item_type_uuid' ],
          [ Sequelize.col('stdInspItem.stdInspItemType.insp_item_type_cd'), 'insp_item_type_cd' ],
          [ Sequelize.col('stdInspItem.stdInspItemType.insp_item_type_nm'), 'insp_item_type_nm' ],
          [ Sequelize.col('stdInspItem.uuid'), 'insp_item_uuid' ],
          [ Sequelize.col('stdInspItem.insp_item_cd'), 'insp_item_cd' ],
          [ Sequelize.col('stdInspItem.insp_item_nm'), 'insp_item_nm' ],
          'insp_item_desc',
          'periodicity_fg',
          'spec_std',
          'spec_min',
          'spec_max',
          [ Sequelize.col('stdInspTool.uuid'), 'insp_tool_uuid' ],
          [ Sequelize.col('stdInspTool.insp_tool_cd'), 'insp_tool_cd' ],
          [ Sequelize.col('stdInspTool.insp_tool_nm'), 'insp_tool_nm' ],
          [ Sequelize.col('stdInspMethod.uuid'), 'insp_method_uuid' ],
          [ Sequelize.col('stdInspMethod.insp_method_cd'), 'insp_method_cd' ],
          [ Sequelize.col('stdInspMethod.insp_method_nm'), 'insp_method_nm' ],
          'base_date',
          [ Sequelize.col('admDailyInspCycle.uuid'), 'daily_insp_cycle_uuid' ],
          [ Sequelize.col('admDailyInspCycle.daily_insp_cycle_cd'), 'daily_insp_cycle_cd' ],
          [ Sequelize.col('admDailyInspCycle.daily_insp_cycle_nm'), 'daily_insp_cycle_nm' ],
          [ Sequelize.col('admCycleUnit.uuid'), 'cycle_unit_uuid' ],
          [ Sequelize.col('admCycleUnit.cycle_unit_cd'), 'cycle_unit_cd' ],
          [ Sequelize.col('admCycleUnit.cycle_unit_nm'), 'cycle_unit_nm' ],
          'cycle',
          'sortby',
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

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IEqmInspDetail[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let inspDetail of body) {
        const result = await this.repo.update(
          {
            insp_item_desc: inspDetail.insp_item_desc ?? null,
            periodicity_fg: inspDetail.periodicity_fg ?? null,
            spec_std: inspDetail.spec_std ?? null,
            spec_min: inspDetail.spec_min ?? null,
            spec_max: inspDetail.spec_max ?? null,
            insp_tool_id: inspDetail.insp_tool_id ?? null,
            insp_method_id: inspDetail.insp_method_id ?? null,
            base_date: inspDetail.base_date ?? null,
            daily_insp_cycle_id: inspDetail.daily_insp_cycle_id ?? null,
            cycle_unit_id: inspDetail.cycle_unit_id ?? null,
            cycle: inspDetail.cycle ?? null,
            sortby: inspDetail.sortby ?? null,
            remark: inspDetail.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: inspDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.EqmInspDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IEqmInspDetail[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let inspDetail of body) {
        const result = await this.repo.update(
          {
            insp_item_desc: inspDetail.insp_item_desc,
            periodicity_fg: inspDetail.periodicity_fg,
            spec_std: inspDetail.spec_std,
            spec_min: inspDetail.spec_min,
            spec_max: inspDetail.spec_max,
            insp_tool_id: inspDetail.insp_tool_id,
            insp_method_id: inspDetail.insp_method_id,
            base_date: inspDetail.base_date,
            daily_insp_cycle_id: inspDetail.daily_insp_cycle_id,
            cycle_unit_id: inspDetail.cycle_unit_id,
            cycle: inspDetail.cycle,
            sortby: inspDetail.sortby,
            remark: inspDetail.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: inspDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.EqmInspDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IEqmInspDetail[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let inspDetail of body) {
        count += await this.repo.destroy({ where: { uuid: inspDetail.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.EqmInspDetail.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion

  //#region ✅ Other Functions

  // 📒 Fn[getMaxSeq]: 기준서단위의 Max Sequence 조회
  /**
   * 기준서단위의 Max Sequence 조회
   * @param inspId 기준서 ID
   * @param transaction Transaction
   * @returns Max Sequence
   */
  getMaxSeq = async(inspId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('max', Sequelize.col('seq')), 'seq' ],
        ],
        where: { insp_id: inspId },
        group: [ 'insp_id' ],
        transaction
      });

      if (!result) { return result; }

      const maxSeq: number = (result as any).dataValues.seq;

      return maxSeq;
    } catch (error) {
      throw error;
    }
  }

  // 📒 Fn[getCount]: 기준서단위의 상세기준서 개수 조회
  /**
   * 기준서단위의 상세기준서 개수 조회
   * @param inspId 기준서 ID
   * @param transaction Transaction
   * @returns 기준서단위의 상세전표 개수
   */
  getCountInInsp = async(inspId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('count', Sequelize.col('insp_id')), 'count' ],
        ],
        where: { insp_id: inspId },
        transaction
      });

      if (!result) { return result; }

      const count: number = (result as any).dataValues.count;

      return count;
    } catch (error) {
      throw error;
    }
  }

  //#endregion
}

export default EqmInspDetailRepo;