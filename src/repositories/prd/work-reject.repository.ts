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
import PrdWorkReject from '../../models/prd/work-reject.model';
import IPrdWorkReject from '../../interfaces/prd/work-reject.interface';
import { readWorkRejectReport } from '../../queries/prd/work-reject-report.query';
import { readWorkRejectsByWork } from '../../queries/prd/work-reject-by-work.query';
import { readFinalRejectQtyByWork } from '../../queries/prd/work-reject-qty-by-work.query';

class PrdWorkRejectRepo {
  repo: Repository<PrdWorkReject>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(PrdWorkReject);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IPrdWorkReject[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((workReject: any) => {
        return this.repo.create(
          {
            factory_id: workReject.factory_id,
            work_id: workReject.work_id,
            work_routing_id: workReject.work_routing_id,
            reject_id: workReject.reject_id,
            qty: workReject.qty,
            to_store_id: workReject.to_store_id,
            to_location_id: workReject.to_location_id,
            remark: workReject.remark,
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
            where: params.factory_uuid ? { uuid: params.factory_uuid } : {}
          },
          { 
            model: this.sequelize.models.PrdWork,
            attributes: [], 
            required: true,
            where: params.work_uuid ? { uuid: params.work_uuid } : {}
          },
          { 
            model: this.sequelize.models.PrdWorkRouting, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdProc, attributes: [], required: false },
              { model: this.sequelize.models.StdWorkings, attributes: [], required: false },
              { model: this.sequelize.models.StdEquip, attributes: [], required: false },
            ],
            where: params.work_routing_uuid ? { uuid: params.work_routing_uuid } : {}
          },
          { 
            model: this.sequelize.models.StdReject,
            attributes: [],
            required: true,
            include: [{ 
              model: this.sequelize.models.StdRejectType,
              attributes: [],
              required: false,
              where: params.reject_type_uuid ? { uuid: params.reject_type_uuid } : {}
            }],
            where: params.reject_uuid ? { uuid: params.reject_uuid } : {}
          },
          { model: this.sequelize.models.StdStore, attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdWorkReject.uuid'), 'work_reject_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
          [ Sequelize.col('prdWorkRouting.uuid'), 'work_routing_uuid' ],
          [ Sequelize.col('prdWorkRouting.proc_no'), 'proc_no' ],
          [ Sequelize.col('prdWorkRouting.stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('prdWorkRouting.stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('prdWorkRouting.stdProc.proc_nm'), 'proc_nm' ],
          [ Sequelize.col('prdWorkRouting.stdWorkings.uuid'), 'workings_uuid' ],
          [ Sequelize.col('prdWorkRouting.stdWorkings.workings_cd'), 'workings_cd' ],
          [ Sequelize.col('prdWorkRouting.stdWorkings.workings_nm'), 'workings_nm' ],
          [ Sequelize.col('prdWorkRouting.stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('prdWorkRouting.stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('prdWorkRouting.stdEquip.equip_nm'), 'equip_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
          'qty',
          [ Sequelize.col('stdStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'to_location_nm' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'work_id', Sequelize.col('stdReject.reject_type_id') ]
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
          { model: this.sequelize.models.PrdWork, attributes: [], required: true },
          { 
            model: this.sequelize.models.PrdWorkRouting, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdProc, attributes: [], required: false },
              { model: this.sequelize.models.StdWorkings, attributes: [], required: false },
              { model: this.sequelize.models.StdEquip, attributes: [], required: false },
            ]
          },
          { 
            model: this.sequelize.models.StdReject,
            attributes: [],
            required: true,
            include: [{ model: this.sequelize.models.StdRejectType, attributes: [], required: false }]
          },
          { model: this.sequelize.models.StdStore, attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdWorkReject.uuid'), 'work_reject_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
          [ Sequelize.col('prdWorkRouting.uuid'), 'work_routing_uuid' ],
          [ Sequelize.col('prdWorkRouting.proc_no'), 'proc_no' ],
          [ Sequelize.col('prdWorkRouting.stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('prdWorkRouting.stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('prdWorkRouting.stdProc.proc_nm'), 'proc_nm' ],
          [ Sequelize.col('prdWorkRouting.stdWorkings.uuid'), 'workings_uuid' ],
          [ Sequelize.col('prdWorkRouting.stdWorkings.workings_cd'), 'workings_cd' ],
          [ Sequelize.col('prdWorkRouting.stdWorkings.workings_nm'), 'workings_nm' ],
          [ Sequelize.col('prdWorkRouting.stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('prdWorkRouting.stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('prdWorkRouting.stdEquip.equip_nm'), 'equip_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
          'qty',
          [ Sequelize.col('stdStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'to_location_nm' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where : { uuid }
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

  // 📒 Fn[readRawsByWorkId]: 생산실적의 Id를 이용하여 Raw Data Read Function
  public readRawsByWorkId = async(workId: number, transaction?: Transaction) => {
    const result = await this.repo.findAll({ 
      include: [
        { model: this.sequelize.models.PrdWork, attributes: [], required: true },
      ],
      attributes: [
        [ Sequelize.col('prdWorkReject.work_reject_id'), 'work_reject_id' ],
        [ Sequelize.col('prdWorkReject.factory_id'), 'factory_id' ],
        [ Sequelize.col('prdWorkReject.reject_id'), 'reject_id' ],
        [ Sequelize.col('PrdWork.prod_id'), 'prod_id' ],
        [ Sequelize.col('prdWork.lot_no'), 'lot_no' ],
        [ Sequelize.col('prdWorkReject.qty'), 'qty' ],
        [ Sequelize.col('prdWorkReject.to_store_id'), 'to_store_id' ],
        [ Sequelize.col('prdWorkReject.to_location_id'), 'to_location_id' ],
      ], 
      where: { work_id: workId }, transaction });
    return convertReadResult(result);
  };

  // 📒 Fn[readReport]: Read Order Repot Function
  public readReport = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readWorkRejectReport(params));
      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };
  // 📒 Fn[readByWork]: 생산실적 기준 공정별 부적합 List 및 현재 등록되어있는 부적합 조회
  public readByWork = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readWorkRejectsByWork(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[getFinalRejectQtyByWork]: 생산실적 기준 마지막 공정 부적합수량 조회
  public getFinalRejectQtyByWork = async(params?: any, transaction?: Transaction) => {
    try {
      const result = await this.sequelize.query(readFinalRejectQtyByWork(params));

      if (!result) { return result; }

      const qty: number = convertReadResult(result[0]).raws[0].qty ?? 0;
      return qty;

    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[getTotalRejectQtyByWork]: 생산실적 기준 전체공정 부적합수량(합계) 조회
  /**
   * 전표단위의 상세전표 개수 조회
   * @param returnId 전표 ID
   * @param transaction Transaction
   * @returns 전표단위의 상세전표 개수
   */
  getTotalRejectQtyByWork = async(workId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('sum', Sequelize.col('qty')), 'qty' ],
        ],
        where: { work_id: workId },
        transaction
      });

      if (!result) { return result; }

      const qty: number = (result as any).dataValues.qty ?? 0;
      return qty;
      
    } catch (error) {
      throw error;
    }
  }

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IPrdWorkReject[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workReject: any) => {
        return this.repo.update(
          {
            qty: workReject.qty ?? null,
            remark: workReject.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: workReject.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdWorkReject.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IPrdWorkReject[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workReject: any) => {
        return this.repo.update(
          {
            qty: workReject.qty,
            remark: workReject.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: workReject.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdWorkReject.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IPrdWorkReject[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workReject: any) => {
        return this.repo.destroy({ where: { uuid: workReject.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.PrdWorkReject.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[deleteByWorkId]: 생산실적 Id 기준 데이터 삭제
  public deleteByWorkId = async(workId: number, uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await this.repo.findAll({ where: { work_id: workId } })

      const count = await this.repo.destroy({ where: { work_id: workId }, transaction});

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.PrdWorkReject.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default PrdWorkRejectRepo;