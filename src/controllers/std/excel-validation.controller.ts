import express from 'express';
import { matchedData } from 'express-validator';
import ApiResult from '../../interfaces/common/api-result.interface';
import { successState } from '../../states/common.state';
import createApiResult from '../../utils/createApiResult_new';
import excelValidation from '../../utils/excelValidation';
import response from '../../utils/response_new';
import isServiceResult from '../../utils/isServiceResult';
import createDatabaseError from '../../utils/createDatabaseError';
import config from '../../configs/config';
import createUnknownError from '../../utils/createUnknownError';

class StdExcelValidationCtl {
  stateTag: string

  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'stdExcelValidation'
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public excelValidation = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const matched = matchedData(req, { locations: [ 'body' ] });

      const { header, details } = matched;

      result = await excelValidation(details, header.excel_form_cd, req.tenant.uuid);
      return createApiResult(res, result, 201, '데이터 생성 성공', this.stateTag , successState.CREATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };
  // end region
}

export default StdExcelValidationCtl;