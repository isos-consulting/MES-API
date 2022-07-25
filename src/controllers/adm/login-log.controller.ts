import express from 'express';
import { matchedData } from 'express-validator';
import config from '../../configs/config';
import AdmLoginLogService from '../../services/adm/login-log.service';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import isServiceResult from '../../utils/isServiceResult';
import response from '../../utils/response_new';
import createApiResult from '../../utils/createApiResult_new';
import { successState } from '../../states/common.state';
import ApiResult from '../../interfaces/common/api-result.interface';
import AutUserService from '../../services/aut/user.service';
import { LOGIN_LOG_TYPE } from '../../utils/enmType';

class AdmLoginLogCtl {
  stateTag: string

  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'admLoginLog'
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
			let result: ApiResult<any> = { count:0, raws: [] };
      const service = new AdmLoginLogService(req.tenant.uuid);
			const userService = new AutUserService(req.tenant.uuid);
			
			const ip = req.headers['custom-ip'] || req.socket.remoteAddress;
			const browser = req.headers['custom-browser']
			const company = req.headers['restrict-access-to-tenants']
			
			const user = await userService.readByUuid(req.user?.uuid as string);
			let loginLog = { ...user.raws[0], ip,	browser, company }
			await service.loginLogCreate([loginLog], LOGIN_LOG_TYPE.LOGOUT)

      return createApiResult(res, result, 200, '데이터 생성 성공', this.stateTag, successState.READ);
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
      const service = new AdmLoginLogService(req.tenant.uuid);
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

  //#endregion

  //#endregion
}

export default AdmLoginLogCtl;