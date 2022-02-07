import express = require('express');
import ApiResult from '../../interfaces/common/api-result.interface';
import QmsInspResultDetailInfoRepo from '../../repositories/qms/insp-result-detail-info.repository';
import QmsInspResultDetailValueRepo from '../../repositories/qms/insp-result-detail-value.repository';
import QmsInspResultRepo from '../../repositories/qms/insp-result.repository';
import { sequelizes } from '../../utils/getSequelize';
import PrdWorkService from '../../services/prd/work.service';
import { matchedData } from 'express-validator';
import PrdOrderService from '../../services/prd/order.service';
import PrdWorkWorkerService from '../../services/prd/work-worker.service';
import PrdWorkRoutingService from '../../services/prd/work-routing.service';
import createApiResult from '../../utils/createApiResult_new';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import isServiceResult from '../../utils/isServiceResult';
import response from '../../utils/response_new';
import config from '../../configs/config';
import { successState } from '../../states/common.state';
import InvStoreService from '../../services/inv/store.service';
import PrdWorkInputService from '../../services/prd/work-input.service';
import PrdOrderInputService from '../../services/prd/order-input.service';
import PrdWorkRejectService from '../../services/prd/work-reject.service';
import PrdWorkDowntimeService from '../../services/prd/work-downtime.service';
import StdStoreService from '../../services/std/store.service';
import StdTenantOptService from '../../services/std/tenant-opt.service';

class PrdWorkCtl {
  stateTag: string;
  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'prdWork';
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { raws: [], count: 0 };
      const service = new PrdWorkService(req.tenant.uuid);
      const orderService = new PrdOrderService(req.tenant.uuid);
      const workWorkerService = new PrdWorkWorkerService(req.tenant.uuid);
      const workRoutingService = new PrdWorkRoutingService(req.tenant.uuid);
      const matched = matchedData(req, { locations: ['body'] });

      let datas = await service.convertFk(Object.values(matched));

      // ❗ 작업지시가 마감되어 있는 경우 Interlock
      await orderService.validateIsCompleted(datas.map((data: any) => data.order_uuid));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        for await (const data of datas) {
          // 📌 작업지시 단위 최대 순번 조회
          const maxSeq = await service.getMaxSeq(data.order_id, tran);
          data.seq = maxSeq + 1;

          // 📌 생산실적 데이터 생성
          const workResult = await service.create([data], req.user?.uid as number, tran);
          result.count += workResult.count;
          const work = workResult.raws[0];

          // 📌 작업지시 테이블 work_fg(생산진행여부) True로 변경
          const orderResult = await orderService.updateWorkFgById(work.order_id, true, req.user?.uid as number, tran);

          // 📌 작업지시의 작업자 투입정보 기준 초기 데이터 생성
          const workerResult = await workWorkerService.createByOrderWorker(work, req.user?.uid as number, tran);
          result.count += workerResult.count;

          // 📌 작업지시의 공정순서 정보 기준 초기 데이터 생성
          const routingResult = await workRoutingService.create(work, req.user?.uid as number, tran);
          result.count += routingResult.count;

          result.raws.push({
            work: work,
            order: orderResult.raws,
            worker: workerResult.raws,
            routing: routingResult.raws
          });
        }
      });

      return createApiResult(res, result, 201, '데이터 생성 성공', this.stateTag , successState.CREATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

  //#region 🔵 Read Functions

  // 📒 Fn[read] (✅ Inheritance): Default Read Function
  public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new PrdWorkService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      result = await service.read(params);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  }

  // 📒 Fn[readByUuid] (✅ Inheritance): Default ReadByUuid Function
  public readByUuid = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new PrdWorkService(req.tenant.uuid);

      result = await service.readByUuid(req.params.uuid);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readReport]: 실적현황 데이터 조회
  public readReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new PrdWorkService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      result = await service.readReport(params);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

  //#region 🟡 Update Functions

  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { raws: [], count: 0 };
      const service = new PrdWorkService(req.tenant.uuid);
      const matched = matchedData(req, { locations: ['body'] });

      let datas = await service.convertFk(Object.values(matched));

      // 📌 생산실적이 완료상태일 경우 데이터 저장 불가
      await service.validateWorkStatus(datas.map((data: any) => data.work_id))

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.update(datas, req.user?.uid as number, tran);
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  }

  // 📒 Fn[updateComplete]: 생산실적 완료처리
  public updateComplete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new PrdWorkService(req.tenant.uuid);
      const orderService = new PrdOrderService(req.tenant.uuid);
      const workInputService = new PrdWorkInputService(req.tenant.uuid);
      const workRejectService = new PrdWorkRejectService(req.tenant.uuid);
      const orderInputService = new PrdOrderInputService(req.tenant.uuid);
      const stdStoreService = new StdStoreService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      const tenantOptService = new StdTenantOptService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        for await (const data of datas) {
          let verifyInput: any = {};
          // ❗ 지시생성 시 등록했던 투입정보 가져오기
          verifyInput = await orderInputService.getVerifyInput(data.order_id, tran);
          // ❗ 지시기준 생산투입정보 검증 및 가져오기
          verifyInput = await workInputService.getVerifyInput(data.work_id, tran);

          // ❗ 생산 수량과 투입 수량이 일치하지 않을 경우 Interlock (PUSH 기준)
          const totalProducedQty = Number(data.qty) + Number(data.reject_qty);
          await service.validateInputQty(verifyInput, totalProducedQty);

          // ❗ 가용창고 Interlock
          await stdStoreService.validateStoreTypeByIds(data.to_store_id, 'AVAILABLE', tran);
          // 📌 생산실적 완료 처리
          const workResult = await service.updateComplete({ uuid: data.uuid, work_id: data.work_id, complete_fg: true }, req.user?.uid as number, tran);
          
          // 📌 해당 실적의 작업지시에 진행중인 생산 실적이 없을 경우 작업지시의 생산진행여부(work_fg)를 False로 변경
          const orderResult = await orderService.updateOrderCompleteByWorks(data.order_id, req.user?.uid as number, tran);

          // 📌 입고 창고 수불 내역 생성(생산입고)
          const toStoreResult = await inventoryService.transactInventory(
            workResult.raws, 'CREATE', 
            { inout: 'TO', tran_type: 'PRD_OUTPUT', reg_date: data.reg_date, tran_id_alias: 'work_id' },
            req.user?.uid as number, tran
          );

          // 📌 부적합 수량에 의한 창고 수불 내역 생성
          const rejectBody = await workRejectService.getWorkRejectBody(data, data.reg_date);
          const rejectStoreResult = await inventoryService.transactInventory(
            rejectBody, 'CREATE', 
            { inout: 'TO', tran_type: 'PRD_REJECT', reg_date: data.reg_date, tran_id_alias: 'work_reject_id' },
            req.user?.uid as number, tran
          );

          // 📌 창고 수불이력 생성(생산투입)
          const isPullOption = await tenantOptService.getTenantOptValue('OUT_AUTO_PULL', tran);
          const workInputBody = await workInputService.getWorkInputBody(workResult.raws[0], workResult.raws[0].reg_date, isPullOption);
          const inputStoreResult = await inventoryService.transactInventory(
            workInputBody, 'CREATE', 
            { inout: 'FROM', tran_type: 'PRD_INPUT', reg_date: data.reg_date, tran_id_alias: 'work_input_id' },
            req.user?.uid as number, tran
          );
          
          result.raws.push({
            work: workResult.raws,
            order: orderResult.raws,
            toStore: [...toStoreResult.raws, ...rejectStoreResult.raws],
            fromStore: inputStoreResult.raws,
          });
        }
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  }

  // 📒 Fn[updateCancelComplete]: 완료된 생산실적 취소처리
  public updateCancelComplete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new PrdWorkService(req.tenant.uuid);
      const orderService = new PrdOrderService(req.tenant.uuid);
      const workInputService = new PrdWorkInputService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      const tenantOptService = new StdTenantOptService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        for await (const data of datas) {
          // ❗ 작업지시가 마감되어 있는 경우 Interlock
          await orderService.validateIsCompleted([data.order_uuid]);

          // 📌 생산실적 완료 취소 처리
          const workResult = await service.updateComplete({ uuid: data.uuid, work_id: data.work_id, complete_fg: false }, req.user?.uid as number, tran);

          // 📌 해당 실적의 작업지시의 생산진행여부(work_fg)를 True로 변경
          const orderResult = await orderService.updateWorkFgById(workResult.raws[0].order_id, true, req.user?.uid as number, tran);

          // 📌 창고 수불이력 삭제(생산입고)
          const toStoreResult = await inventoryService.transactInventory(
            workResult.raws, 'DELETE', 
            { inout: 'TO', tran_type: 'PRD_OUTPUT', reg_date: '', tran_id_alias: 'work_id' },
            req.user?.uid as number, tran
          );

          // 📌 창고 수불이력 삭제(생산투입)
          const isPullOption = await tenantOptService.getTenantOptValue('OUT_AUTO_PULL', tran);
          const workInputBody = await workInputService.getWorkInputBody(workResult.raws[0], workResult.raws[0].reg_date, isPullOption);
          const fromStoreResult = await inventoryService.transactInventory(
            workInputBody, 'DELETE', 
            { inout: 'FROM', tran_type: 'PRD_INPUT', reg_date: '', tran_id_alias: 'work_input_id' },
            req.user?.uid as number, tran
          );

          result.raws.push({
            work: workResult.raws,
            order: orderResult.raws,
            toStore: toStoreResult.raws,
            fromStore: fromStoreResult.raws,
          });
        }
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  }

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch] (✅ Inheritance): Default Patch Function
  public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new PrdWorkService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      // 📌 실적이 저장된 경우 수정되면 안되는 데이터를 수정 할 때의 Interlock
      await service.validateWorkStatus(datas.map((data: any) => data.work_id));
      
      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.patch(datas, req.user?.uid as number, tran); 
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  }

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const inspResultRepo = new QmsInspResultRepo(req.tenant.uuid);
      const inspResultDetailInfoRepo = new QmsInspResultDetailInfoRepo(req.tenant.uuid);
      const inspResultDetailValueRepo = new QmsInspResultDetailValueRepo(req.tenant.uuid);

      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new PrdWorkService(req.tenant.uuid);
      const workRejectService = new PrdWorkRejectService(req.tenant.uuid);
      const workInputService = new PrdWorkInputService(req.tenant.uuid);
      const workWorkerService = new PrdWorkWorkerService(req.tenant.uuid);
      const workRoutingService = new PrdWorkRoutingService(req.tenant.uuid);
      const workDowntimeService = new PrdWorkDowntimeService(req.tenant.uuid);
      const orderService = new PrdOrderService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      const tenantOptService = new StdTenantOptService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        for await (const data of datas) {
          const workRead = await service.readByUuid(data.uuid);
          const work = workRead.raws[0];

          // ❗ 작업지시가 마감되어 있는 경우 Interlock
          await orderService.validateIsCompleted([work.order_uuid]);

          // 📌 입고 창고 수불 내역 생성(생산입고)
          const storeResult = await inventoryService.transactInventory(
            data, 'DELETE', 
            { inout: 'TO', tran_type: 'PRD_OUTPUT', reg_date: '', tran_id_alias: 'work_id' },
            req.user?.uid as number, tran
          );

          // 📌 부적합 수량에 의한 창고 수불 내역 생성
          const rejectBody = await workRejectService.getWorkRejectBody(data, data.reg_date);
          const rejectStoreResult = await inventoryService.transactInventory(
            rejectBody, 'DELETE', 
            { inout: 'TO', tran_type: 'PRD_REJECT', reg_date: '', tran_id_alias: 'work_reject_id' },
            req.user?.uid as number, tran
          );

          // 📌 창고 수불이력 생성(생산투입)
          const isPullOption = await tenantOptService.getTenantOptValue('OUT_AUTO_PULL', tran);
          const workInputBody = await workInputService.getWorkInputBody(data, data.reg_date, isPullOption);
          const inputStoreResult = await inventoryService.transactInventory(
            workInputBody, 'DELETE', 
            { inout: 'FROM', tran_type: 'PRD_INPUT', reg_date: '', tran_id_alias: 'work_input_id' },
            req.user?.uid as number, tran
          );

          // 📌 생산실적 관련 테이블 삭제
          const inputResult = await workInputService.deleteByWorkId(data.work_id, req.user?.uid as number, tran);
          const workerResult = await workWorkerService.deleteByWorkId(data.work_id, req.user?.uid as number, tran);
          const routingResult = await workRoutingService.deleteByWorkId(data.work_id, req.user?.uid as number, tran);
          const rejectResult = await workRejectService.deleteByWorkId(data.work_id, req.user?.uid as number, tran);
          const downtimeResult = await workDowntimeService.deleteByWorkId(data.work_id, req.user?.uid as number, tran);

          // ❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗ 공정검사 service로 바꿔야함
          // 📌 공정검사 이력 삭제
          let inspHeaderResult: ApiResult<any> = { raws: [], count: 0 };
          let detailInfosResult: ApiResult<any> = { raws: [], count: 0 };
          let detailValuesResult: ApiResult<any> = { raws: [], count: 0 };

          const inspResultRead = await inspResultRepo.readProcByWorkId(work.work_id);
          for await (const inspResult of inspResultRead.raws) {
            // 📌 검사 성적서 상세 값을 삭제하기 위하여 검사 성적서 상세정보 Id 조회
            const detailInfos = await inspResultDetailInfoRepo.readByResultId(inspResult.insp_result_id);
            const detailInfoIds = detailInfos.raws.map((raw: any) => { return raw.insp_result_detail_info_id });

            // ✅ 검사성적서상세값 삭제
            const tempDetailValuesResult = await inspResultDetailValueRepo.deleteByInfoIds(detailInfoIds, req.user?.uid as number, tran);
            detailValuesResult.raws = [ ...detailValuesResult.raws, ...tempDetailValuesResult.raws ];
            detailValuesResult.count += tempDetailValuesResult.count;

            // ✅ 검사성적서상세정보 삭제
            const tempDetailInfosResult = await inspResultDetailInfoRepo.deleteByResultIds([inspResult.insp_result_id], req.user?.uid as number, tran);
            detailInfosResult.raws = [ ...detailInfosResult.raws, ...tempDetailInfosResult.raws ];
            detailInfosResult.count += tempDetailInfosResult.count;

            // ✅ 검사성적서 삭제
            const tempHeaderResult = await inspResultRepo.delete([inspResult], req.user?.uid as number, tran);
            inspHeaderResult.raws = [ ...inspHeaderResult.raws, ...tempHeaderResult.raws ];
            inspHeaderResult.count += tempHeaderResult.count;
          }
          // ❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗ 공정검사 service로 바꿔야함

          // 📌 생산실적 이력 삭제
          const workResult = await service.delete([data], req.user?.uid as number, tran);

          // 📌 해당 실적의 작업지시에 진행중인 생산 실적이 없을 경우 작업지시의 생산진행여부(work_fg)를 False로 변경
          let orderResult = await orderService.updateOrderCompleteByWorks(data.orderId, req.user?.uid as number, tran);          

          result.raws.push({
            work: workResult.raws,
            order: orderResult.raws,
            input: inputResult.raws,
            worker: workerResult.raws,
            routing: routingResult.raws,
            reject: rejectResult.raws,
            downtime: downtimeResult.raws,
            store: [...storeResult.raws, ...rejectStoreResult.raws, ...inputStoreResult.raws],
            inspResult: inspHeaderResult.raws,
            inspResultDetailInfo: detailInfosResult.raws,
            inspResultDetailValue: detailValuesResult.raws,
          });

          result.count += workResult.count + inputResult.count + workerResult.count + routingResult.count + rejectResult.count + downtimeResult.count;
          result.count += storeResult.count + inspHeaderResult.count + detailInfosResult.count + detailValuesResult.count;
        }
      });

      return createApiResult(res, result, 200, '데이터 삭제 성공', this.stateTag, successState.DELETE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  }

  //#endregion

  //#endregion
}

export default PrdWorkCtl;