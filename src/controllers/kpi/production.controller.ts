import express = require('express');
import response from '../../utils/response';
import ApiResult from '../../interfaces/common/api-result.interface';
import config from '../../configs/config';
import KpiProductionService from '../../services/kpi/production.service';
import { matchedData } from 'express-validator';
import createApiResult from '../../utils/createApiResult_new';
import isServiceResult from '../../utils/isServiceResult';
import { errorState, successState } from '../../states/common.state';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import moment from 'moment';
import createApiError from '../../utils/createApiError';

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

      result.raws.push(...convertData);
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

      result.raws.push(...convertData);
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

			const datas = await service.readWorkerProductivity(params); 
			const convertData = await service.convertToPivotOfProductivity(datas.raws); 

      result.raws.push(...convertData);
			result.count = result.raws.length;

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

	// 📒 Fn[readOrderWork] (✅ Inheritance): Default Read Function
	public readOrderWork = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			let result: ApiResult<any> = { count:0, raws: [] };
			const service = new KpiProductionService(req.tenant.uuid);
			const params = matchedData(req, { locations: [ 'query', 'params' ] });
			params.week_fg = JSON.parse(params.week_fg);
			
			const startDate = `${params.reg_date}-01`;

			const date = moment(startDate);
			
			if (!date.isValid()) {
				throw createApiError(
          400, 
          { 
            admin_message: '잘못된 일자가 입력되었습니다',
            user_message: '잘못된 일자가 입력되었습니다'
          }, 
          this.stateTag, 
          errorState.INVALID_DATA
        );
			}

			const endDate = date.endOf('month').format('YYYY-MM-DD');
			const startDateYear = date.startOf('year').format('YYYY-MM-DD');

			params['start_date'] = startDate;
			params['end_date'] = endDate;
			params['start_date_year'] = startDateYear;

			const datas = await service.readOrderWork(params); 

			let convertData = [];
			if (params.week_fg) {
				convertData = await service.convertToPivotOfOrderWorkWeek(datas.raws);
			} else {
				convertData = await service.convertToPivotOfOrderWorkDay(datas.raws); 
			}

      result.raws.push(...convertData);
			result.count = result.raws.length;

			return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
		} catch (error) {
			if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
			
			const dbError = createDatabaseError(error, this.stateTag);
			if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

			return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
		}
	};

	// 📒 Fn[readOrderWorkMonth] (✅ Inheritance): Default Read Function
	public readOrderWorkMonth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			let result: ApiResult<any> = { count:0, raws: [] };
			const service = new KpiProductionService(req.tenant.uuid);
			const params = matchedData(req, { locations: [ 'query', 'params' ] });

			const date = moment(`${params.reg_date}-01`);
			
			if (!date.isValid()) {
				throw createApiError(
          400, 
          { 
            admin_message: '잘못된 일자가 입력되었습니다',
            user_message: '잘못된 일자가 입력되었습니다'
          }, 
          this.stateTag, 
          errorState.INVALID_DATA
        );
			}

			const year = date.format('YYYY');

			params['year'] = year

			const datas = await service.readOrderWorkMonth(params); 

			const convertData = await service.convertToPivotOfOrderWorkMonth(datas.raws);

      result.raws.push(...convertData);
			result.count = result.raws.length;

			return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
		} catch (error) {
			if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
			
			const dbError = createDatabaseError(error, this.stateTag);
			if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

			return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
		}
	};

	// 📒 Fn[readWorkerWorkPrice] (✅ Inheritance): Default Read Function
	public readWorkerWorkPrice = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			let result: ApiResult<any> = { count:0, raws: [] };
			const service = new KpiProductionService(req.tenant.uuid);
			const params = matchedData(req, { locations: [ 'query', 'params' ] });
			params.week_fg = JSON.parse(params.week_fg);
			
			const startDate = `${params.reg_date}-01`;

			const date = moment(startDate);
			
			if (!date.isValid()) {
				throw createApiError(
          400, 
          { 
            admin_message: '잘못된 일자가 입력되었습니다',
            user_message: '잘못된 일자가 입력되었습니다'
          }, 
          this.stateTag, 
          errorState.INVALID_DATA
        );
			}

			const endDate = date.endOf('month').format('YYYY-MM-DD');
			const startDateYear = date.startOf('year').format('YYYY-MM-DD');

			params['start_date'] = startDate;
			params['end_date'] = endDate;
			params['start_date_year'] = startDateYear;

			const datas = await service.readWorkerWorkPrice(params); 

			let convertData = [];
			if (params.week_fg) {
				convertData = await service.convertToPivotOfWorkerWorkPriceWeek(datas.raws);
			} else {
				convertData = await service.convertToPivotOfWorkerWorkPriceDay(datas.raws); 
			}

      result.raws.push(...convertData);
			result.count = result.raws.length;

			return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
		} catch (error) {
			if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
			
			const dbError = createDatabaseError(error, this.stateTag);
			if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

			return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
		}
	};

	// 📒 Fn[readWorkerWorkPriceMonth] (✅ Inheritance): Default Read Function
	public readWorkerWorkPriceMonth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			let result: ApiResult<any> = { count:0, raws: [] };
			const service = new KpiProductionService(req.tenant.uuid);
			const params = matchedData(req, { locations: [ 'query', 'params' ] });

			const date = moment(`${params.reg_date}-01`);
			
			if (!date.isValid()) {
				throw createApiError(
          400, 
          { 
            admin_message: '잘못된 일자가 입력되었습니다',
            user_message: '잘못된 일자가 입력되었습니다'
          }, 
          this.stateTag, 
          errorState.INVALID_DATA
        );
			}

			const year = date.format('YYYY');

			params['year'] = year

			const datas = await service.readWorkerWorkPriceMonth(params); 

			const convertData = await service.convertToPivotOfWorkerWorkPriceMonth(datas.raws);

      result.raws.push(...convertData);
			result.count = result.raws.length;

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