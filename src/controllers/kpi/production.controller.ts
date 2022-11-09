import express = require('express');
import response from '../../utils/response';
import ApiResult from '../../interfaces/common/api-result.interface';
import config from '../../configs/config';
import KpiProductionService from '../../services/kpi/production.service';
import { matchedData } from 'express-validator';
import createApiResult from '../../utils/createApiResult_new';
import isServiceResult from '../../utils/isServiceResult';
import { successState } from '../../states/common.state';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';

class KpiProductionCtl {
  stateTag: string;
  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'kpiProduction';
  };
  //#endregion


  //#region 🔵 Read Functions

  // 📒 Fn[readEquipProductivity] (✅ Inheritance): Default Read Function
  public readEquipProductivity = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new KpiProductionService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

			const datas = await service.readEquipProductivity(params); 
			const convertData = await service.convertToPivotOfEquipProductivity(datas.raws); 

      result.raws.push(convertData);
			result.count = result.raws.length;
			
      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

	// 📒 Fn[readDowntime] (✅ Inheritance): Default Read Function
	public readDowntime = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			let result: ApiResult<any> = { count:0, raws: [] };
			const service = new KpiProductionService(req.tenant.uuid);
			const params = matchedData(req, { locations: [ 'query', 'params' ] });

			const datas = await service.readDowntime(params); 
			const convertData = await service.convertToPivotOfDowntime(datas.raws); 

      result.raws.push(convertData);
			result.count = result.raws.length;

			

			return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
		} catch (error) {
			if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
			
			const dbError = createDatabaseError(error, this.stateTag);
			if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

			return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
		}
	};

	// 📒 Fn[readWorkPlanAchievementRate] (✅ Inheritance): Default Read Function
	public readWorkPlanAchievementRate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			let result: ApiResult<any> = { count:0, raws: [] };
			const service = new KpiProductionService(req.tenant.uuid);
			const params = matchedData(req, { locations: [ 'query', 'params' ] });

			result = await service.readWorkPlanAchievementRate(params);

			return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
		} catch (error) {
			if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
			
			const dbError = createDatabaseError(error, this.stateTag);
			if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

			return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
		}
	};

	// 📒 Fn[readWorkerProductivity] (✅ Inheritance): Default Read Function
	public readWorkerProductivity = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			let result: ApiResult<any> = { count:0, raws: [] };
			const service = new KpiProductionService(req.tenant.uuid);
			const params = matchedData(req, { locations: [ 'query', 'params' ] });

			result = await service.readWorkerProductivity(params);

			return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
		} catch (error) {
			if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
			
			const dbError = createDatabaseError(error, this.stateTag);
			if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

			return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
		}
	};

	// 📒 Fn[readWorkRejectsRate] (✅ Inheritance): Default Read Function
	public readWorkRejectsRate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			let result: ApiResult<any> = { count:0, raws: [] };
			const service = new KpiProductionService(req.tenant.uuid);
			const params = matchedData(req, { locations: [ 'query', 'params' ] });

			result = await service.readWorkRejectsRate(params);

			return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
		} catch (error) {
			if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
			
			const dbError = createDatabaseError(error, this.stateTag);
			if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

			return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
		}
	};

	//#endregion
}

export default KpiProductionCtl;