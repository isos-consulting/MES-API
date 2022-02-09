import express = require('express');
import isDateFormat from '../../utils/isDateFormat';
import isUuid from '../../utils/isUuid';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import { sequelizes } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';
import config from '../../configs/config';
import InvStoreService from '../../services/inv/store.service';
import { matchedData } from 'express-validator';
import createApiResult from '../../utils/createApiResult_new';
import isServiceResult from '../../utils/isServiceResult';
import { successState } from '../../states/common.state';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';

class InvStoreCtl {
  stateTag: string;
  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'invStore';
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };

      const service = new InvStoreService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas: any[] = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => {
        // 📌 실사등록 Body 생성
        datas = await service.getCreateBody(datas, tran);

        // 📌 재고 실사 내역 생성
        result = await service.create(datas, req.user?.uid as number, tran);
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
      const service = new InvStoreService(req.tenant.uuid);
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
      const service = new InvStoreService(req.tenant.uuid);

      result = await service.readByUuid(req.params.uuid);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readStock]: 유형별 재고 조회
  public readStock = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new InvStoreService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      result = await service.readStockAccordingToType(params);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readReturnStock]: 반출 대기재고(단위 변환 적용) 조회
  public readReturnStock = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new InvStoreService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      result = await service.readReturnStock(params);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readStoreHistoryByTransaction]: 수불유형에 따른 이력 조회
  public readStoreHistoryByTransaction = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new InvStoreRepo(req.tenant.uuid);
      
      const params = Object.assign(req.query, req.params);  
      if (!isUuid(params.factory_uuid)) { throw new Error('잘못된 factory_uuid(공장UUID) 입력') };
      if (!isDateFormat(params.start_date)) { throw new Error('잘못된 start_date(기준시작일자) 입력') };
      if (!isDateFormat(params.end_date)) { throw new Error('잘못된 end_date(기준종료일자) 입력') };

      const result = await repo.readStoreHistoryByTransaction(params);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readTotalHistory]: 유형별 총괄 수불부 조회
  public readTotalHistory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new InvStoreRepo(req.tenant.uuid);
      
      const params = Object.assign(req.query, req.params);
      if (!this.stockTypes.includes(params.stock_type)) { throw new Error('잘못된 stock_type(재고조회유형) 입력') }
      if (!this.groupedTypes.includes(params.grouped_type)) { throw new Error('잘못된 grouped_type(재고분류유형) 입력') }
      if (!isUuid(params.factory_uuid)) { throw new Error('잘못된 factory_uuid(공장UUID) 입력') };
      if (!isDateFormat(params.start_date)) { throw new Error('잘못된 start_date(기준시작일자) 입력') };
      if (!isDateFormat(params.end_date)) { throw new Error('잘못된 end_date(기준종료일자) 입력') };

      const result = await repo.readTotalHistoryAccordingToType(params);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readIndividualHistory]: 유형별 개별 수불부 조회
  public readIndividualHistory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new InvStoreRepo(req.tenant.uuid);
      
      const params = Object.assign(req.query, req.params);
      if (!isUuid(params.factory_uuid)) { throw new Error('잘못된 factory_uuid(공장UUID) 입력') };
      if (!isUuid(params.store_uuid)) { throw new Error('잘못된 store_uuid(창고UUID) 입력') };
      if (!isDateFormat(params.start_date)) { throw new Error('잘못된 start_date(기준시작일자) 입력') };
      if (!isDateFormat(params.end_date)) { throw new Error('잘못된 end_date(기준종료일자) 입력') };

      const result = await repo.readIndividualHistoryAccordingToType(params);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readTypeHistory]: 유형별 수불유형별 수불부 조회
  public readTypeHistory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new InvStoreRepo(req.tenant.uuid);
      
      const params = Object.assign(req.query, req.params);
      if (!this.groupedTypes.includes(params.grouped_type)) { throw new Error('잘못된 grouped_type(재고분류유형) 입력') }
      if (!isUuid(params.factory_uuid)) { throw new Error('잘못된 factory_uuid(공장UUID) 입력') };
      if (!isDateFormat(params.start_date)) { throw new Error('잘못된 start_date(기준시작일자) 입력') };
      if (!isDateFormat(params.end_date)) { throw new Error('잘못된 end_date(기준종료일자) 입력') };

      const result = await repo.readTypeHistoryAccordingToType(params);

      const tempResult: any[] = [];
      result.raws.forEach((raw: any) => {
        const equals = tempResult.find(data => 
          data.factory_uuid == raw.factory_uuid &&
          data.prod_uuid == raw.prod_uuid &&
          data.reject_uuid == raw.reject_uuid &&
          data.lot_no == raw.lot_no &&
          data.store_uuid == raw.store_uuid &&
          data.location_uuid == raw.location_uuid
        );
        
        const inoutStr = raw.inout_fg ? 'in' : 'out';

        if (equals) { equals[raw.tran_cd + '_' + inoutStr  + '_qty'] = raw.qty; }
        else { 
          raw[raw.tran_cd + '_' + inoutStr  + '_qty'] = raw.qty;
          delete raw.inout_fg;
          delete raw.tran_cd;
          delete raw.qty;
          tempResult.push(raw);
        }
      });

      result.raws = tempResult;
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

  //#region 🔵 Read Hooks

  // 📒 Fn[beforeRead] (✅ Inheritance): Read DB Tasking 이 실행되기 전 호출되는 Function
  beforeRead = async(req: express.Request) => {
    if (isUuid(req.params.uuid)) { return; }

    if (!isDateFormat(req.query.start_date)) { throw new Error('잘못된 start_date(기준시작일자) 입력') };
    if (!isDateFormat(req.query.end_date)) { throw new Error('잘못된 end_date(기준종료일자) 입력') };
  }

  // 📒 Fn[afterRead] (✅ Inheritance): Read DB Tasking 이 실행된 후 호출되는 Function
  // afterRead = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🟡 Update Hooks

  // 📒 Fn[beforeUpdate] (✅ Inheritance): Update Transaction 이 실행되기 전 호출되는 Function
  // beforeUpdate = async(req: express.Request) => {}

  // 📒 Fn[beforeTranUpdate] (✅ Inheritance): Update Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranUpdate = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranUpdate] (✅ Inheritance): Update Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranUpdate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterUpdate] (✅ Inheritance): Update Transaction 이 실행된 후 호출되는 Function
  // afterUpdate = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🟠 Patch Hooks

  // 📒 Fn[beforePatch] (✅ Inheritance): Patch Transaction 이 실행되기 전 호출되는 Function
  // beforePatch = async(req: express.Request) => {}

  // 📒 Fn[beforeTranPatch] (✅ Inheritance): Patch Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranPatch = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranPatch] (✅ Inheritance): Patch Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranPatch = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterPatch] (✅ Inheritance): Patch Transaction 이 실행된 후 호출되는 Function
  // afterPatch = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🔴 Delete Hooks

  // 📒 Fn[beforeDelete] (✅ Inheritance): Delete Transaction 이 실행되기 전 호출되는 Function
  // beforeDelete = async(req: express.Request) => {}

  // 📒 Fn[beforeTranDelete] (✅ Inheritance): Delete Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranDelete = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranDelete] (✅ Inheritance): Delete Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranDelete = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterDelete] (✅ Inheritance): Delete Transaction 이 실행된 후 호출되는 Function
  // afterDelete = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#endregion
}

export default InvStoreCtl;