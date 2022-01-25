import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';
import QmsInspDetail from '../../models/qms/insp-detail.model';
import IQmsInspDetail from '../../interfaces/qms/insp-detail.interface';

class QmsInspDetailRepo {
  repo: Repository<QmsInspDetail>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(QmsInspDetail);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IQmsInspDetail[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((inspDetail: any) => {
        return this.repo.create(
          {
            insp_id: inspDetail.insp_id,
            seq: inspDetail.seq,
            factory_id: inspDetail.factory_id,
            insp_item_id: inspDetail.insp_item_id,
            insp_item_desc: inspDetail.insp_item_desc,
            spec_std: inspDetail.spec_std,
            spec_min: inspDetail.spec_min,
            spec_max: inspDetail.spec_max,
            insp_method_id: inspDetail.insp_method_id,
            insp_tool_id: inspDetail.insp_tool_id,
            sortby: inspDetail.sortby,
            position_no: inspDetail.position_no,
            special_property: inspDetail.special_property,
            worker_sample_cnt: inspDetail.worker_sample_cnt,
            worker_insp_cycle: inspDetail.worker_insp_cycle,
            inspector_sample_cnt: inspDetail.inspector_sample_cnt,
            inspector_insp_cycle: inspDetail.inspector_insp_cycle,
            remark: inspDetail.remark,
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
            where: { uuid: params.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
          },
          { 
            model: this.sequelize.models.QmsInsp, 
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
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInspDetail.uuid'), 'insp_detail_uuid' ],
          [ Sequelize.col('qmsInsp.uuid'), 'insp_uuid' ],
          'seq',
          [ Sequelize.col('qmsInsp.insp_no'), 'insp_no' ],
          [ Sequelize.fn('concat', Sequelize.col('qmsInsp.insp_no'), '-', Sequelize.col('qmsInspDetail.seq')), 'insp_no_sub' ],
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
          'spec_std',
          'spec_min',
          'spec_max',
          [ Sequelize.col('stdInspMethod.uuid'), 'insp_method_uuid' ],
          [ Sequelize.col('stdInspMethod.insp_method_cd'), 'insp_method_cd' ],
          [ Sequelize.col('stdInspMethod.insp_method_nm'), 'insp_method_nm' ],
          [ Sequelize.col('stdInspTool.uuid'), 'insp_tool_uuid' ],
          [ Sequelize.col('stdInspTool.insp_tool_cd'), 'insp_tool_cd' ],
          [ Sequelize.col('stdInspTool.insp_tool_nm'), 'insp_tool_nm' ],
          'sortby',
          'position_no',
          'special_property',
          'worker_sample_cnt',
          'worker_insp_cycle',
          'inspector_sample_cnt',
          'inspector_insp_cycle',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: {
          [Op.and]: [
            params.worker_fg ? { worker_sample_cnt: { [Op.gt]: 0 } } : {},
            params.inspector_fg ? { inspector_sample_cnt: { [Op.gt]: 0 } } : {}
          ]
        },
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
          { model: this.sequelize.models.QmsInsp, attributes: [], required: true },
          { 
            model: this.sequelize.models.StdInspItem, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdInspItemType, attributes: [], required: false },
            ],
          },
          { model: this.sequelize.models.StdInspMethod, attributes: [], required: false },
          { model: this.sequelize.models.StdInspTool, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInspDetail.uuid'), 'insp_detail_uuid' ],
          [ Sequelize.col('qmsInsp.uuid'), 'insp_uuid' ],
          'seq',
          [ Sequelize.fn('concat', Sequelize.col('qmsInsp.insp_no'), '-', Sequelize.col('qmsInspDetail.seq')), 'insp_no_sub' ],
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
          'spec_std',
          'spec_min',
          'spec_max',
          [ Sequelize.col('stdInspMethod.uuid'), 'insp_method_uuid' ],
          [ Sequelize.col('stdInspMethod.insp_method_cd'), 'insp_method_cd' ],
          [ Sequelize.col('stdInspMethod.insp_method_nm'), 'insp_method_nm' ],
          [ Sequelize.col('stdInspTool.uuid'), 'insp_tool_uuid' ],
          [ Sequelize.col('stdInspTool.insp_tool_cd'), 'insp_tool_cd' ],
          [ Sequelize.col('stdInspTool.insp_tool_nm'), 'insp_tool_nm' ],
          'sortby',
          'position_no',
          'special_property',
          'worker_sample_cnt',
          'worker_insp_cycle',
          'inspector_sample_cnt',
          'inspector_insp_cycle',
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
  public update = async(body: IQmsInspDetail[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((inspDetail: any) => {
        return this.repo.update(
          {
            insp_item_desc: inspDetail.insp_item_desc ?? null,
            spec_std: inspDetail.spec_std ?? null,
            spec_min: inspDetail.spec_min ?? null,
            spec_max: inspDetail.spec_max ?? null,
            insp_method_id: inspDetail.insp_method_id ?? null,
            insp_tool_id: inspDetail.insp_tool_id ?? null,
            sortby: inspDetail.sortby ?? null,
            position_no: inspDetail.position_no ?? null,
            special_property: inspDetail.special_property ?? null,
            worker_sample_cnt: inspDetail.worker_sample_cnt ?? null,
            worker_insp_cycle: inspDetail.worker_insp_cycle ?? null,
            inspector_sample_cnt: inspDetail.inspector_sample_cnt ?? null,
            inspector_insp_cycle: inspDetail.inspector_insp_cycle ?? null,
            remark: inspDetail.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: inspDetail.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.QmsInspDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IQmsInspDetail[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((inspDetail: any) => {
        return this.repo.update(
          {
            insp_item_desc: inspDetail.insp_item_desc,
            spec_std: inspDetail.spec_std,
            spec_min: inspDetail.spec_min,
            spec_max: inspDetail.spec_max,
            insp_method_id: inspDetail.insp_method_id,
            insp_tool_id: inspDetail.insp_tool_id,
            sortby: inspDetail.sortby,
            position_no: inspDetail.position_no,
            special_property: inspDetail.special_property,
            worker_sample_cnt: inspDetail.worker_sample_cnt,
            worker_insp_cycle: inspDetail.worker_insp_cycle,
            inspector_sample_cnt: inspDetail.inspector_sample_cnt,
            inspector_insp_cycle: inspDetail.inspector_insp_cycle,
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
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.QmsInspDetail.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IQmsInspDetail[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((inspDetail: any) => {
        return this.repo.destroy({ where: { uuid: inspDetail.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.QmsInspDetail.getTableName() as string, previousRaws, uid, transaction);
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
  getCount = async(inspId: number, transaction?: Transaction) => {
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

export default QmsInspDetailRepo;