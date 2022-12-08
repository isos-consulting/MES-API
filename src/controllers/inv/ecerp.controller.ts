import express from "express";
import { matchedData } from "express-validator";
import config from "../../configs/config";
import ApiResult from "../../interfaces/common/api-result.interface";
import InvEcerpService from "../../services/inv/ecerp.service";
import MatReceiveDetailService from "../../services/mat/receive-detail.service";
import MatReceiveService from "../../services/mat/receive.service";
import SalOutgoDetailService from "../../services/sal/outgo-detail.service";
import SalOutgoService from "../../services/sal/outgo.service";
import { successState } from "../../states/common.state";
import createApiResult from "../../utils/createApiResult_new";
import createDatabaseError from "../../utils/createDatabaseError";
import createUnknownError from "../../utils/createUnknownError";
import { sequelizes } from "../../utils/getSequelize";
import isServiceResult from "../../utils/isServiceResult";
import response from "../../utils/response_new";

class InvEcerpCtl {
  stateTag: string;

  //#region ✅ Constructor
  constructor () {
    this.stateTag = 'invEcerp';
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new InvEcerpService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async (tran: any) => {
        result = await service.create(datas, req.user?.uid as number, tran);
      });

      return createApiResult(res, result, 201, '데이터 생성 성공', this.stateTag, successState.CREATE);
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
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new InvEcerpService(req.tenant.uuid);
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

  // 📒 Fn[readMatReceive] (✅ Inheritance): Read MatReceiveDetails Function
  public readMatReceive = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new InvEcerpService(req.tenant.uuid);
      const matReceiveService = new MatReceiveService(req.tenant.uuid);
      const matReceiveDetailService = new MatReceiveDetailService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      
      const headerDetailObject: any = {};

      (await service.readMatReceive(params)).raws.forEach((data: any) => {
        if (headerDetailObject[data.header_id] === undefined) {
          headerDetailObject[data.header_id] = [];
        }
        headerDetailObject[data.header_id].push(data.detail_id);
      });
      
      const headerDataObject: any = {};
      (await matReceiveService.readByIds({Ids: Object.keys(headerDetailObject)})).raws.forEach((header: any) => {
        const { reg_date, partner_uuid, partner_cd, partner_nm } = header; 
        headerDataObject[header.receive_id] = { reg_date, partner_uuid, partner_cd, partner_nm };
      });

      for (let headerId of Object.keys(headerDetailObject)) {
        const header = headerDataObject[headerId];
        const detailIds = headerDetailObject[headerId];
        let details = await matReceiveDetailService.read({detailIds: detailIds});
        
        if (header) {
          details.raws = details.raws.map((detail: any) => {
            return { ...detail, ...header }
          });
        }

        result.raws.push(...details.raws);
      }

      result.count = result.raws.length;

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readSalOutgo] (✅ Inheritance): Read SalOutgoDetails Function
  public readSalOutgo = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new InvEcerpService(req.tenant.uuid);
      const salOutgoService = new SalOutgoService(req.tenant.uuid);
      const salOutgoDetailService = new SalOutgoDetailService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      
      const headerDetailObject: any = {};
      
      (await service.readSalOutgo(params)).raws.forEach((data: any) => {
        if (headerDetailObject[data.header_id] === undefined) {
          headerDetailObject[data.header_id] = [];
        }
        headerDetailObject[data.header_id].push(data.detail_id);
      });

      const headerDataObject: any = {};
      (await salOutgoService.readByIds({Ids: Object.keys(headerDetailObject)})).raws.forEach((header: any) => {
        const { reg_date, partner_uuid, partner_cd, partner_nm } = header; 
        headerDataObject[header.outgo_id] = { reg_date, partner_uuid, partner_cd, partner_nm };
      });

      for (let headerId of Object.keys(headerDetailObject)) {
        const header = headerDataObject[headerId];
        const detailIds = headerDetailObject[headerId];
        let details = await salOutgoDetailService.read({detailIds: detailIds});
        
        if (header) {
          details.raws = details.raws.map((detail: any) => {
            return { ...detail, ...header }
          });
        }

        result.raws.push(...details.raws);
      }

      result.count = result.raws.length;

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readByUuid] (✅ Inheritance): Default ReadByUuid Function
  public readByUuid = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: []} ;
      const service = new InvEcerpService(req.tenant.uuid);
      
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
      const service = new InvEcerpService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async (tran: any) => {
        result = await service.update(datas, req.user?.uid as number, tran);
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch] (✅ Inheritance): Default Patch Function
  public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new InvEcerpService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async (tran: any) => {
        result = await service.patch(datas, req.user?.uid as number, tran);
      });
      
      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.PATCH);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new InvEcerpService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = Object.values(matched);
      
      await sequelizes[req.tenant.uuid].transaction(async (tran: any) => {
        result = await service.delete(datas, req.user?.uid as number, tran);
      });

      return createApiResult(res, result, 200, '데이터 삭제 성공', this.stateTag, successState.DELETE);
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

export default InvEcerpCtl;