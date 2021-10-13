import express = require('express');
import ApiResult from '../../interfaces/common/api-result.interface';
import sequelize from '../../models';
import PrdOrderInputRepo from '../../repositories/prd/order-input.repository';
import PrdOrderRoutingRepo from '../../repositories/prd/order-routing.repository';
import PrdOrderWorkerRepo from '../../repositories/prd/order-worker.repository';
import PrdOrderRepo from '../../repositories/prd/order.repository';
import PrdWorkRepo from '../../repositories/prd/work.repository';
import SalOrderDetailRepo from '../../repositories/sal/order-detail.repository';
import StdBomRepo from '../../repositories/std/bom.repository';
import StdEquipRepo from '../../repositories/std/equip.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdProcRepo from '../../repositories/std/proc.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdRoutingRepo from '../../repositories/std/routing.repository';
import StdShiftRepo from '../../repositories/std/shift.repository';
import StdWorkerGroupWorkerRepo from '../../repositories/std/worker-group-worker.repository';
import StdWorkerGroupRepo from '../../repositories/std/worker-group.repository';
import StdWorkingsRepo from '../../repositories/std/workings.repository';
import checkArray from '../../utils/checkArray';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import unsealArray from '../../utils/unsealArray';
import AdmPatternHistoryCtl from '../adm/pattern-history.controller';
import BaseCtl from '../base.controller';

class PrdOrderCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  repo: PrdOrderRepo;
  inputRepo: PrdOrderInputRepo;
  workerRepo: PrdOrderWorkerRepo;
  routingRepo: PrdOrderRoutingRepo;
  workerGroupWorkerRepo: StdWorkerGroupWorkerRepo;
  workRepo: PrdWorkRepo;
  bomRepo: StdBomRepo;
  stdRoutingRepo: StdRoutingRepo;

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(new PrdOrderRepo());
    this.inputRepo = new PrdOrderInputRepo();
    this.workerRepo = new PrdOrderWorkerRepo();
    this.routingRepo = new PrdOrderRoutingRepo();
    this.workerGroupWorkerRepo = new StdWorkerGroupWorkerRepo();
    this.workRepo = new PrdWorkRepo();
    this.bomRepo = new StdBomRepo();
    this.stdRoutingRepo = new StdRoutingRepo();


    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'uuid',
        repo: new PrdOrderRepo(),
        idName: 'order_id',
        uuidName: 'uuid'
      },
      {
        key: 'order',
        repo: new PrdOrderRepo(),
        idName: 'order_id',
        uuidName: 'order_uuid'
      },
      {
        key: 'factory',
        repo: new StdFactoryRepo(),
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'proc',
        repo: new StdProcRepo(),
        idName: 'proc_id',
        uuidName: 'proc_uuid'
      },
      {
        key: 'workings',
        repo: new StdWorkingsRepo(),
        idName: 'workings_id',
        uuidName: 'workings_uuid'
      },
      {
        key: 'equip',
        repo: new StdEquipRepo(),
        idName: 'equip_id',
        uuidName: 'equip_uuid'
      },
      {
        key: 'prod',
        repo: new StdProdRepo(),
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'shift',
        repo: new StdShiftRepo(),
        idName: 'shift_id',
        uuidName: 'shift_uuid'
      },
      {
        key: 'worker_group',
        repo: new StdWorkerGroupRepo(),
        idName: 'worker_group_id',
        uuidName: 'worker_group_uuid'
      },
      {
        key: 'salOrderDetail',
        repo: new SalOrderDetailRepo(),
        idAlias: 'sal_order_detail_id',
        idName: 'order_detail_id',
        uuidName: 'sal_order_detail_uuid'
      }
    ];
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      this.result = { raws: [], count: 0 };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 전표번호가 수기 입력되지 않고 자동발행 Option일 경우 번호 자동발행
          if (!data.order_no) { 
            data.order_no = await new AdmPatternHistoryCtl().getPattern({
              factory_id: data.factory_id,
              table_nm: 'PRD_ORDER_TB',
              col_nm: 'order_no',
              reg_date: data.reg_date,
              shift_uuid: data.shift_uuid,
              proc_uuid: data.proc_uuid,
              equip_uuid: data.equip_uuid,
              uid: req.user?.uid as number,
              tran: tran
            });
          }

          // 📌 작업지시 데이터 생성
          const orderResult = await this.repo.create(checkArray(data), req.user?.uid as number, tran);
          const order = unsealArray(orderResult.raws);

          // 📌 지시별 품목 투입정보 초기 데이터 생성 (BOM 하위품목 조회 후 생성)
          const bomRead = await this.bomRepo.readByParent(order.factory_id, order.prod_id);
          const inputBody = bomRead.raws.map((raw: any) => {
            return {
              factory_id: raw.factory_id,
              order_id: order.order_id,
              prod_id: raw.c_prod_id,
              c_usage: raw.c_usage,
              unit_id: raw.unit_id,
              from_store_id: raw.from_store_id,
              from_location_id: raw.from_location_id
            }
          });
          const inputResult = await this.inputRepo.create(inputBody, req.user?.uid as number, tran);
          this.result.count += inputResult.count;

          // 📌 지시별 작업조 입력 시 작업조 하위 작업자 초기 데이터 생성
          let workerResult: ApiResult<any> = { raws: [], count: 0 };
          if (order.worker_group_id) {
            const workerRead = await this.workerGroupWorkerRepo.readWorkerInGroup(order.worker_group_id);
            const workerBody = workerRead.raws.map((raw: any) => {
              return {
                factory_id: raw.factory_id,
                order_id: order.order_id,
                worker_id: raw.worker_id
              }
            });
            workerResult = await this.workerRepo.create(workerBody, req.user?.uid as number, tran);
            this.result.count += workerResult.count;
          }

          // 📌 지시별 하위 공정순서 정보 초기 데이터 생성
          const routingParams = {
            factory_id : order.factory_id,
            prod_id: order.prod_id
          }
          const routingRead = await this.stdRoutingRepo.readOptionallyMove(routingParams);
          const routingBody = routingRead.raws.map((raw: any) => {
            return {
              factory_id: raw.factory_id,
              order_id: order.order_id,
              proc_id: raw.proc_id,
              proc_no: raw.proc_no,
              workings_id: order.workings_id
            }
          });
          const routingResult = await this.routingRepo.create(routingBody, req.user?.uid as number, tran);
          this.result.count += routingResult.count;

          this.result.raws.push({
            order: order,
            input: inputResult.raws,
            worker: workerResult.raws,
            routing: routingResult.raws
          });
        }
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🔵 Read Functions

  // 📒 Fn[read] (✅ Inheritance): Default Read Function
  // public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  //#endregion

  //#region 🟡 Update Functions

  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      const orderUuids: string[] = [];

      // 📌 지시대비 실적이 저장된 경우 수정되면 안되는 데이터를 수정 할 때의 Interlock
      req.body.forEach((data: any) => {
        if (Object.keys(data).includes('order_no' || 'workings_id' || 'equip_id' || 'qty' || 'seq' || 'shift_id')) {
          orderUuids.push(data.order_uuid);
        }
      });
      const workRead = await this.workRepo.readByOrderUuids(orderUuids);
      if (workRead.raws[0]) { throw new Error(`지시번호 [${workRead.raws[0].order_uuid}]의 생산실적이 이미 등록되어 있습니다.`) }

      await sequelize.transaction(async(tran) => { 
        this.result = await this.repo.update(req.body, req.user?.uid as number, tran); 
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  // 📒 Fn[updateComplete]: 완료여부(complete_fg) 수정
  public updateComplete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = checkArray(req.body);

      // 📌 생산실적이 진행 중일 경우 완료여부 true 로 변경 불가 Interlock
      for await (const data of req.body) {
        // 📌 완료여부를 false(마감 취소)로 수정 할 경우 Interlock 없음
        if (data.complete_fg == false) { continue; }

        // 📌 완료일시를 입력하지 않았을 경우 현재일시로 입력
        if (!data.complete_date) { data.complete_date = new Date(); }

        const orderRead = await this.repo.readRawByUuid(data.uuid);
        const order = unsealArray(orderRead.raws);
        if (order.work_fg == true) { throw new Error(`지시번호 [${data.uuid}]의 생산실적이 진행중입니다.`)}
      }

      await sequelize.transaction(async(tran) => { 
        this.result = await this.repo.updateComplete(req.body, req.user?.uid as number, tran); 
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  // 📒 Fn[updateWorkerGroup]: 작업조(worker_group) 수정
  public updateWorkerGroup = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      this.result = { raws: [], count: 0 };

      // 📌 작업지시대비 생산실적이 진행 중이거나 작업지시가 완료된 경우 수정 불가
      const uuids = req.body.map((data: any) => { return data.uuid });
      const orderRead = await this.repo.readRawsByUuids(uuids);
      orderRead.raws.forEach((order: any) => {
        if (order.work_fg == true) { throw new Error(`지시번호 [${order.uuid}]의 생산실적이 진행중입니다.`)}
        if (order.comlete_fg == true) { throw new Error(`지시번호 [${order.uuid}]는 완료 상태입니다.`)}
      });

      await sequelize.transaction(async(tran) => { 
        const orderResult = await this.repo.updateWorkerGroup(req.body, req.user?.uid as number, tran);
        this.result.count += orderResult.count;

        // 📌 기존 지시 작업자 리스트 삭제
        const orderIds = this.result.raws.map((raw: any) => { return raw.order_id; });
        const deleteWorkerResult = await this.workerRepo.deleteByOrderIds(orderIds, req.user?.uid as number, tran);
        this.result.count += deleteWorkerResult.count;

        // 📌 수정된 작업조의 작업자 초기 리스트 생성
        let createWorkerResult: ApiResult<any> = { raws: [], count: 0 };
        for await (const order of orderResult.raws) {
          if (order.worker_group_id) {
            const workerRead = await this.workerGroupWorkerRepo.readWorkerInGroup(order.worker_group_id);
            const workerBody = workerRead.raws.map((raw: any) => {
              return {
                factory_id: raw.factory_id,
                order_id: order.order_id,
                worker_id: raw.worker_id
              }
            });
            const workerResult = await this.workerRepo.create(workerBody, req.user?.uid as number, tran);
            createWorkerResult.raws = createWorkerResult.raws.concat(workerResult.raws);
          }
        }
        this.result.count += createWorkerResult.count;

        this.result.raws.push({
          order: orderResult.raws,
          deletedWorker: deleteWorkerResult.raws,
          createdWorker: createWorkerResult.raws
        });
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch] (✅ Inheritance): Default Patch Function
  public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      const orderUuids: string[] = [];

      // 📌 지시대비 실적이 저장된 경우 수정되면 안되는 데이터를 수정 할 때의 Interlock
      req.body.forEach((data: any) => {
        if (Object.keys(data).includes('order_no' || 'workings_id' || 'equip_id' || 'qty' || 'seq' || 'shift_id')) {
          orderUuids.push(data.order_uuid);
        }
      });
      const workRead = await this.workRepo.readByOrderUuids(orderUuids);
      if (workRead.raws[0]) { throw new Error(`지시번호 [${workRead.raws[0].order_uuid}]의 생산실적이 이미 등록되어 있습니다.`) }

      await sequelize.transaction(async(tran) => { 
        this.result = await this.repo.patch(req.body, req.user?.uid as number, tran); 
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      this.result = { raws: [], count: 0 };

      // 📌 작업지시대비 생산실적이 진행 중이거나 작업지시가 완료된 경우 삭제 불가
      const uuids = req.body.map((data: any) => { return data.uuid });
      const orderRead = await this.repo.readRawsByUuids(uuids);
      orderRead.raws.forEach((order: any) => {
        if (order.work_fg == true) { throw new Error(`지시번호 [${order.uuid}]의 생산실적이 진행중입니다.`)}
        if (order.comlete_fg == true) { throw new Error(`지시번호 [${order.uuid}]는 완료 상태입니다.`)}
      });

      const orderIds = req.body.map((data: any) => { return data.order_id });

      await sequelize.transaction(async(tran) => {
        const inputResult = await this.inputRepo.deleteByOrderIds(orderIds, req.user?.uid as number, tran);
        const workerResult = await this.workerRepo.deleteByOrderIds(orderIds, req.user?.uid as number, tran);
        const routingResult = await this.routingRepo.deleteByOrderIds(orderIds, req.user?.uid as number, tran);

        const orderResult = await this.repo.delete(req.body, req.user?.uid as number, tran); 

        this.result.raws.push({
          order: orderResult.raws,
          input: inputResult.raws,
          worker: workerResult.raws,
          routing: routingResult.raws,
        });
        this.result.count += inputResult.count + workerResult.count + orderResult.count;
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 200);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }; 

  //#endregion

  //#endregion

  //#region ✅ Inherited Hooks

  //#region 🔵 Read Hooks

  // 📒 Fn[beforeRead] (✅ Inheritance): Read DB Tasking 이 실행되기 전 호출되는 Function
  beforeRead = async(req: express.Request) => {
    if (req.params.uuid) { return; }

    const orderState = req.query.order_state as string;
    if (![ 'all', 'notProgressing', 'wait', 'ongoing', 'complete' ].includes(orderState)) { throw new Error('잘못된 order_state(진행상태) 입력'); }
  }

  // 📒 Fn[afterRead] (✅ Inheritance): Read DB Tasking 이 실행된 후 호출되는 Function
  // afterRead = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#endregion
}

export default PrdOrderCtl;