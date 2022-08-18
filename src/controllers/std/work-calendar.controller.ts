import express from 'express';
import config from "../../configs/config";
import { successState } from "../../states/common.state";
import createApiResult from "../../utils/createApiResult_new";
import createDatabaseError from "../../utils/createDatabaseError";
import createUnknownError from "../../utils/createUnknownError";
import isServiceResult from "../../utils/isServiceResult";
import response from "../../utils/response_new";

class StdWorkCalendarCtl {
  stateTag: string;

  constructor() {
    this.stateTag = 'stdWorkCalendar';
  }

  // 📒 Fn[read] (✅ Inheritance): Default Read Function
  public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result = {
        count: 0,
        raws: [
          // {
          //   day: 1,
          //   hour: 8,
          //   work_fg: true,
          // },
          // {
          //   day: 2,
          //   hour: 8,
          //   work_fg: true,
          // },
          // {
          //   day: 3,
          //   hour: 10,
          //   work_fg: true,
          // },
          // {
          //   day: 4,
          //   hour: 8,
          //   work_fg: true,
          // },
          // {
          //   day: 5,
          //   hour: 8,
          //   work_fg: true,
          // },
          // {
          //   day: 8,
          //   hour: 8,
          //   work_fg: true,
          // },
          // {
          //   day: 9,
          //   hour: 8,
          //   work_fg: true,
          // },
          // {
          //   day: 10,
          //   hour: 8,
          //   work_fg: true,
          // },
          // {
          //   day: 11,
          //   hour: 8,
          //   work_fg: true,
          // },
          // {
          //   day: 12,
          //   hour: 8,
          //   work_fg: true,
          // },
          // {
          //   day: 16,
          //   hour: 11,
          //   work_fg: true,
          // },
          // {
          //   day: 17,
          //   hour: 8,
          //   work_fg: true,
          // },
        ]
      }

      result.count = result.raws.length;

      // response(
      //   res, 
      //   { value: { count: result.raws.length, proc_nos: procNos }, raws: result.raws, status: 200, message: { admin_message: '데이터 조회 성공', user_message: '데이터 조회 성공' } },
      //   { state_tag: this.stateTag, type: 'SUCCESS', state_no: successState.READ }
      // );

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };
}

export default StdWorkCalendarCtl;
