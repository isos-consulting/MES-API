import express = require('express');
import response from '../../utils/response';
import ApiResult from '../../interfaces/common/api-result.interface';
import config from '../../configs/config';
// import { matchedData } from 'express-validator';
import createApiResult from '../../utils/createApiResult_new';
import isServiceResult from '../../utils/isServiceResult';
import { successState } from '../../states/common.state';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';

class StdDataMapCtl {
  stateTag: string;
  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'gatDataHistory';
  };
  //#endregion

  //#region ✅ CRUD Functions


  //#region 🔵 Read Functions

  // 📒 Fn[readInterfaceMonitoring] (✅ Inheritance): readInterfaceMonitoring Read Function
  public readInterfaceMonitoring = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      // const service = new GatDataHistoryService(req.tenant.uuid);
      // const params = matchedData(req, { locations: [ 'query', 'params' ] });
			
      // result = await service.readTempGraph(params);
			result.count = 12
			result.raws.push(
				
				{
					"equip": "엘보 성형기 1호기",
					"status_cd": "run",
					"content": "",
					"value": ""
				},
				{
					"equip": "엘보 성형기 2호기",
					"status_cd": "run",
					"content": "",
					"value": ""
				},
				{
					"equip": "엘보 성형기 3호기",
					"status_cd": "run",
					"content": "",
					"value": ""
				},
				{
					"equip": "교정기 1호기",
					"status_cd": "run",
					"content": "",
					"value": ""
				},
				{
					"equip": "엘보 면취기 1호기",
					"status_cd": "run",
					"content": "",
					"value": ""
				},
				{
					"equip": "엘보 면취기 2호기",
					"status_cd": "run",
					"content": "",
					"value": ""
				},
				{
					"equip": "엘보 면취기 3호기",
					"status_cd": "run",
					"content": "",
					"value": ""
				},
				{
					"equip": "엘보 면취기 4호기",
					"status_cd": "run",
					"content": "",
					"value": ""
				},
				{
					"equip": "엘보 면취기 5호기",
					"status_cd": "run",
					"content": "",
					"value": ""
				},
				{
					"equip": "엘보 면취기 6호기",
					"status_cd": "run",
					"content": "",
					"value": ""
				},
				{
					"equip": "유압 면 가공기 4호기",
					"status_cd": "run",
					"content": "",
					"value": ""
				},
				{
					"equip": "천정 크레인",
					"status_cd": "run",
					"content": "",
					"value": ""
				},
			)

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
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

export default StdDataMapCtl;