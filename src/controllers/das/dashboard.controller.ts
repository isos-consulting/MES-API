import express = require('express');
import moment = require('moment');
import PrdOrderRepo from '../../repositories/prd/order.repository';
import PrdWorkRepo from '../../repositories/prd/work.repository';
import QmsInspResultRepo from '../../repositories/qms/insp-result.repository';
import SalOrderDetailRepo from '../../repositories/sal/order-detail.repository';
import isNumber from '../../utils/isNumber';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';

class DashboardCtl {
  //#region ✅ Constructor
  constructor() {};
  //#endregion

  public readWorkComparedOrder = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = { ...req.query, ...req.params, reg_date: moment().format('YYYY-MM-DD') };
      const datas = (await new PrdOrderRepo().readWorkComparedOrder(params)).raws[0];

      let rate = datas?.rate ?? 0;
      if (rate > 1) rate = 1;

      const result: any[] = [
        { id: 'completed', label: '완료', value: Number(rate) },
        { id: 'incompleted', label: '미완료', value: 1 - rate }
      ];
  
      return response(res, isNumber(datas?.rate) ? result : [], {});
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  public readPassedInspResult = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const datas = (await new QmsInspResultRepo().readByRegDate(moment().format('YYYY-MM-DD'))).raws;

      const total = datas.length;
      const passed = datas.filter(data => data.insp_result_fg).length;
      const rate = passed / total;

      const result: any[] = [
        { id: 'passed', label: '합격', value: rate ?? 0 },
        { id: 'rejected', label: '불합격', value: 1 - rate ?? 0 }
      ];

      return response(res, isNumber(rate) ? result : [], {});
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  public readDelayedSalOrder = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const datas = (await new SalOrderDetailRepo().readCountOfDelayedOrder(moment().format('YYYY-MM-DD'))).raws;
      const count = datas[0].count ?? 0;

      const result: any[] = [
        { id: 'delayed', label: '납기지연', value: count },
      ];
  
      return response(res, result, {});
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };
  
  public readOperatingRate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const datas = (await new PrdWorkRepo().readOperatingRate(moment().format('YYYY-MM-DD'))).raws;
      const rate = datas[0].rate ?? 0;

      const result: any[] = [
        { id: 'operating_rate', label: '가동율', value: rate },
        { id: 'downtime', label: '비가동', value: 1 - rate }
      ];

      return response(res, rate != null ? result : [], {});
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };
  
  public readDeliveredInWeek = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const startDate = moment().format('YYYY-MM-DD');
      const endDate = moment().add(6, 'days').format('YYYY-MM-DD');

      const datas = (await new SalOrderDetailRepo().readDeliveredWithinPeriod(startDate, endDate)).raws;

      return response(res, datas, {});
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };
}

export default DashboardCtl;