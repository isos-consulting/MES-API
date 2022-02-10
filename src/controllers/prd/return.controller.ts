import express = require('express');
import { matchedData } from 'express-validator';
import config from '../../configs/config';
import ApiResult from '../../interfaces/common/api-result.interface';
import { sequelizes } from '../../utils/getSequelize';
import isServiceResult from '../../utils/isServiceResult';
import response from '../../utils/response_new';
import createApiResult from '../../utils/createApiResult_new';
import { successState } from '../../states/common.state';
import StdStoreService from '../../services/std/store.service';
import InvStoreService from '../../services/inv/store.service';
import PrdReturnService from '../../services/prd/return.service';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';

class PrdReturnCtl {
  stateTag: string;
  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'prdReturn';
  };
  //#endregion
  //
  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new PrdReturnService(req.tenant.uuid);
      const storeService = new StdStoreService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas: any[] = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 자재출고 생성
        const releaseResult = await service.create(datas, req.user?.uid as number, tran);

        // 📌 입력 창고유형에 대한 유효성 검사
        //    (From: 가용창고 => To: 가용창고 (Available => Available))
        await storeService.validateStoreTypeByIds(releaseResult.raws.map(raw => raw.from_store_id), 'AVAILABLE', tran);
        await storeService.validateStoreTypeByIds(releaseResult.raws.map(raw => raw.to_store_id), 'AVAILABLE', tran);

        // 📌 수불 데이터 생성
        const fromStoreResult = await inventoryService.transactInventory(
          releaseResult.raws, 'CREATE', 
          { inout: 'FROM', tran_type: 'PRD_RETURN', tran_id_alias: 'return_id' },
          req.user?.uid as number, tran
        );
        const toStoreResult = await inventoryService.transactInventory(
          releaseResult.raws, 'CREATE', 
          { inout: 'TO', tran_type: 'PRD_RETURN', tran_id_alias: 'return_id' },
          req.user?.uid as number, tran
        );

        result.raws = [{
          release: releaseResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws,
        }];
        result.count = releaseResult.count + fromStoreResult.count + toStoreResult.count;
      });

      return createApiResult(res, result, 201, '데이터 생성 성공', this.stateTag, successState.CREATE);
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
      const service = new PrdReturnService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      result = await service.read(params);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readByUuid] (✅ Inheritance): Default ReadByUuid Function
  public readByUuid = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new PrdReturnService(req.tenant.uuid);

      result = await service.readByUuid(req.params.uuid);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readReport]: 반납현황 데이터 조회
  public readReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const service = new PrdReturnService(req.tenant.uuid);

      const result = await service.readReport(params);
      
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
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new PrdReturnService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas: any[] = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 자재출고 수정
        const releaseResult = await service.update(datas, req.user?.uid as number, tran);

        // 📌 수불 데이터 생성
        const fromStoreResult = await inventoryService.transactInventory(
          releaseResult.raws, 'UPDATE', 
          { inout: 'FROM', tran_type: 'PRD_RETURN', tran_id_alias: 'return_id' },
          req.user?.uid as number, tran
        );
        const toStoreResult = await inventoryService.transactInventory(
          releaseResult.raws, 'UPDATE', 
          { inout: 'TO', tran_type: 'PRD_RETURN', tran_id_alias: 'return_id' },
          req.user?.uid as number, tran
        );

        result.raws = [{
          release: releaseResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws,
        }];
        result.count = releaseResult.count + fromStoreResult.count + toStoreResult.count;
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
      const service = new PrdReturnService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas: any[] = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 자재출고 수정
        const releaseResult = await service.patch(datas, req.user?.uid as number, tran);

        // 📌 수불 데이터 생성
        const fromStoreResult = await inventoryService.transactInventory(
          releaseResult.raws, 'UPDATE', 
          { inout: 'FROM', tran_type: 'PRD_RETURN', tran_id_alias: 'return_id' },
          req.user?.uid as number, tran
        );
        const toStoreResult = await inventoryService.transactInventory(
          releaseResult.raws, 'UPDATE', 
          { inout: 'TO', tran_type: 'PRD_RETURN', tran_id_alias: 'return_id' },
          req.user?.uid as number, tran
        );

        result.raws = [{
          release: releaseResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws,
        }];
        result.count = releaseResult.count + fromStoreResult.count + toStoreResult.count;
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.PATCH);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };
  
  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Delete Create Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new PrdReturnService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas: any[] = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 자재출고 수정
        const releaseResult = await service.delete(datas, req.user?.uid as number, tran);

        // 📌 수불 데이터 삭제
        const fromStoreResult = await inventoryService.transactInventory(
          releaseResult.raws, 'DELETE', 
          { inout: 'FROM', tran_type: 'PRD_RETURN', tran_id_alias: 'return_id' },
          req.user?.uid as number, tran
        );
        const toStoreResult = await inventoryService.transactInventory(
          releaseResult.raws, 'DELETE', 
          { inout: 'TO', tran_type: 'PRD_RETURN', tran_id_alias: 'return_id' },
          req.user?.uid as number, tran
        );

        result.raws = [{
          release: releaseResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws,
        }];
        result.count = releaseResult.count + fromStoreResult.count + toStoreResult.count;
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

export default PrdReturnCtl;