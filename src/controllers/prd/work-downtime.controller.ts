import express = require('express');
import ApiResult from '../../interfaces/common/api-result.interface';
import PrdWorkDowntimeRepo from '../../repositories/prd/work-downtime.repository';
import PrdWorkRoutingRepo from '../../repositories/prd/work-routing.repository';
import PrdWorkRepo from '../../repositories/prd/work.repository';
import StdDowntimeRepo from '../../repositories/std/downtime.repository';
import StdEquipRepo from '../../repositories/std/equip.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdProcRepo from '../../repositories/std/proc.repository';
import checkArray from '../../utils/checkArray';
import { getSequelize } from '../../utils/getSequelize';
import getSubtractTwoDates from '../../utils/getSubtractTwoDates';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import BaseCtl from '../base.controller';
import config from '../../configs/config';

class PrdWorkDowntimeCtl extends BaseCtl {
  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(PrdWorkDowntimeRepo);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'work',
        TRepo: PrdWorkRepo,
        idName: 'work_id',
        uuidName: 'work_uuid'
      },
      {
        key: 'workRouting',
        TRepo: PrdWorkRoutingRepo,
        idName: 'work_routing_id',
        uuidName: 'work_routing_uuid'
      },
      {
        key: 'proc',
        TRepo: StdProcRepo,
        idName: 'proc_id',
        uuidName: 'proc_uuid'
      },
      {
        key: 'equip',
        TRepo: StdEquipRepo,
        idName: 'equip_id',
        uuidName: 'equip_uuid'
      },
      {
        key: 'downtime',
        TRepo: StdDowntimeRepo,
        idName: 'downtime_id',
        uuidName: 'downtime_uuid'
      }
    ];
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdWorkDowntimeRepo(req.tenant.uuid);
      const workRepo = new PrdWorkRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      // 📌 생산실적이 완료상태일 경우 데이터 생성 불가
      const uuids = req.body.map((data: any) => { return data.work_uuid });
      const workRead = await workRepo.readRawsByUuids(uuids);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg == true) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 생성이 불가능합니다.`)} 
      });

      // 📌 시작, 종료시간이 같거나 시작시간이 더 늦을 경우 데이터 생성 불가
      req.body.forEach((data: any) => {
        if (data.start_date && data.end_date) {
          data.downtime = getSubtractTwoDates(data.start_date, data.end_date);
          if (data.downtime <= 0) { throw new Error('잘못된 시작시간(start_date) 및 종료시간(end_date)이 입력되었습니다.'); }
        }
      });

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 비가동 시간이 겹칠 수 없도록 Interlock
          if (data.equip_id && data.start_date && data.end_date) {
            const count = await repo.getCountDuplicatedTime(data.start_date, data.end_date, data.equip_id, tran);
            if (count > 0) { throw new Error('시간내에 이미 등록된 비가동 내역이 있습니다.'); }
          }

          const result = await repo.create(checkArray(data), req.user?.uid as number, tran); 
          result.raws = result.raws.concat(result.raws);
          result.count += result.count;
        }
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🔵 Read Functions

  // 📒 Fn[read] (✅ Inheritance): Default Read Function
  // public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  // 📒 Fn[readReport]: 실적현황 데이터 조회
  public readReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new PrdWorkDowntimeRepo(req.tenant.uuid);

      const params = Object.assign(req.query, req.params);

      const sort_type = params.sort_type as string;
      if (![ 'proc', 'equip', 'downtime' ].includes(sort_type)) { throw new Error('잘못된 sort_type(정렬) 입력') }

      const result = await repo.readReport(params);
      
      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🟡 Update Functions

  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdWorkDowntimeRepo(req.tenant.uuid);
      const workRepo = new PrdWorkRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
      const uuids = req.body.map((data: any) => { return data.uuid });
      const workDowntimeRead = await repo.readRawsByUuids(uuids);
      const workIds = workDowntimeRead.raws.map((workDowntime: any) => { return workDowntime.work_id });
      const workRead = await workRepo.readRawByIds(workIds);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
      });

      // 📌 시작, 종료시간이 같거나 시작시간이 더 늦을 경우 데이터 수정 불가
      req.body.forEach((data: any) => {
        if (data.start_date && data.end_date) {
          data.downtime = getSubtractTwoDates(data.start_date, data.end_date);
          if (data.downtime <= 0) { throw new Error('잘못된 시작시간(start_date) 및 종료시간(end_date)이 입력되었습니다.'); }
        }
      });

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 비가동 시간이 겹칠 수 없도록 Interlock
          if (data.equip_id && data.start_date && data.end_date) {
            const count = await repo.getCountDuplicatedTime(data.start_date, data.end_date, data.equip_id, tran);
            if (count > 0) { throw new Error('시간내에 이미 등록된 비가동 내역이 있습니다.'); }
          }

          const result = await repo.update(checkArray(data), req.user?.uid as number, tran); 
          result.raws = result.raws.concat(result.raws);
          result.count += result.count;
        }
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch] (✅ Inheritance): Default Patch Function
  public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdWorkDowntimeRepo(req.tenant.uuid);
      const workRepo = new PrdWorkRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
      const uuids = req.body.map((data: any) => { return data.uuid });
      const workDowntimeRead = await repo.readRawsByUuids(uuids);
      const workIds = workDowntimeRead.raws.map((workDowntime: any) => { return workDowntime.work_id });
      const workRead = await workRepo.readRawByIds(workIds);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
      });

      // 📌 시작, 종료시간이 같거나 시작시간이 더 늦을 경우 데이터 수정 불가
      req.body.forEach((data: any) => {
        if (data.start_date && data.end_date) {
          data.downtime = getSubtractTwoDates(data.start_date, data.end_date);
          if (data.downtime <= 0) { throw new Error('잘못된 시작시간(start_date) 및 종료시간(end_date)이 입력되었습니다.'); }
        }
      });

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 비가동 시간이 겹칠 수 없도록 Interlock
          if (data.equip_id && data.start_date && data.end_date) {
            const count = await repo.getCountDuplicatedTime(data.start_date, data.end_date, data.equip_id, tran);
            if (count > 0) { throw new Error('시간내에 이미 등록된 비가동 내역이 있습니다.'); }
          }

          const result = await repo.patch(checkArray(data), req.user?.uid as number, tran); 
          result.raws = result.raws.concat(result.raws);
          result.count += result.count;
        }
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  // public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  //#endregion

  //#endregion

  //#region ✅ Inherited Hooks

  //#region 🔵 Read Hooks

  // 📒 Fn[beforeRead] (✅ Inheritance): Read DB Tasking 이 실행되기 전 호출되는 Function
  // beforeRead = async(req: express.Request) => {}

  // 📒 Fn[afterRead] (✅ Inheritance): Read DB Tasking 이 실행된 후 호출되는 Function
  // afterRead = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🔴 Delete Hooks

  // 📒 Fn[beforeDelete] (✅ Inheritance): Delete Transaction 이 실행되기 전 호출되는 Function
  beforeDelete = async(req: express.Request) => {
    const repo = new PrdWorkDowntimeRepo(req.tenant.uuid);
    const workRepo = new PrdWorkRepo(req.tenant.uuid);

    // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
    const uuids = req.body.map((data: any) => { return data.uuid });
    const workDowntimeRead = await repo.readRawsByUuids(uuids);
    const workIds = workDowntimeRead.raws.map((workDowntime: any) => { return workDowntime.work_id });
    const workRead = await workRepo.readRawByIds(workIds);
    workRead.raws.forEach((work: any) => { 
      if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
    });
  }

  // 📒 Fn[beforeTranDelete] (✅ Inheritance): Delete Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranDelete = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranDelete] (✅ Inheritance): Delete Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranDelete = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterDelete] (✅ Inheritance): Delete Transaction 이 실행된 후 호출되는 Function
  // afterDelete = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#endregion
}

export default PrdWorkDowntimeCtl;