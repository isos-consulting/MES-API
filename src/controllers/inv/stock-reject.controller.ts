import express = require('express');
import ApiResult from '../../interfaces/common/api-result.interface';
import { sequelizes } from '../../utils/getSequelize';
import isDateFormat from '../../utils/isDateFormat';
import isUuid from '../../utils/isUuid';
import response from '../../utils/response_new';
import config from '../../configs/config';
import InvStockRejectService from '../../services/inv/stock-reject.service';
import StdStoreService from '../../services/std/store.service';
import InvStoreService from '../../services/inv/store.service';
import { matchedData } from 'express-validator';
import createApiResult from '../../utils/createApiResult_new';
import isServiceResult from '../../utils/isServiceResult';
import { successState } from '../../states/common.state';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';

class InvStockRejectCtl {
  stateTag: string;
  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'invStockReject';
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };

      const service = new InvStockRejectService(req.tenant.uuid);
      const storeService = new StdStoreService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas: any[] = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => {
        // 📌 재고 부적합 내역 생성
        const stockRejectResult = await service.create(datas, req.user?.uid as number, tran);

        // 📌 입출고 창고 수불 내역 생성
        // 📌 입력 창고유형에 대한 유효성 검사
        //    (From: 가용창고 => To: 가용창고 (Available => Available))
        await storeService.validateStoreTypeByIds(stockRejectResult.raws.map(raw => raw.from_store_id), 'AVAILABLE', tran);
        await storeService.validateStoreTypeByIds(stockRejectResult.raws.map(raw => raw.to_store_id), 'REJECT', tran);

        // 📌 수불 데이터 생성
        const fromStoreResult = await inventoryService.transactInventory(
          stockRejectResult.raws, 'CREATE', 
          { inout: 'FROM', tran_type: 'INV_REJECT', tran_id_alias: 'stock_reject_id' },
          req.user?.uid as number, tran
        );
        const toStoreResult = await inventoryService.transactInventory(
          stockRejectResult.raws, 'CREATE', 
          { inout: 'TO', tran_type: 'INV_REJECT', tran_id_alias: 'stock_reject_id' },
          req.user?.uid as number, tran
        );

        result.raws = [{
          stockReject: stockRejectResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws,
        }];

        result.count = stockRejectResult.count + fromStoreResult.count + toStoreResult.count;
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
      const service = new InvStockRejectService(req.tenant.uuid);
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
      const service = new InvStockRejectService(req.tenant.uuid);

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
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new InvStockRejectService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas: any[] = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => {
        // 📌 재고 이동 내역 수정
        const stockRejectResult = await service.update(datas, req.user?.uid as number, tran);

        // 📌 수불 데이터 생성
        const fromStoreResult = await inventoryService.transactInventory(
          stockRejectResult.raws, 'UPDATE', 
          { inout: 'FROM', tran_type: 'INV_REJECT', tran_id_alias: 'stock_reject_id' },
          req.user?.uid as number, tran
        );
        const toStoreResult = await inventoryService.transactInventory(
          stockRejectResult.raws, 'UPDATE', 
          { inout: 'TO', tran_type: 'INV_REJECT', tran_id_alias: 'stock_reject_id' },
          req.user?.uid as number, tran
        );

        result.raws = [{
          stockReject: stockRejectResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws,
        }];
        result.count = stockRejectResult.count + fromStoreResult.count + toStoreResult.count;
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
      const service = new InvStockRejectService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas: any[] = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => {
        // 📌 재고 이동 내역 수정
        const stockRejectResult = await service.patch(datas, req.user?.uid as number, tran);

        // 📌 수불 데이터 생성
        const fromStoreResult = await inventoryService.transactInventory(
          stockRejectResult.raws, 'UPDATE', 
          { inout: 'FROM', tran_type: 'INV_REJECT', tran_id_alias: 'stock_reject_id' },
          req.user?.uid as number, tran
        );
        const toStoreResult = await inventoryService.transactInventory(
          stockRejectResult.raws, 'UPDATE', 
          { inout: 'TO', tran_type: 'INV_REJECT', tran_id_alias: 'stock_reject_id' },
          req.user?.uid as number, tran
        );

        result.raws = [{
          stockReject: stockRejectResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws,
        }];
        result.count = stockRejectResult.count + fromStoreResult.count + toStoreResult.count;
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

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Delete Create Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new InvStockRejectService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas: any[] = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => {
        // 📌 재고 이동 내역 수정
        const stockRejectResult = await service.delete(datas, req.user?.uid as number, tran);

        // 📌 수불 데이터 생성
        const fromStoreResult = await inventoryService.transactInventory(
          stockRejectResult.raws, 'DELETE', 
          { inout: 'FROM', tran_type: 'INV_REJECT', tran_id_alias: 'stock_reject_id' },
          req.user?.uid as number, tran
        );
        const toStoreResult = await inventoryService.transactInventory(
          stockRejectResult.raws, 'DELETE', 
          { inout: 'TO', tran_type: 'INV_REJECT', tran_id_alias: 'stock_reject_id' },
          req.user?.uid as number, tran
        );

        result.raws = [{
          stockReject: stockRejectResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws,
        }];
        result.count = stockRejectResult.count + fromStoreResult.count + toStoreResult.count;
      });

      return createApiResult(res, result, 200, '데이터 삭제 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

  //#endregion

  //#region ✅ Inherited Hooks 

  //#region 🔵 Read Hooks

  // 📒 Fn[beforeRead]: Read DB Tasking 이 실행되기 전 호출되는 Function
  beforeRead = async(req: express.Request) => {
    if (isUuid(req.params.uuid)) { return; }

    if (!isDateFormat(req.query.start_date)) { throw new Error('잘못된 start_date(기준시작일자) 입력') };
    if (!isDateFormat(req.query.end_date)) { throw new Error('잘못된 end_date(기준종료일자) 입력') };
  }

  // 📒 Fn[afterRead]: Read DB Tasking 이 실행된 후 호출되는 Function
  // afterRead = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#endregion
}

export default InvStockRejectCtl;