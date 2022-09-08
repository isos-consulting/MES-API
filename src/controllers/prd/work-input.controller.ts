import express = require('express');
import ApiResult from '../../interfaces/common/api-result.interface';
import { matchedData } from 'express-validator';
import createApiResult from '../../utils/createApiResult_new';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import isServiceResult from '../../utils/isServiceResult';
import response from '../../utils/response_new';
import config from '../../configs/config';
import { successState } from '../../states/common.state';
import { sequelizes } from '../../utils/getSequelize';
import prdWorkInputService from '../../services/prd/work-input.service';
import prdWorkService from '../../services/prd/work.service';
import InvStoreService from '../../services/inv/store.service';
import moment from 'moment';

class PrdWorkInputCtl {
  stateTag: string;
  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'prdWorkInput';
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new prdWorkInputService(req.tenant.uuid);
      const workService = new prdWorkService(req.tenant.uuid);
			const inventoryService = new InvStoreService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      // 📌 생산실적이 완료상태일 경우 데이터 생성 불가
      // 📌 Work Status Interlock
      await workService.validateWorkStatus(datas.map((data: any) => data.work_id));
      
      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.create(datas, req.user?.uid as number, tran)
				
				await inventoryService.transactInventory(
					result.raws, 'CREATE', 
					{ inout: 'FROM', tran_type: 'PRD_INPUT', reg_date: moment(moment.now()).format().toString(), tran_id_alias: 'work_input_id' },
					req.user?.uid as number, tran
				);
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
      const service = new prdWorkInputService(req.tenant.uuid);
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
      const service = new prdWorkInputService(req.tenant.uuid);

      result = await service.readByUuid(req.params.uuid);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readWorkInputGroup]: 생산실적의 자재 투입 그룹 Read Function (비입력)
  public readWorkInputGroup = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new prdWorkInputService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      result = await service.readWorkInputGroup(params);

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
      const service = new prdWorkInputService(req.tenant.uuid);
      const workService = new prdWorkService(req.tenant.uuid);
			const inventoryService = new InvStoreService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      // 📌 생산실적이 완료상태일 경우 데이터 생성 불가
      // 📌 Work Status Interlock
      await workService.validateWorkStatus(datas.map((data: any) => data.work_id));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.update(datas, req.user?.uid as number, tran)

				await inventoryService.transactInventory(
					result.raws, 'UPDATE', 
					{ inout: 'FROM', tran_type: 'PRD_INPUT', tran_id_alias: 'work_input_id' },
					req.user?.uid as number, tran
				);
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch] (✅ Inheritance): Default Patch Function
  public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new prdWorkInputService(req.tenant.uuid);
      const workService = new prdWorkService(req.tenant.uuid);
			const inventoryService = new InvStoreService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      // 📌 생산실적이 완료상태일 경우 데이터 생성 불가
      // 📌 Work Status Interlock
      await workService.validateWorkStatus(datas.map((data: any) => data.work_id));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.patch(datas, req.user?.uid as number, tran)

				await inventoryService.transactInventory(
					result.raws, 'UPDATE', 
					{ inout: 'FROM', tran_type: 'PRD_INPUT', tran_id_alias: 'work_input_id' },
					req.user?.uid as number, tran
				);
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.PATCH);
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
      const service = new prdWorkInputService(req.tenant.uuid);
      const workService = new prdWorkService(req.tenant.uuid);
			const inventoryService = new InvStoreService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = Object.values(matched);

      // 📌 생산실적이 완료상태일 경우 데이터 생성 불가
      // 📌 Work Status Interlock
      await workService.validateWorkStatus(datas.map((data: any) => data.work_id));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.delete(datas, req.user?.uid as number, tran)

				await inventoryService.transactInventory(
					result.raws, 'DELETE', 
					{ inout: 'FROM', tran_type: 'PRD_INPUT', tran_id_alias: 'work_input_id' },
					req.user?.uid as number, tran
				);
      });

      return createApiResult(res, result, 200, '데이터 삭제 성공', this.stateTag, successState.DELETE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  }

  // // 📒 Fn[deleteByWork]: 실적 기준 투입데이터 전체 삭제
  // public deleteByWork = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  //   try {
  //     req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);

  //     const sequelize = getSequelize(req.tenant.uuid);
  //     const repo = new PrdWorkInputRepo(req.tenant.uuid);
  //     const workRepo = new PrdWorkRepo(req.tenant.uuid);
  //     const storeRepo = new InvStoreRepo(req.tenant.uuid);
  //     let result: ApiResult<any> = { count: 0, raws: [] };
      
  //     // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
  //     const uuids = req.body.map((data: any) => { return data.work_uuid });
  //     const workRead = await workRepo.readRawsByUuids(uuids);
  //     workRead.raws.forEach((work: any) => { 
  //       if (work.complete_fg == true) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
  //     });

  //     // 📌 수불이력을 삭제할 항목 추가
  //     const workIds: number[] = req.body.map((data: any) => { return data.work_id });
  //     const storeBody: IInvStore[] = [];
  //     for await (const workId of workIds) {
  //       const workInputs = await repo.readRawsByWorkId(workId);
  //       workInputs.raws.forEach((workInput: any) => { storeBody.push({ tran_id: workInput.work_input_id, inout_fg: false, tran_cd: getTranTypeCd('PRD_INPUT') }); });
  //     }
      
  //     await sequelize.transaction(async(tran) => { 
  //       // 📌 창고 수불이력 삭제
  //       const storeResult = await storeRepo.deleteToTransaction(storeBody, req.user?.uid as number, tran);

  //       // 📌 실적 ID 기준 자재투입 데이터 삭제
  //       const inputResult = await repo.deleteByWorkIds(workIds, req.user?.uid as number, tran); 

  //       result.raws = [{ input: inputResult.raws, store: storeResult.raws }];
  //       result.count = inputResult.count + storeResult.count;
  //     });

  //     return response(res, result.raws, { count: result.count }, '', 200);
  //   } catch (e) {
  //     return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
  //   }
  // }

  //#endregion

  //#endregion
}

export default PrdWorkInputCtl;