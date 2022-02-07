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
import PrdWorkRouting from '../../models/prd/work-routing.model';
import IPrdWorkRouting from '../../interfaces/prd/work-routing.interface';
import { readFinalQtyByWork } from '../../queries/prd/work-routing-qty-by-work.query';

class PrdWorkRoutingRepo {
  repo: Repository<PrdWorkRouting>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(PrdWorkRouting);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IPrdWorkRouting[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((workRouting: any) => {
        return this.repo.create(
          {
            factory_id: workRouting.factory_id,
            work_id: workRouting.work_id,
            proc_id: workRouting.proc_id,
            proc_no: workRouting.proc_no,
            workings_id: workRouting.workings_id,
            equip_id: workRouting.equip_id,
            mold_id: workRouting.mold_id,
            mold_cavity: workRouting.mold_cavity,
            qty: workRouting.qty,
            start_date: workRouting.start_date,
            end_date: workRouting.end_date,
            work_time: workRouting.work_time,
            ongoing_fg: workRouting.ongoing_fg,
            remark: workRouting.remark,
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
          { model: this.sequelize.models.StdProc, attributes: [], required: true },
          { model: this.sequelize.models.StdWorkings, attributes: [], required: true },
          { model: this.sequelize.models.StdEquip, attributes: [], required: false },
          { model: this.sequelize.models.MldMold, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdWorkRouting.uuid'), 'work_routing_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
          [ Sequelize.col('stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('stdProc.proc_nm'), 'proc_nm' ],
          'proc_no',
          [ Sequelize.col('stdWorkings.uuid'), 'workings_uuid' ],
          [ Sequelize.col('stdWorkings.workings_cd'), 'workings_cd' ],
          [ Sequelize.col('stdWorkings.workings_nm'), 'workings_nm' ],
          [ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
          [ Sequelize.col('mldMold.uuid'), 'mold_uuid' ],
          [ Sequelize.col('mldMold.mold_cd'), 'mold_cd' ],
          [ Sequelize.col('mldMold.mold_nm'), 'mold_nm' ],
          'mold_cavity',
          'qty',
          'start_date',
          [ Sequelize.col('prdWorkRouting.start_date'), 'start_time' ],
          'end_date',
          [ Sequelize.col('prdWorkRouting.end_date'), 'end_time' ],
          'work_time',
          'ongoing_fg',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'work_id', 'proc_no' ]
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
          { model: this.sequelize.models.PrdWork,attributes: [], required: true },
          { model: this.sequelize.models.StdProc, attributes: [], required: true },
          { model: this.sequelize.models.StdWorkings, attributes: [], required: true },
          { model: this.sequelize.models.StdEquip, attributes: [], required: false },
          { model: this.sequelize.models.StdUnitConvert,attributes: [], required: false },
          { model: this.sequelize.models.StdStore, attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, attributes: [], required: false },
          { model: this.sequelize.models.MldMold, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('prdWorkRouting.uuid'), 'work_routing_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
          [ Sequelize.col('stdProc.uuid'), 'proc_uuid' ],
          [ Sequelize.col('stdProc.proc_cd'), 'proc_cd' ],
          [ Sequelize.col('stdProc.proc_nm'), 'proc_nm' ],
          'proc_no',
          [ Sequelize.col('stdWorkings.uuid'), 'workings_uuid' ],
          [ Sequelize.col('stdWorkings.workings_cd'), 'workings_cd' ],
          [ Sequelize.col('stdWorkings.workings_nm'), 'workings_nm' ],
          [ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
          [ Sequelize.col('mldMold.uuid'), 'mold_uuid' ],
          [ Sequelize.col('mldMold.mold_cd'), 'mold_cd' ],
          [ Sequelize.col('mldMold.mold_nm'), 'mold_nm' ],
          'mold_cavity',
          'qty',
          'start_date',
          [ Sequelize.col('prdWorkRouting.start_date'), 'start_time' ],
          'end_date',
          [ Sequelize.col('prdWorkRouting.end_date'), 'end_time' ],
          'work_time',
          'ongoing_fg',
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

  // 📒 Fn[readRawsByOrderId]: 작업지시의 Id를 이용하여 Raw Data Read Function
  public readRawsByOrderId = async(workId: string, transaction?: Transaction) => {
    const result = await this.repo.findAll({ where: { work_id: workId }, transaction });
    return convertReadResult(result);
  };

  // 📒 Fn[getFinalQtyByWork]: 생산실적 기준 마지막 공정순서 생산수량 조회
  public getFinalQtyByWork = async(workId?: number) => {
    try {
      const result = await this.sequelize.query(readFinalQtyByWork(workId));

      if (!result) { return result; }

      const qty: number = (result as any).dataValues.qty;
      return qty;

    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IPrdWorkRouting[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workRouting: any) => {
        return this.repo.update(
          {
            workings_id: workRouting.workings_id ?? null,
            equip_id: workRouting.equip_id ?? null,
            mold_id: workRouting.mold_id ?? null,
            mold_cavity: workRouting.mold_cavity ?? null,
            qty: workRouting.qty ?? null,
            start_date: workRouting.start_date ?? null,
            end_date: workRouting.end_date ?? null,
            work_time: workRouting.work_time ?? null,
            ongoing_fg: workRouting.ongoing_fg ?? null,
            remark: workRouting.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: workRouting.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdWorkRouting.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IPrdWorkRouting[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workRouting: any) => {
        return this.repo.update(
          {
            workings_id: workRouting.workings_id,
            equip_id: workRouting.equip_id,
            mold_id: workRouting.mold_id,
            mold_cavity: workRouting.mold_cavity,
            qty: workRouting.qty,
            start_date: workRouting.start_date,
            end_date: workRouting.end_date,
            work_time: workRouting.work_time,
            ongoing_fg: workRouting.ongoing_fg,
            remark: workRouting.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: workRouting.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdWorkRouting.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IPrdWorkRouting[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((workRouting: any) => {
        return this.repo.destroy({ where: { uuid: workRouting.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.PrdWorkRouting.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[deleteByWorkId]: 실적 Id 기준 라우팅 리스트 삭제
  public deleteByWorkId = async(workId: number, uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await this.repo.findAll({ where: { work_id: workId }});
      
      const count = await this.repo.destroy({ where: { work_id: workId }, transaction});

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.PrdWorkRouting.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default PrdWorkRoutingRepo;