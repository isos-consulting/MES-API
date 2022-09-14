import express = require('express');
import ApiResult from '../../interfaces/common/api-result.interface';
import createApiResult from '../../utils/createApiResult_new';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import isServiceResult from '../../utils/isServiceResult';
import response from '../../utils/response_new';
import prdWorkRoutingService from '../../services/prd/work-routing.service';
import prdWorkRoutingOriginService from '../../services/prd/work-routing-origin.service';
import prdWorkService from '../../services/prd/work.service';
import InvStoreService from '../../services/inv/store.service';
import config from '../../configs/config';
import { matchedData } from 'express-validator';
import { sequelizes } from '../../utils/getSequelize';
import { successState } from '../../states/common.state';
import moment from 'moment';

class PrdWorkRoutingCtl {
  stateTag: string
  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'prdWorkRouting';
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new prdWorkRoutingService(req.tenant.uuid);
      const workService = new prdWorkService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      // 📌 생산실적이 완료상태일 경우 데이터 생성 불가
      // 📌 Work Status Interlock
      await workService.validateWorkStatus(datas.map((data: any) => data.work_id));
      // 📌 Date Diff Interlock
      datas = service.validateDateDiff(datas);
			
			// 📌 생산실적이 해당 공정이 진행 중인 상태일때 데이터 생성 불가
      await service.validateWorkRoutingProcStatus(datas[0].work_id,datas[0].proc_id);
      
      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => {
				//✅실적 공정 작업시작시 complete_fg = false 로 입력, start_date 없으면 현제 날짜
				datas.map((value: any) => { 
					value.complete_fg = false
					value.start_date = value.start_date ?? moment(moment.now()).format().toString()
				});

        result = await service.create(datas, req.user?.uid as number, tran)
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
      const service = new prdWorkRoutingService(req.tenant.uuid);
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
      const service = new prdWorkRoutingService(req.tenant.uuid);

      result = await service.readByUuid(req.params.uuid);

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
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new prdWorkRoutingService(req.tenant.uuid);
      const workService = new prdWorkService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      // 📌 생산실적이 완료상태일 경우 데이터 생성 불가
      // 📌 Work Status Interlock
      await workService.validateWorkStatus(datas.map((data: any) => data.work_id));
      // 📌 Date Diff Interlock
      datas = service.validateDateDiff(datas);

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        datas.forEach((value: any) => { 
					value.complete_fg = false;
				});

        result = await service.update(datas, req.user?.uid as number, tran)
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
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new prdWorkRoutingService(req.tenant.uuid);
      const workService = new prdWorkService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      // 📌 생산실적이 완료상태일 경우 데이터 생성 불가
      // 📌 Work Status Interlock
      await workService.validateWorkStatus(datas.map((data: any) => data.work_id));
      // 📌 Date Diff Interlock
      datas = service.validateDateDiff(datas);

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        datas.forEach((value: any) => { 
					value.complete_fg = false;
				});

        result = await service.patch(datas, req.user?.uid as number, tran)
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.PATCH);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

	
  // 📒 Fn[updateComplete]: 생산공정 실적 종료
  public updateComplete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new prdWorkRoutingService(req.tenant.uuid);
			const workService = new prdWorkService(req.tenant.uuid);
			const workRoutingOriginService = new prdWorkRoutingOriginService(req.tenant.uuid);      
      const inventoryService = new InvStoreService(req.tenant.uuid);      
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

			// 📌 생산실적이 완료상태일 경우 데이터 생성 불가
      // 📌 Work Status Interlock
      await workService.validateWorkStatus(datas.map((data: any) => data.work_id));
      // 📌 Date Diff Interlock
      datas = service.validateDateDiff(datas);

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 

				//✅실적 공정 작업종료시 complete_fg = true 로 입력, end_date 없으면 현제 날짜
				datas.map((value: any) => { 
					value.complete_fg = true
					value.end_date = value.end_date ?? moment(moment.now()).format().toString()
				});

				//✅실적 공정순서 기준 마지막 공정 
				const maxProcNo = await workRoutingOriginService.getMaxProcNo(datas[0].work_id, tran)

				//✅실적 공정 작업완료 
        const workRoutingResult = await service.patch(datas, req.user?.uid as number, tran)

				//✅실적 조회
        const workRead = await workService.readRawByIds([workRoutingResult.raws[0].work_id]);
				
				//✅실적 조회
				Object.keys(workRead.raws[0]).forEach((value: any) => {
					if(!workRoutingResult.raws[0][value]){
						workRoutingResult.raws[0][value] = workRead.raws[0][value]
					}
				});

				let toStoreResult;
				if (maxProcNo === workRoutingResult.raws[0].proc_no){
					// 📌 입고 창고 수불 내역 생성(생산입고)
					toStoreResult = await inventoryService.transactInventory(
						workRoutingResult.raws, 'CREATE', 
						{ inout: 'TO', tran_type: 'PRD_OUTPUT', reg_date: workRoutingResult.raws[0].end_date, tran_id_alias: 'work_routing_id' },
						req.user?.uid as number, tran
					);
				}
			
				result.raws.push({
					workRouting: workRoutingResult.raws,
					toStore: toStoreResult?.raws ?? null,
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

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new prdWorkRoutingService(req.tenant.uuid);
      const workService = new prdWorkService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = Object.values(matched);

      // 📌 생산실적이 완료상태일 경우 데이터 생성 불가
      // 📌 Work Status Interlock
      await workService.validateWorkStatus(datas.map((data: any) => data.work_id));
      // 📌 Date Diff Interlock
      datas = service.validateDateDiff(datas);

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.delete(datas, req.user?.uid as number, tran)
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

export default PrdWorkRoutingCtl;