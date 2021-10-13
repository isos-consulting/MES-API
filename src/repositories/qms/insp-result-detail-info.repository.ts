import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import QmsInspResultDetailInfo from '../../models/qms/insp-result-detail-info.model';
import IQmsInspResultDetailInfo from '../../interfaces/qms/insp-result-detail-info.interface';

class QmsInspResultDetailInfoRepo {
repo: Repository<QmsInspResultDetailInfo>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(QmsInspResultDetailInfo);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IQmsInspResultDetailInfo[], uid: number, transaction?: Transaction) => {
    try {
      const inspDetailInfo = body.map((inspDetailInfo) => {
        return {
          factory_id: inspDetailInfo.factory_id,
          insp_result_id: inspDetailInfo.insp_result_id,
          insp_detail_id: inspDetailInfo.insp_detail_id,
          insp_result_fg: inspDetailInfo.insp_result_fg,
          remark: inspDetailInfo.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(inspDetailInfo, { individualHooks: true, transaction });

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
          { model: sequelize.models.StdFactory, attributes: [], required: true },
          { 
            model: sequelize.models.QmsInspResult,
            attributes: [], 
            required: true,
            where: { uuid: params.insp_result_uuid }
          },
          { 
            model: sequelize.models.QmsInspDetail,
            attributes: [], 
            required: true,
            include: [
              { model: sequelize.models.StdInspMethod, attributes: [], required: false },
              { model: sequelize.models.StdInspTool, attributes: [], required: false },
              { 
                model: sequelize.models.StdInspItem, 
                attributes: [], 
                required: true,
                include: [
                  { model: sequelize.models.StdInspItemType, attributes: [], required: false },
                ] 
              },
            ],
            where: {
              [Op.and]: [
                params.worker_fg ? { worker_sample_cnt: { [Op.gt]: 0 } } : {},
                params.inspector_fg ? { inspector_sample_cnt: { [Op.gt]: 0 } } : {}
              ]
            }
          },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInspResultDetailInfo.uuid'), 'insp_result_detail_info_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('qmsInspResult.uuid'), 'insp_result_uuid' ],
          [ Sequelize.col('qmsInspDetail.uuid'), 'insp_detail_uuid' ],
          [ Sequelize.col('qmsInspDetail.stdInspItem.stdInspItemType.uuid'), 'insp_item_type_uuid' ],
          [ Sequelize.col('qmsInspDetail.stdInspItem.stdInspItemType.insp_item_type_cd'), 'insp_item_type_cd' ],
          [ Sequelize.col('qmsInspDetail.stdInspItem.stdInspItemType.insp_item_type_nm'), 'insp_item_type_nm' ],
          [ Sequelize.col('qmsInspDetail.stdInspItem.uuid'), 'insp_item_uuid' ],
          [ Sequelize.col('qmsInspDetail.stdInspItem.insp_item_cd'), 'insp_item_cd' ],
          [ Sequelize.col('qmsInspDetail.stdInspItem.insp_item_nm'), 'insp_item_nm' ],
          [ Sequelize.col('qmsInspDetail.insp_item_desc'), 'insp_item_desc' ],
          [ Sequelize.col('qmsInspDetail.spec_std'), 'spec_std' ],
          [ Sequelize.col('qmsInspDetail.spec_min'), 'spec_min' ],
          [ Sequelize.col('qmsInspDetail.spec_max'), 'spec_max' ],
          [ Sequelize.col('qmsInspDetail.stdInspMethod.uuid'), 'insp_method_uuid' ],
          [ Sequelize.col('qmsInspDetail.stdInspMethod.insp_method_cd'), 'insp_method_cd' ],
          [ Sequelize.col('qmsInspDetail.stdInspMethod.insp_method_nm'), 'insp_method_nm' ],
          [ Sequelize.col('qmsInspDetail.stdInspTool.uuid'), 'insp_tool_uuid' ],
          [ Sequelize.col('qmsInspDetail.stdInspTool.insp_tool_cd'), 'insp_tool_cd' ],
          [ Sequelize.col('qmsInspDetail.stdInspTool.insp_tool_nm'), 'insp_tool_nm' ],
          [ Sequelize.col('qmsInspDetail.worker_sample_cnt'), 'worker_sample_cnt' ],
          [ Sequelize.col('qmsInspDetail.worker_insp_cycle'), 'worker_insp_cycle' ],
          [ Sequelize.col('qmsInspDetail.inspector_sample_cnt'), 'inspector_sample_cnt' ],
          [ Sequelize.col('qmsInspDetail.inspector_insp_cycle'), 'inspector_insp_cycle' ],
          [ Sequelize.col('qmsInspDetail.sortby'), 'sortby' ],
          'insp_result_fg',
          [ Sequelize.literal(`CASE WHEN qmsInspResultDetailInfo.insp_result_fg = TRUE THEN '합격' ELSE '불합격' END`), 'insp_result_state' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'insp_result_id', Sequelize.col('qmsInspDetail.sortby') ]
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.repo.findAll({ 
        include: [
          { model: sequelize.models.StdFactory, attributes: [], required: true },
          { model: sequelize.models.QmsInspResult,attributes: [], required: true },
          { 
            model: sequelize.models.QmsInspDetail,
            attributes: [], 
            required: true,
            include: [
              { model: sequelize.models.StdInspMethod, attributes: [], required: false },
              { model: sequelize.models.StdInspTool, attributes: [], required: false },
              { 
                model: sequelize.models.StdInspItem, 
                attributes: [], 
                required: true,
                include: [
                  { model: sequelize.models.StdInspItemType, attributes: [], required: false },
                ] 
              },
            ]
          },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInspResultDetailInfo.uuid'), 'insp_result_detail_info_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('qmsInspResult.uuid'), 'insp_result_uuid' ],
          [ Sequelize.col('qmsInspDetail.uuid'), 'insp_detail_uuid' ],
          [ Sequelize.col('qmsInspDetail.stdInspItem.stdInspItemType.uuid'), 'insp_item_type_uuid' ],
          [ Sequelize.col('qmsInspDetail.stdInspItem.stdInspItemType.insp_item_type_cd'), 'insp_item_type_cd' ],
          [ Sequelize.col('qmsInspDetail.stdInspItem.stdInspItemType.insp_item_type_nm'), 'insp_item_type_nm' ],
          [ Sequelize.col('qmsInspDetail.stdInspItem.uuid'), 'insp_item_uuid' ],
          [ Sequelize.col('qmsInspDetail.stdInspItem.insp_item_cd'), 'insp_item_cd' ],
          [ Sequelize.col('qmsInspDetail.stdInspItem.insp_item_nm'), 'insp_item_nm' ],
          [ Sequelize.col('qmsInspDetail.insp_item_desc'), 'insp_item_desc' ],
          [ Sequelize.col('qmsInspDetail.spec_std'), 'spec_std' ],
          [ Sequelize.col('qmsInspDetail.spec_min'), 'spec_min' ],
          [ Sequelize.col('qmsInspDetail.spec_max'), 'spec_max' ],
          [ Sequelize.col('qmsInspDetail.stdInspMethod.uuid'), 'insp_method_uuid' ],
          [ Sequelize.col('qmsInspDetail.stdInspMethod.insp_method_cd'), 'insp_method_cd' ],
          [ Sequelize.col('qmsInspDetail.stdInspMethod.insp_method_nm'), 'insp_method_nm' ],
          [ Sequelize.col('qmsInspDetail.stdInspTool.uuid'), 'insp_tool_uuid' ],
          [ Sequelize.col('qmsInspDetail.stdInspTool.insp_tool_cd'), 'insp_tool_cd' ],
          [ Sequelize.col('qmsInspDetail.stdInspTool.insp_tool_nm'), 'insp_tool_nm' ],
          [ Sequelize.col('qmsInspDetail.worker_sample_cnt'), 'worker_sample_cnt' ],
          [ Sequelize.col('qmsInspDetail.worker_insp_cycle'), 'worker_insp_cycle' ],
          [ Sequelize.col('qmsInspDetail.inspector_sample_cnt'), 'inspector_sample_cnt' ],
          [ Sequelize.col('qmsInspDetail.inspector_insp_cycle'), 'inspector_insp_cycle' ],
          [ Sequelize.col('qmsInspDetail.sortby'), 'sortby' ],
          'insp_result_fg',
          [ Sequelize.literal(`CASE WHEN qmsInspResultDetailInfo.insp_result_fg = TRUE THEN '합격' ELSE '불합격' END`), 'insp_result_state' ],
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

  // 📒 Fn[readByResultId]: 성적서 Id 를 통하여 성적서세부정보 조회
  public readByResultId = async(id: number) => {
    const result = await this.repo.findAll({ where: { insp_result_id: id } });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IQmsInspResultDetailInfo[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let inspDetailInfo of body) {
        const result = await this.repo.update(
          {
            insp_result_fg: inspDetailInfo.insp_result_fg != null ? inspDetailInfo.insp_result_fg : null,
            remark: inspDetailInfo.remark != null ? inspDetailInfo.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: inspDetailInfo.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.QmsInspResultDetailInfo.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IQmsInspResultDetailInfo[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let inspDetailInfo of body) {
        const result = await this.repo.update(
          {
            insp_result_fg: inspDetailInfo.insp_result_fg,
            remark: inspDetailInfo.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: inspDetailInfo.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.QmsInspResultDetailInfo.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IQmsInspResultDetailInfo[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let inspDetailInfo of body) {
        count += await this.repo.destroy({ where: { uuid: inspDetailInfo.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.QmsInspResultDetailInfo.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
  
  // 📒 Fn[deleteByResultIds]: 성적서 Id 를 통하여 Delete
  public deleteByResultIds = async(ids: number[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await this.repo.findAll({ where: { insp_result_id: ids }, transaction});

      count = await this.repo.destroy({ where: { insp_result_id: ids }, transaction});

      await new AdmLogRepo().create('delete', sequelize.models.QmsInspResultDetailInfo.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default QmsInspResultDetailInfoRepo;