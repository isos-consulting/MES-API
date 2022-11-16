import express from 'express';
import config from '../../configs/config';
import AdmLoginLogService from '../../services/adm/use-log.service';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import isServiceResult from '../../utils/isServiceResult';
import response from '../../utils/response_new';
import createApiResult from '../../utils/createApiResult_new';
import { successState } from '../../states/common.state';
import { matchedData } from 'express-validator';
import ApiResult from '../../interfaces/common/api-result.interface';
import AutUserService from '../../services/aut/user.service';
import AdmCompanyOptService from '../../services/adm/company-opt.service';

class AdmUseLogCtl {
  stateTag: string

  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'admUseLog'
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
			let result: ApiResult<any> = { count:0, raws: [] };
      const service = new AdmLoginLogService(req.tenant.uuid);
			const companyOptService = await new AdmCompanyOptService(req.tenant.uuid);
			const userService = new AutUserService(req.tenant.uuid);
			const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = Object.values(matched);
			
			const ip = req.headers['user-ip'] 
			const browser = req.headers['user-browser']
			
			const user = await userService.readByUuid(req.user?.uuid as string);
			// 회사 코드
			const company_cd = await companyOptService.getCompanyOptValue('LOGIN_LOG_COMPANY_CD');

			let loginLog = { ...user.raws[0], ...datas[0], company_cd, ip,	browser }
			console.log(loginLog)
			await service.loginLogCreate([loginLog])

      return createApiResult(res, result, 200, '데이터 생성 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion
}

export default AdmUseLogCtl;