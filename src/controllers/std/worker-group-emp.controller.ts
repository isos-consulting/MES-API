import express = require('express');
import { matchedData } from 'express-validator';
import config from '../../configs/config';
import StdWorkerGroupEmpService from '../../services/std/worker-group-emp.service';
import ApiResult from '../../interfaces/common/api-result.interface';
import response from '../../utils/response';
import { sequelizes } from '../../utils/getSequelize';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import isServiceResult from '../../utils/isServiceResult';
import createApiResult from '../../utils/createApiResult_new';
import { successState } from '../../states/common.state';

class StdWorkerGroupEmpCtl {
  stateTag: string;
  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'StdWorkerGroupEmp';
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new StdWorkerGroupEmpService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.create(datas, req.user?.uid as number, tran)
      });

      return createApiResult(res, result, 201, '데이터 생성 성공', this.stateTag , successState.CREATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  }

  //#endregion

  //#region 🔵 Read Functions

  // 📒 Fn[read] (✅ Inheritance): Default Read Function
  public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new StdWorkerGroupEmpService(req.tenant.uuid);
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
				const service = new StdWorkerGroupEmpService(req.tenant.uuid);
	
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
      const service = new StdWorkerGroupEmpService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
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
      const service = new StdWorkerGroupEmpService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.patch(datas, req.user?.uid as number, tran)
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
      const service = new StdWorkerGroupEmpService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = Object.values(matched);

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

  //#region ✅ Excel Upload Functions

  // 📒 Fn[upsertBulkDatasFromExcel] (✅ Inheritance): Default Excel Upload Function
  // public upsertBulkDatasFromExcel = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  // 📒 Fn[convertUniqueToFk] (✅ Inheritance): Excel Upload 전 Unique Key => Fk 변환 Function(Hook)
  // public convertUniqueToFk = async (body: any[], tenant: string) => {
  //   const factoryRepo = new StdFactoryRepo(tenant);
  //   const workerGroupRepo = new StdWorkerGroupRepo(tenant);
  //   const workerRepo = new StdWorkerRepo(tenant);

  //   for await (const raw of body) {
  //     const factory = await factoryRepo.readRawByUnique({ factory_cd: raw.factory_cd });
  //     raw.factory_id = unsealArray(factory.raws).factory_id;

  //     const workerGroup = await workerGroupRepo.readRawByUnique({ factory_id: raw.factory_id, worker_group_cd: raw.worker_group_cd });
  //     raw.worker_group_id = unsealArray(workerGroup.raws).worker_group_id;

  //     const worker = await workerRepo.readRawByUnique({ factory_id: raw.factory_id, worker_cd: raw.worker_cd });
  //     raw.worker_id = unsealArray(worker.raws).worker_id;
  //   }
  //   return body;
  // }

  // 📒 Fn[afterTranUpload] (✅ Inheritance): Excel Upload 후 Transaction 내에서 로직 처리하기 위한 Function(Hook)
  // public afterTranUpload = async (req: express.Request, _insertedRaws: any[], _updatedRaws: any[], tran: Transaction) => {}

  //#endregion
}

export default StdWorkerGroupEmpCtl;