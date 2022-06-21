import express = require('express');
import ApiResult from '../../interfaces/common/api-result.interface';
import PrdOrderService from '../../services/prd/order.service';
import { matchedData } from 'express-validator';
import AdmPatternOptService from '../../services/adm/pattern-opt.service';
import AdmPatternHistoryService from '../../services/adm/pattern-history.service';
import PrdOrderInputService from '../../services/prd/order-input.service';
import PrdOrderWorkerService from '../../services/prd/order-worker.service';
import PrdOrderRoutingService from '../../services/prd/order-routing.service';
import createApiResult from '../../utils/createApiResult_new';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import isServiceResult from '../../utils/isServiceResult';
import response from '../../utils/response_new';
import config from '../../configs/config';
import { successState } from '../../states/common.state';
import { sequelizes } from '../../utils/getSequelize';

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
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new PrdOrderService(req.tenant.uuid);
      const orderInputService = new PrdOrderInputService(req.tenant.uuid);
      const orderWorkerService = new PrdOrderWorkerService(req.tenant.uuid);
      const orderRoutingService = new PrdOrderRoutingService(req.tenant.uuid);
      const patternOptService = new AdmPatternOptService(req.tenant.uuid);
      const patternService = new AdmPatternHistoryService(req.tenant.uuid);
      const matched = matchedData(req, { locations: ['body'] });

      let datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        for await (const data of datas) {
          // 📌 전표번호가 수기 입력되지 않고 자동발행 Option일 경우 번호 자동발행
          if (!data.order_no) { 
            // 📌 전표자동발행 옵션 여부 확인
            const hasAutoOption = await patternOptService.hasAutoOption({ table_nm: 'PRD_ORDER_TB', col_nm: 'order_no', tran });

            // 📌 전표의 자동발행옵션이 on인 경우
            if (hasAutoOption) {
              data.order_no = await patternService.getPattern({
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
          }

          // 📌 작업지시 데이터 생성
          const orderResult = await service.create([data], req.user?.uid as number, tran);
          const order = orderResult.raws[0];

          // 📌 지시별 품목 투입정보 초기 데이터 생성 (BOM 하위품목 조회 후 생성)
          const inputResult = await orderInputService.createByOrder(order, req.user?.uid as number, tran);
          result.count += inputResult.count;

          // 📌 지시별 작업조 입력 시 작업조 하위 작업자 초기 데이터 생성
          let workerResult: ApiResult<any> = { raws: [], count: 0 };
          if (order.worker_group_id) {
            workerResult = await orderWorkerService.createByOrder(order, req.user?.uid as number, tran);
            result.count += workerResult.count;
          }

          // 📌 지시별 하위 공정순서 정보 초기 데이터 생성
          const routingResult = await orderRoutingService.createByOrder(order, req.user?.uid as number, tran);
          result.count += routingResult.count;

          result.raws.push({
            order: order,
            input: inputResult.raws,
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
      const service = new PrdOrderService(req.tenant.uuid);
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
      const service = new PrdOrderService(req.tenant.uuid);

      result = await service.readByUuid(req.params.uuid);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[read]: 지시기준 Mulit-Process Read Report Function
  public readMultiProcByOrder = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new PrdOrderService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      const multiProcRead = await service.readMultiProcByOrder(params);

      // 📌 조회데이터 기준 공정순서 String Array 형태로 전달을 위한 데이터 추출
      let procNos: any[] = multiProcRead.raws.map((proc: any) => { return String(proc.proc_no); });
      procNos = [...new Set(procNos)];

      // 📌 지시 기준 데이터를 출력하기 때문에 ID 추출
      let orderIds: any[] = multiProcRead.raws.map((proc: any) => { return proc.order_id; });
      orderIds = [...new Set(orderIds)];

      // 📌 지시기준 데이터 Loop
      orderIds.forEach((orderId: number) => {
        const raws = multiProcRead.raws.filter((proc: any) => { return proc.order_id == orderId; });
        
        let firstIndex: number = 0;
        let resultParams: any = {};
        let objProcNm: any = { sort: '공정명' };
        let objWaitQty: any = { sort: '대기수량' };
        let objTotalQty: any = { sort: '공정실적' };
        let objRejectQty: any = { sort: '불량수량' };
        let objQty: any = { sort: '양품수량' };
        raws.forEach((raw: any, index: number, raws: any[]) => {
          objProcNm[raw.proc_no] = raw.proc_nm;                 // 공정명
          objTotalQty[raw.proc_no] = raw.total_qty;             // 공정실적
          objRejectQty[raw.proc_no] = raw.reject_qty;           // 불량수량
          objQty[raw.proc_no] = raw.qty;                        // 양품수량

          // 📌 대기수량 ( 첫 공정: 지시수량 - 생산수량, 나머지 공정: 전 공정 생산수량 - 생산수량 )
          if(firstIndex !== index) { objWaitQty[raw.proc_no] = raws[index-1].qty - raw.total_qty; } 
          else { 
            objWaitQty[raw.proc_no] = raw.order_qty - raw.total_qty;
            
            // 📌 지시 관련 데이터 셋팅
            resultParams = {
              order_no: raw.order_no,
              reg_date: raw.reg_date,
              workings_uuid: raw.workings_uuid,
              workings_cd: raw.workings_cd,
              workings_nm: raw.workings_nm,
              prod_uuid: raw.prod_uuid,
              prod_no: raw.prod_no,
              prod_nm: raw.prod_nm,
              uuid: raw.uuid,
              item_type_cd: raw.item_type_cd,
              item_type_nm: raw.item_type_nm,
              prod_type_uuid: raw.prod_type_uuid,
              prod_type_cd: raw.prod_type_cd,
              prod_type_nm: raw.prod_type_nm,
              model_uuid: raw.model_uuid,
              model_cd: raw.model_cd,
              model_nm: raw.model_nm,
              rev: raw.rev,
              prod_std: raw.prod_std,
              unit_uuid: raw.unit_uuid,
              unit_cd: raw.unit_cd,
              unit_nm: raw.unit_nm,
              order_qty: raw.order_qty,
              order_state: raw.order_state,
            }
          }
        });

        // 📌 Return 데이터 셋팅
        result.raws.push(Object.assign({}, resultParams, objProcNm));
        result.raws.push(Object.assign({}, resultParams, objWaitQty));
        result.raws.push(Object.assign({}, resultParams, objTotalQty));
        result.raws.push(Object.assign({}, resultParams, objRejectQty));
        result.raws.push(Object.assign({}, resultParams, objQty));
      })

      return response(
        res, 
        { value: { count: result.raws.length, proc_nos: procNos }, raws: result.raws, status: 200, message: { admin_message: '데이터 조회 성공', user_message: '데이터 조회 성공' } },
        { state_tag: this.stateTag, type: 'SUCCESS', state_no: successState.READ }
      );
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  }

  //#endregion

  //#region 🟡 Update Functions

  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new PrdOrderService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      // 📌 실적이 저장된 경우 수정되면 안되는 데이터를 수정 할 때의 Interlock
      await service.validateUpdateByWork(datas);
      
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

  // 📒 Fn[updateComplete]: 완료여부(complete_fg) 수정
  public updateComplete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new PrdOrderService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      // 📌 생산실적이 진행 중일 경우 완료여부 true 로 변경 불가 Interlock
      await service.validateUpdateComplete(datas);

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.updateComplete(datas, req.user?.uid as number, tran); 
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  }

  // 📒 Fn[updateWorkerGroup]: 작업조(worker_group) 수정
  public updateWorkerGroup = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new PrdOrderService(req.tenant.uuid);
      const orderWorkerService = new PrdOrderWorkerService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      // 📌 작업지시대비 생산실적이 진행 중이거나 작업지시가 완료된 경우 수정 불가
      await Promise.all([
        service.validateIsOngoingWork(datas.map((data: any) => data.uuid)),   // 작업중인지 확인
        service.validateIsCompleted(datas.map((data: any) => data.uuid))      // 완료된 지시인지 확인
      ]);

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        const orderResult = await service.updateWorkerGroup(datas, req.user?.uid as number, tran);
        result.count += orderResult.count;

        // 📌 기존 지시 작업자 리스트 삭제
        const orderIds = result.raws.map((raw: any) => { return raw.order_id; });
        const deleteWorkerResult = await orderWorkerService.deleteByOrderIds(orderIds, req.user?.uid as number, tran);
        result.count += deleteWorkerResult.count;

        // 📌 수정된 작업조의 작업자 초기 리스트 생성
        let createWorkerResult: ApiResult<any> = { raws: [], count: 0 };
        for await (const order of orderResult.raws) {
          if (order.worker_group_id) {
            const workerResult = await orderWorkerService.createByOrder(order, req.user?.uid as number, tran);
            createWorkerResult.raws = [ ...createWorkerResult.raws, ...workerResult.raws ];
          }
        }
        result.count += createWorkerResult.count;

        result.raws.push({
          order: orderResult.raws,
          deletedWorker: deleteWorkerResult.raws,
          createdWorker: createWorkerResult.raws
        });
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
      const service = new PrdOrderService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      // 📌 실적이 저장된 경우 수정되면 안되는 데이터를 수정 할 때의 Interlock
      await service.validateUpdateByWork(datas);
      
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
      let result: ApiResult<any> = { count: 0, raws: [] };      
      const service = new PrdOrderService(req.tenant.uuid);
      const orderInputService = new PrdOrderInputService(req.tenant.uuid);
      const orderWorkerService = new PrdOrderWorkerService(req.tenant.uuid);
      const orderRoutingService = new PrdOrderRoutingService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      // 📌 작업지시대비 생산실적이 진행 중이거나 작업지시가 완료된 경우 수정 불가
      await Promise.all([
        service.validateIsOngoingWork(datas.map((data: any) => data.uuid)),   // 작업중인지 확인
        service.validateIsCompleted(datas.map((data: any) => data.uuid))      // 완료된 지시인지 확인
      ]);
      
      const orderIds = datas.map((data: any) => { return data.order_id });
      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => {
        const inputResult = await orderInputService.deleteByOrderIds(orderIds, req.user?.uid as number, tran);
        const workerResult = await orderWorkerService.deleteByOrderIds(orderIds, req.user?.uid as number, tran);
        const routingResult = await orderRoutingService.deleteByOrderIds(orderIds, req.user?.uid as number, tran);

        const orderResult = await service.delete(datas, req.user?.uid as number, tran); 

        result.raws.push({
          order: orderResult.raws,
          input: inputResult.raws,
          worker: workerResult.raws,
          routing: routingResult.raws,
        });
        result.count += inputResult.count + workerResult.count + orderResult.count;
      });

      return createApiResult(res, result, 200, '데이터 삭제 성공', this.stateTag, successState.DELETE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  }; 

  //#endregion

  //#endregion
}

export default PrdOrderCtl;