import express = require('express');
import ApiResult from '../../interfaces/common/api-result.interface';
import PrdOrderInputRepo from '../../repositories/prd/order-input.repository';
import PrdOrderRoutingRepo from '../../repositories/prd/order-routing.repository';
import PrdOrderWorkerRepo from '../../repositories/prd/order-worker.repository';
import PrdOrderRepo from '../../repositories/prd/order.repository';
import PrdWorkRepo from '../../repositories/prd/work.repository';
import StdBomRepo from '../../repositories/std/bom.repository';
import StdRoutingRepo from '../../repositories/std/routing.repository';
import StdWorkerGroupWorkerRepo from '../../repositories/std/worker-group-worker.repository';
import checkArray from '../../utils/checkArray';
import { getSequelize } from '../../utils/getSequelize';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import unsealArray from '../../utils/unsealArray';
import AdmPatternHistoryCtl from '../adm/pattern-history.controller';
import config from '../../configs/config';
import prdOrderService from '../../services/prd/order.service';
import { matchedData } from 'express-validator';

class PrdOrderCtl {
  stateTag: string;
  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'prdOrder';
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdOrderRepo(req.tenant.uuid);
      const inputRepo = new PrdOrderInputRepo(req.tenant.uuid);
      const workerRepo = new PrdOrderWorkerRepo(req.tenant.uuid);
      const routingRepo = new PrdOrderRoutingRepo(req.tenant.uuid);
      const workerGroupWorkerRepo = new StdWorkerGroupWorkerRepo(req.tenant.uuid);
      const bomRepo = new StdBomRepo(req.tenant.uuid);
      const stdRoutingRepo = new StdRoutingRepo(req.tenant.uuid);


      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new prdOrderService(req.tenant.uuid);
      const matched = matchedData(req, { locations: ['body'] })
      let datas = await service.convertFk(Object.values(matched));

      await sequelize.transaction(async(tran) => { 
        for await (const data of datas) {
          // 📌 전표번호가 수기 입력되지 않고 자동발행 Option일 경우 번호 자동발행
          if (!data.order_no) { 
            data.order_no = await new AdmPatternHistoryCtl().getPattern({
              tenant: req.tenant.uuid,
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
          result = await service.create(datas, req.user?.uid as number, tran);

          const orderResult = await repo.create(checkArray(data), req.user?.uid as number, tran);
          const order = unsealArray(orderResult.raws);

          // 📌 지시별 품목 투입정보 초기 데이터 생성 (BOM 하위품목 조회 후 생성)
          const bomRead = await bomRepo.readByParent(order.factory_id, order.prod_id);
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
          const inputResult = await inputRepo.create(inputBody, req.user?.uid as number, tran);
          result.count += inputResult.count;

          // 📌 지시별 작업조 입력 시 작업조 하위 작업자 초기 데이터 생성
          let workerResult: ApiResult<any> = { raws: [], count: 0 };
          if (order.worker_group_id) {
            const workerRead = await workerGroupWorkerRepo.readWorkerInGroup(order.worker_group_id);
            const workerBody = workerRead.raws.map((raw: any) => {
              return {
                factory_id: raw.factory_id,
                order_id: order.order_id,
                worker_id: raw.worker_id
              }
            });
            workerResult = await workerRepo.create(workerBody, req.user?.uid as number, tran);
            result.count += workerResult.count;
          }

          // 📌 지시별 하위 공정순서 정보 초기 데이터 생성
          const routingParams = {
            factory_id : order.factory_id,
            prod_id: order.prod_id,
            equip_id: order.equip_id
          }
          const routingRead = await stdRoutingRepo.readOptionallyMove(routingParams);
          const routingBody = routingRead.raws.map((raw: any) => {
            return {
              factory_id: raw.factory_id,
              order_id: order.order_id,
              proc_id: raw.proc_id,
              proc_no: raw.proc_no,
              workings_id: order.workings_id,
              equip_id: raw.equip_id
            }
          });
          const routingResult = await routingRepo.create(routingBody, req.user?.uid as number, tran);
          result.count += routingResult.count;

          result.raws.push({
            order: order,
            input: inputResult.raws,
            worker: workerResult.raws,
            routing: routingResult.raws
          });
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

  //#endregion

  //#region 🟡 Update Functions

  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdOrderRepo(req.tenant.uuid);
      const workRepo = new PrdWorkRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      const orderUuids: string[] = [];

      // 📌 지시대비 실적이 저장된 경우 수정되면 안되는 데이터를 수정 할 때의 Interlock
      req.body.forEach((data: any) => {
        if (Object.keys(data).includes('order_no' || 'workings_id' || 'equip_id' || 'qty' || 'seq' || 'shift_id')) {
          orderUuids.push(data.order_uuid);
        }
      });
      const workRead = await workRepo.readByOrderUuids(orderUuids);
      if (workRead.raws[0]) { throw new Error(`지시번호 [${workRead.raws[0].order_uuid}]의 생산실적이 이미 등록되어 있습니다.`) }

      await sequelize.transaction(async(tran) => { 
        result = await repo.update(req.body, req.user?.uid as number, tran); 
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  // 📒 Fn[updateComplete]: 완료여부(complete_fg) 수정
  public updateComplete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = checkArray(req.body);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdOrderRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      // 📌 생산실적이 진행 중일 경우 완료여부 true 로 변경 불가 Interlock
      for await (const data of req.body) {
        // 📌 완료여부를 false(마감 취소)로 수정 할 경우 Interlock 없음
        if (data.complete_fg == false) { continue; }

        // 📌 완료일시를 입력하지 않았을 경우 현재일시로 입력
        if (!data.complete_date) { data.complete_date = new Date(); }

        const orderRead = await repo.readRawByUuid(data.uuid);
        const order = unsealArray(orderRead.raws);
        if (order.work_fg == true) { throw new Error(`지시번호 [${data.uuid}]의 생산실적이 진행중입니다.`)}
      }

      await sequelize.transaction(async(tran) => { 
        result = await repo.updateComplete(req.body, req.user?.uid as number, tran); 
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  // 📒 Fn[updateWorkerGroup]: 작업조(worker_group) 수정
  public updateWorkerGroup = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdOrderRepo(req.tenant.uuid);
      const workerRepo = new PrdOrderWorkerRepo(req.tenant.uuid);
      const workerGroupWorkerRepo = new StdWorkerGroupWorkerRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      // 📌 작업지시대비 생산실적이 진행 중이거나 작업지시가 완료된 경우 수정 불가
      const uuids = req.body.map((data: any) => { return data.uuid });
      const orderRead = await repo.readRawsByUuids(uuids);
      orderRead.raws.forEach((order: any) => {
        if (order.work_fg == true) { throw new Error(`지시번호 [${order.uuid}]의 생산실적이 진행중입니다.`)}
        if (order.comlete_fg == true) { throw new Error(`지시번호 [${order.uuid}]는 완료 상태입니다.`)}
      });

      await sequelize.transaction(async(tran) => { 
        const orderResult = await repo.updateWorkerGroup(req.body, req.user?.uid as number, tran);
        result.count += orderResult.count;

        // 📌 기존 지시 작업자 리스트 삭제
        const orderIds = result.raws.map((raw: any) => { return raw.order_id; });
        const deleteWorkerResult = await workerRepo.deleteByOrderIds(orderIds, req.user?.uid as number, tran);
        result.count += deleteWorkerResult.count;

        // 📌 수정된 작업조의 작업자 초기 리스트 생성
        let createWorkerResult: ApiResult<any> = { raws: [], count: 0 };
        for await (const order of orderResult.raws) {
          if (order.worker_group_id) {
            const workerRead = await workerGroupWorkerRepo.readWorkerInGroup(order.worker_group_id);
            const workerBody = workerRead.raws.map((raw: any) => {
              return {
                factory_id: raw.factory_id,
                order_id: order.order_id,
                worker_id: raw.worker_id
              }
            });
            const workerResult = await workerRepo.create(workerBody, req.user?.uid as number, tran);
            createWorkerResult.raws = createWorkerResult.raws.concat(workerResult.raws);
          }
        }
        result.count += createWorkerResult.count;

        result.raws.push({
          order: orderResult.raws,
          deletedWorker: deleteWorkerResult.raws,
          createdWorker: createWorkerResult.raws
        });
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch] (✅ Inheritance): Default Patch Function
  public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdOrderRepo(req.tenant.uuid);
      const workRepo = new PrdWorkRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      const orderUuids: string[] = [];

      // 📌 지시대비 실적이 저장된 경우 수정되면 안되는 데이터를 수정 할 때의 Interlock
      req.body.forEach((data: any) => {
        if (Object.keys(data).includes('order_no' || 'workings_id' || 'equip_id' || 'qty' || 'seq' || 'shift_id')) {
          orderUuids.push(data.order_uuid);
        }
      });
      const workRead = await workRepo.readByOrderUuids(orderUuids);
      if (workRead.raws[0]) { throw new Error(`지시번호 [${workRead.raws[0].order_uuid}]의 생산실적이 이미 등록되어 있습니다.`) }

      await sequelize.transaction(async(tran) => { 
        result = await repo.patch(req.body, req.user?.uid as number, tran); 
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdOrderRepo(req.tenant.uuid);
      const inputRepo = new PrdOrderInputRepo(req.tenant.uuid);
      const workerRepo = new PrdOrderWorkerRepo(req.tenant.uuid);
      const routingRepo = new PrdOrderRoutingRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      // 📌 작업지시대비 생산실적이 진행 중이거나 작업지시가 완료된 경우 삭제 불가
      const uuids = req.body.map((data: any) => { return data.uuid });
      const orderRead = await repo.readRawsByUuids(uuids);
      orderRead.raws.forEach((order: any) => {
        if (order.work_fg == true) { throw new Error(`지시번호 [${order.uuid}]의 생산실적이 진행중입니다.`)}
        if (order.comlete_fg == true) { throw new Error(`지시번호 [${order.uuid}]는 완료 상태입니다.`)}
      });

      const orderIds = req.body.map((data: any) => { return data.order_id });

      await sequelize.transaction(async(tran) => {
        const inputResult = await inputRepo.deleteByOrderIds(orderIds, req.user?.uid as number, tran);
        const workerResult = await workerRepo.deleteByOrderIds(orderIds, req.user?.uid as number, tran);
        const routingResult = await routingRepo.deleteByOrderIds(orderIds, req.user?.uid as number, tran);

        const orderResult = await repo.delete(req.body, req.user?.uid as number, tran); 

        result.raws.push({
          order: orderResult.raws,
          input: inputResult.raws,
          worker: workerResult.raws,
          routing: routingResult.raws,
        });
        result.count += inputResult.count + workerResult.count + orderResult.count;
      });

      return response(res, result.raws, { count: result.count }, '', 200);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
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