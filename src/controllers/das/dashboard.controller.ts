import express from 'express';
import { matchedData } from 'express-validator';
import config from '../../configs/config';
import DashboardService from '../../services/das/dashboard.service';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import isServiceResult from '../../utils/isServiceResult';
import response from '../../utils/response_new';
import createApiResult from '../../utils/createApiResult_new';
import { successState } from '../../states/common.state';
import ApiResult from '../../interfaces/common/api-result.interface';

class DashboardCtl {
  stateTag: string

  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'dashboard'
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions
  //#endregion

  //#region 🔵 Read Functions

  // 📒 Fn[readOverallStatus] (✅ Inheritance): 종합현황 조회
  public readOverallStatus = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new DashboardService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      // 일별 매입, 매출 금액
      const byDayRead = await service.readPurchasedSalesByDay(params);
      const byDayResult = service.getOverallStatusByDayGraph(byDayRead.raws, params.reg_date);

      // 월별 매입, 매출 금액
      const byMonthRead = await service.readPurchasedSalesByMonth(params);
      const byMonthResult = service.getOverallStatusByMonthGraph(byMonthRead.raws);

      // 연도별 매입, 매출 금액
      const byYearRead = await service.readPurchasedSalesByYear(params);
      const byYearResult = service.getOverallStatusByYearGraph(byYearRead.raws, params.reg_date);

      result.raws.push({
        byDay: byDayResult,
        byMonth: byMonthResult,
        byYear: byYearResult
      });

      result.count = byDayResult.length + byMonthResult.length + byYearResult.length;

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readRealtimeStatus] (✅ Inheritance): 실시간현황 조회
  public readRealtimeStatus = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new DashboardService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      const operationRateRead = await service.readFacilityOperationRate(params);
      const rejectRateRead = await service.readRejectRate(params);
      const progressRateRead = await service.readPrdProgressRate(params);

      result.raws.push(service.getRealtimeStatusBodyByGraph('설비가동율', operationRateRead.raws[0].rate));
      result.raws.push(service.getRealtimeStatusBodyByGraph('불량율', rejectRateRead.raws[0].rate));
      result.raws.push(service.getRealtimeStatusBodyByGraph('생산진척율', progressRateRead.raws[0].rate));

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

  //#region 🟡 Update Functions
  //#endregion

  //#region 🟠 Patch Functions
  //#endregion

  //#region 🔴 Delete Functions
  //#endregion

  //#endregion
}

export default DashboardCtl;