import express from 'express';
import { matchedData } from 'express-validator';
import config from '../../configs/config';
import MatReturnService from '../../services/mat/return.service';
import MatReturnDetailService from '../../services/mat/return-detail.service';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import { sequelizes } from '../../utils/getSequelize';
import isServiceResult from '../../utils/isServiceResult';
import response from '../../utils/response_new';
import createApiResult from '../../utils/createApiResult_new';
import { successState } from '../../states/common.state';
import ApiResult from '../../interfaces/common/api-result.interface';
import AdmPatternHistoryService from '../../services/adm/pattern-history.service';
import AdmPatternOptService from '../../services/adm/pattern-opt.service';
import StdStoreService from '../../services/std/store.service';
import InvStoreService from '../../services/inv/store.service';

class MatReturnCtl {
  stateTag: string

  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'matReturn'
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new MatReturnService(req.tenant.uuid);
      const detailService = new MatReturnDetailService(req.tenant.uuid);
      const storeService = new StdStoreService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      const patternOptService = new AdmPatternOptService(req.tenant.uuid);
      const patternService = new AdmPatternHistoryService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        let returnUuid: string;
        let returnId: number;
        let regDate: string;
        let maxSeq: number;
        let headerResult: ApiResult<any> = { count: 0, raws: [] };

        // 📌 자재반출의 UUID가 입력되지 않은 경우 자재반출 신규 발행
        if (!data.header.uuid) {
          // 📌 전표자동발행 옵션 여부 확인
          const hasAutoOption = await patternOptService.hasAutoOption({ table_nm: 'MAT_RETURN_TB', col_nm: 'stmt_no', tran });

          // 📌 전표의 자동발행옵션이 On인 경우
          if (hasAutoOption) {
            data.header.stmt_no = await patternService.getPattern({
              factory_id: data.header.factory_id,
              table_nm: 'MAT_RETURN_TB',
              col_nm: 'stmt_no',
              reg_date: data.header.reg_date,
              uid: req.user?.uid as number,
              tran: tran
            });
          }

          headerResult = await service.create([data.header], req.user?.uid as number, tran);
          returnUuid = headerResult.raws[0].uuid;
          returnId = headerResult.raws[0].return_id;
          regDate = headerResult.raws[0].reg_date;
          maxSeq = 0;
        } else {
          returnUuid = data.header.uuid;
          returnId = data.header.return_id;
          regDate = data.header.reg_date;

          // 📌 Max Seq 계산
          maxSeq = await detailService.getMaxSeq(returnId, tran) as number;
        }

        // 📌 생성된 반출ID 입력 및 Max Seq 기준 Seq 발행
        data.details = data.details.map((detail: any) => {
          detail.return_id = returnId;
          detail.seq = ++maxSeq;
          return detail;
        });

        // 📌 자재반출상세 등록 및 합계금액 계산
        let detailResult = await detailService.create(data.details, req.user?.uid as number, tran);
        detailResult = await detailService.updateTotalPrice(detailResult.raws, req.user?.uid as number, tran);

        // 📌 자재반출의 합계수량 및 합계금액 계산
        headerResult = await service.updateTotal(returnId, returnUuid, req.user?.uid as number, tran);

        // 📌 입력 창고유형에 대한 유효성 검사
        //    (From: 반출창고(Return))
        await storeService.validateStoreTypeByIds(detailResult.raws.map(raw => raw.from_store_id), 'RETURN', tran);

        // 📌 수불 데이터 생성
        const storeResult = await inventoryService.transactInventory(
          detailResult.raws, 'CREATE', 
          { inout: 'FROM', tran_type: 'MAT_RETURN', reg_date: regDate, tran_id_alias: 'return_detail_id' },
          req.user?.uid as number, tran
        );

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws,
          store: storeResult.raws,
        }];
        result.count = headerResult.count + detailResult.count + storeResult.count;
      });

      return createApiResult(res, result, 201, '데이터 생성 성공', this.stateTag, successState.CREATE);
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
      const service = new MatReturnService(req.tenant.uuid);
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

  // 📒 Fn[readByUuid] (✅ Inheritance): Default ReadByUuid Function
  public readByUuid = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new MatReturnService(req.tenant.uuid);

      result = await service.readByUuid(req.params.uuid);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readIncludeDetails]: 자재반출 데이터의 Header + Detail 함께 조회
  public readIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const service = new MatReturnService(req.tenant.uuid);
      const detailService = new MatReturnDetailService(req.tenant.uuid);
      
      const headerResult = await service.readByUuid(params.uuid);
      const detailsResult = await detailService.read({ ...params, return_uuid: params.uuid });

      result.raws = [{ 
        header: headerResult.raws[0] ?? {}, 
        details: detailsResult.raws 
      }];
      result.count = headerResult.count + detailsResult.count;
      
      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readDetails]: 자재반출 데이터의 Detail 조회
  public readDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const detailService = new MatReturnDetailService(req.tenant.uuid);
      
      const result = await detailService.read({ ...params, return_uuid: params.uuid });
      
      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readReport]: 자재반출현황 데이터 조회
  public readReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const service = new MatReturnService(req.tenant.uuid);

      const result = await service.readReport(params);
      
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
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new MatReturnService(req.tenant.uuid);
      const detailService = new MatReturnDetailService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 자재반출 수정
        let headerResult = await service.update([data.header], req.user?.uid as number, tran);

        // 📌 자재반출상세 수정 및 합계금액 계산
        let detailResult = await detailService.update(data.details, req.user?.uid as number, tran);
        detailResult = await detailService.updateTotalPrice(detailResult.raws, req.user?.uid as number, tran);

        // 📌 자재반출의 합계수량 및 합계금액 계산
        const returnId = headerResult.raws[0].return_id;
        const returnUuid = headerResult.raws[0].uuid;
        const regDate = headerResult.raws[0].reg_date;
        headerResult = await service.updateTotal(returnId, returnUuid, req.user?.uid as number, tran);

        // 📌 수불 데이터 수정
        const storeResult = await inventoryService.transactInventory(
          detailResult.raws, 'UPDATE', 
          { inout: 'FROM', tran_type: 'MAT_RETURN', reg_date: regDate, tran_id_alias: 'return_detail_id' },
          req.user?.uid as number, tran
        );

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws,
          store: storeResult.raws,
        }];
        result.count = headerResult.count + detailResult.count + storeResult.count;
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
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new MatReturnService(req.tenant.uuid);
      const detailService = new MatReturnDetailService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 자재반출 수정
        let headerResult = await service.patch([data.header], req.user?.uid as number, tran);

        // 📌 자재반출상세 수정 및 합계금액 계산
        let detailResult = await detailService.patch(data.details, req.user?.uid as number, tran);
        detailResult = await detailService.updateTotalPrice(detailResult.raws, req.user?.uid as number, tran);

        // 📌 자재반출의 합계수량 및 합계금액 계산
        const returnId = headerResult.raws[0].return_id;
        const returnUuid = headerResult.raws[0].uuid;
        const regDate = headerResult.raws[0].reg_date;
        headerResult = await service.updateTotal(returnId, returnUuid, req.user?.uid as number, tran);

        // 📌 수불 데이터 수정
        const storeResult = await inventoryService.transactInventory(
          detailResult.raws, 'UPDATE', 
          { inout: 'FROM', tran_type: 'MAT_RETURN', reg_date: regDate, tran_id_alias: 'return_detail_id' },
          req.user?.uid as number, tran
        );

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws,
          store: storeResult.raws,
        }];
        result.count = headerResult.count + detailResult.count + storeResult.count;
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
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new MatReturnService(req.tenant.uuid);
      const detailService = new MatReturnDetailService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      
      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 수불 데이터 삭제
        const storeResult = await inventoryService.transactInventory(
          data.details, 'DELETE', 
          { inout: 'FROM', tran_type: 'MAT_RETURN', reg_date: '', tran_id_alias: 'return_detail_id' },
          req.user?.uid as number, tran
        );

        // 📌 자재반출상세 삭제
        const detailResult = await detailService.delete(data.details, req.user?.uid as number, tran);
        
        // 📌 전표 내 상세전표 데이터 개수 조회
        //    상세전표개수가 0개일 경우 (전표데이터 삭제)
        //    상세전표개수가 1개 이상일 경우 (전표데이터 합계 데이터 계산)
        const count = await detailService.getCountInHeader(data.header.return_id, tran);
        let headerResult: ApiResult<any>;
        if (count == 0) {
          headerResult = await service.delete([data.header], req.user?.uid as number, tran);
        } else {
          headerResult = await service.updateTotal(data.header.return_id, data.header.uuid, req.user?.uid as number, tran);
        }

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws,
          store: storeResult.raws,
        }];
        result.count = headerResult.count + detailResult.count + storeResult.count;
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

export default MatReturnCtl;