import express = require('express');
import PrdOrderWorkerRepo from '../../repositories/prd/order-worker.repository';
import PrdOrderRepo from '../../repositories/prd/order.repository';
import PrdWorkRepo from '../../repositories/prd/work.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdWorkerRepo from '../../repositories/std/worker.repository';
import BaseCtl from '../base.controller';

class PrdOrderWorkerCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  repo: PrdOrderWorkerRepo;
  workRepo: PrdWorkRepo;

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(new PrdOrderWorkerRepo());
    this.workRepo = new PrdWorkRepo();

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        repo: new StdFactoryRepo(),
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'order',
        repo: new PrdOrderRepo(),
        idName: 'order_id',
        uuidName: 'order_uuid'
      },
      {
        key: 'worker',
        repo: new StdWorkerRepo(),
        idName: 'worker_id',
        uuidName: 'worker_uuid'
      }
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
    // 📌 작업지시대비 저장된 실적이 하나라도 있으면 생성 불가
    const uuids = req.body.map((data: any) => { return data.order_uuid });
    const workRead = await this.workRepo.readByOrderUuids(uuids);
    if (workRead.raws[0]) { throw new Error(`지시번호 [${workRead.raws[0].order_uuid}]의 생산실적이 이미 등록되어 있습니다.`) }
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
    // 📌 작업지시대비 저장된 실적이 하나라도 있으면 수정 불가
    const uuids = req.body.map((data: any) => { return data.uuid });
    const orderWorkerRead = await this.repo.readRawsByUuids(uuids);
    const orderIds = orderWorkerRead.raws.map((orderWorker: any) => { return orderWorker.order_id });
    const workRead = await this.workRepo.readByOrderIds(orderIds);
    if (workRead.raws[0]) { throw new Error(`지시번호 [${workRead.raws[0].order_uuid}]의 생산실적이 이미 등록되어 있습니다.`) }
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
    // 📌 작업지시대비 저장된 실적이 하나라도 있으면 수정 불가
    const uuids = req.body.map((data: any) => { return data.uuid });
    const orderWorkerRead = await this.repo.readRawsByUuids(uuids);
    const orderIds = orderWorkerRead.raws.map((orderWorker: any) => { return orderWorker.order_id });
    const workRead = await this.workRepo.readByOrderIds(orderIds);
    if (workRead.raws[0]) { throw new Error(`지시번호 [${workRead.raws[0].order_uuid}]의 생산실적이 이미 등록되어 있습니다.`) }
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
    // 📌 작업지시대비 저장된 실적이 하나라도 있으면 삭제 불가
    const uuids = req.body.map((data: any) => { return data.uuid });
    const orderWorkerRead = await this.repo.readRawsByUuids(uuids);
    const orderIds = orderWorkerRead.raws.map((orderWorker: any) => { return orderWorker.order_id });
    const workRead = await this.workRepo.readByOrderIds(orderIds);
    if (workRead.raws[0]) { throw new Error(`지시번호 [${workRead.raws[0].order_uuid}]의 생산실적이 이미 등록되어 있습니다.`) }
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

export default PrdOrderWorkerCtl;