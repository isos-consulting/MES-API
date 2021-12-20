import express = require('express');
import PrdWorkWorkerRepo from '../../repositories/prd/work-worker.repository';
import PrdWorkRepo from '../../repositories/prd/work.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdWorkerRepo from '../../repositories/std/worker.repository';
import getSubtractTwoDates from '../../utils/getSubtractTwoDates';
import BaseCtl from '../base.controller';

class PrdWorkWorkerCtl extends BaseCtl {
  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(PrdWorkWorkerRepo);

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
        key: 'worker',
        TRepo: StdWorkerRepo,
        idName: 'worker_id',
        uuidName: 'worker_uuid'
      },
    ];
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  // public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {};

  //#endregion

  //#region 🔵 Read Functions

  // 📒 Fn[read] (✅ Inheritance): Default Read Function
  // public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  //#endregion

  //#region 🟡 Update Functions

  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  // public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch] (✅ Inheritance): Default Patch Function
  // public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  // public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  //#endregion

  //#endregion

  //#region ✅ Inherited Hooks

  //#region 🟢 Create Hooks

  // 📒 Fn[beforeCreate] (✅ Inheritance): Create Transaction 이 실행되기 전 호출되는 Function
  beforeCreate = async(req: express.Request) => {
    const repo = new PrdWorkWorkerRepo(req.tenant.uuid);
    const workRepo = new PrdWorkRepo(req.tenant.uuid);

    // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
    const uuids = req.body.map((data: any) => { return data.uuid });
    const workWorkerRead = await repo.readRawsByUuids(uuids);
    const workIds = workWorkerRead.raws.map((workWorker: any) => { return workWorker.work_id });
    const workRead = await workRepo.readRawByIds(workIds);
    workRead.raws.forEach((work: any) => { 
      if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
    });

    req.body.forEach((data: any) => {
      if (data.start_date && data.end_date) {
        data.work_time = getSubtractTwoDates(data.start_date, data.end_date);
        if (data.work_time <= 0) { throw new Error('잘못된 시작시간(start_date) 및 종료시간(end_date)이 입력되었습니다.'); }
      }
    });
  }

  // 📒 Fn[beforeTranCreate] (✅ Inheritance): Create Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranCreate = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranCreate] (✅ Inheritance): Create Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranCreate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterCreate] (✅ Inheritance): Create Transaction 이 실행된 후 호출되는 Function
  // afterCreate = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🔵 Read Hooks

  // 📒 Fn[beforeRead] (✅ Inheritance): Read DB Tasking 이 실행되기 전 호출되는 Function
  // beforeRead = async(req: express.Request) => {}

  // 📒 Fn[afterRead] (✅ Inheritance): Read DB Tasking 이 실행된 후 호출되는 Function
  // afterRead = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🟡 Update Hooks

  // 📒 Fn[beforeUpdate] (✅ Inheritance): Update Transaction 이 실행되기 전 호출되는 Function
  beforeUpdate = async(req: express.Request) => {
    const repo = new PrdWorkWorkerRepo(req.tenant.uuid);
    const workRepo = new PrdWorkRepo(req.tenant.uuid);

    // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
    const uuids = req.body.map((data: any) => { return data.uuid });
    const workWorkerRead = await repo.readRawsByUuids(uuids);
    const workIds = workWorkerRead.raws.map((workWorker: any) => { return workWorker.work_id });
    const workRead = await workRepo.readRawByIds(workIds);
    workRead.raws.forEach((work: any) => { 
      if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
    });


    req.body.forEach((data: any) => {
      if (data.start_date && data.end_date) {
        data.work_time = getSubtractTwoDates(data.start_date, data.end_date);
        if (data.work_time <= 0) { throw new Error('잘못된 시작시간(start_date) 및 종료시간(end_date)이 입력되었습니다.'); }
      }
    });
  }

  // 📒 Fn[beforeTranUpdate] (✅ Inheritance): Update Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranUpdate = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranUpdate] (✅ Inheritance): Update Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranUpdate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterUpdate] (✅ Inheritance): Update Transaction 이 실행된 후 호출되는 Function
  // afterUpdate = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🟠 Patch Hooks

  // 📒 Fn[beforePatch] (✅ Inheritance): Patch Transaction 이 실행되기 전 호출되는 Function
  beforePatch = async(req: express.Request) => {
    const repo = new PrdWorkWorkerRepo(req.tenant.uuid);
    const workRepo = new PrdWorkRepo(req.tenant.uuid);

    // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
    const uuids = req.body.map((data: any) => { return data.uuid });
    const workWorkerRead = await repo.readRawsByUuids(uuids);
    const workIds = workWorkerRead.raws.map((workWorker: any) => { return workWorker.work_id });
    const workRead = await workRepo.readRawByIds(workIds);
    workRead.raws.forEach((work: any) => { 
      if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
    });


    req.body.forEach((data: any) => {
      if (data.start_date && data.end_date) {
        data.work_time = getSubtractTwoDates(data.start_date, data.end_date);
        if (data.work_time <= 0) { throw new Error('잘못된 시작시간(start_date) 및 종료시간(end_date)이 입력되었습니다.'); }
      }
    });
  }

  // 📒 Fn[beforeTranPatch] (✅ Inheritance): Patch Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranPatch = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranPatch] (✅ Inheritance): Patch Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranPatch = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterPatch] (✅ Inheritance): Patch Transaction 이 실행된 후 호출되는 Function
  // afterPatch = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🔴 Delete Hooks

  // 📒 Fn[beforeDelete] (✅ Inheritance): Delete Transaction 이 실행되기 전 호출되는 Function
  beforeDelete = async(req: express.Request) => {
    const repo = new PrdWorkWorkerRepo(req.tenant.uuid);
    const workRepo = new PrdWorkRepo(req.tenant.uuid);

    // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
    const uuids = req.body.map((data: any) => { return data.uuid });
    const workWorkerRead = await repo.readRawsByUuids(uuids);
    const workIds = workWorkerRead.raws.map((workWorker: any) => { return workWorker.work_id });
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

export default PrdWorkWorkerCtl;