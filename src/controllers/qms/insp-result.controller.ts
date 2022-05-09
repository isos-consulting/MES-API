import express = require('express');
import ApiResult from '../../interfaces/common/api-result.interface';
import isNumber from '../../utils/isNumber';
import config from '../../configs/config';
import QmsInspResultService from '../../services/qms/insp-result.service';
import { matchedData } from 'express-validator';
import QmsInspResultDetailInfoService from '../../services/qms/insp-result-detail-info.service';
import QmsInspResultDetailValueService from '../../services/qms/insp-result-detail-value.service';
import AdmInspTypeService from '../../services/adm/insp-type.service';
import MatIncomeService from '../../services/mat/income.service';
import OutIncomeService from '../../services/out/income.service';
import AdmInspDetailTypeService from '../../services/adm/insp-detail-type.service';
import StdStoreService from '../../services/std/store.service';
import InvStoreService from '../../services/inv/store.service';
import MatReceiveDetailService from '../../services/mat/receive-detail.service';
import OutReceiveDetailService from '../../services/out/receive-detail.service';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import { sequelizes } from '../../utils/getSequelize';
import isServiceResult from '../../utils/isServiceResult';
import response from '../../utils/response_new';
import createApiResult from '../../utils/createApiResult_new';
import { errorState, successState } from '../../states/common.state';
import PrdWorkService from '../../services/prd/work.service';
import createApiError from '../../utils/createApiError';

class QmsInspResultCtl {
  stateTag: string;
  constructor() {
    this.stateTag = 'qmsInspResult';
  };

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[createReceiveInsp]: Receive Inspection(수입검사) 데이터 생성
  public createReceiveInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const detailInfoService = new QmsInspResultDetailInfoService(req.tenant.uuid);
      const detailValueService = new QmsInspResultDetailValueService(req.tenant.uuid);
      const inspTypeService = new AdmInspTypeService(req.tenant.uuid);
      const inspDetailTypeService = new AdmInspDetailTypeService(req.tenant.uuid);
      const matReceiveDetailService = new MatReceiveDetailService(req.tenant.uuid);
      const matIncomeService = new MatIncomeService(req.tenant.uuid);
      const outReceiveDetailService = new OutReceiveDetailService(req.tenant.uuid);
      const outIncomeService = new OutIncomeService(req.tenant.uuid);
      const storeService = new StdStoreService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailInfoService.convertFk(matched.details),
      }
      
      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 수입검사 성적서 Create Flow
        // ✅ 1. 검사 성적서 및 상세 데이터 생성
        // ✅ 2. 합격 수량 => 자재 또는 외주 입고 => 입고 창고 수불
        // ✅ 3. 부적합 수량 => 부적합 창고 수불

        // 📌 검사 성적서 및 상세 데이터 Setting
        const inspTypeId: number = await inspTypeService.getIdByCd('RECEIVE_INSP');
        data.header.seq = await service.getMaxSeq(inspTypeId, data.header.insp_detail_type_id, data.header.insp_reference_id);
        data.header.seq++;

          // ✅ 검사 성적서 및 상세 데이터 생성
        const headerResult = await service.create([data.header], req.user?.uid as number, tran);

        const detailInfoResults: ApiResult<any> = { raws: [], count: 0 };
        const detailValueResults: ApiResult<any> = { raws: [], count: 0 };

        for await (const detail of data.details) {
          const header = headerResult.raws[0];

          let detailValues = detail.values;
          delete detail.values;
          detail.factory_id = header.factory_id;
          detail.insp_result_id = header.insp_result_id;

          // 📌 성적서 세부정보 저장
          const detailInfoResult = await detailInfoService.create([detail], req.user?.uid as number, tran);
          detailInfoResults.raws = detailInfoResults.raws.concat(detailInfoResult.raws);
          detailInfoResults.count += detailInfoResult.count;

          // 📌 성적서 세부 값에 세부정보 ID 입력
          detailValues = detailValues.map((value: any) => {
            value.factory_id = detailInfoResult.raws[0]?.factory_id;
            value.insp_result_detail_info_id = detailInfoResult.raws[0]?.insp_result_detail_info_id;
            return value;
          })

          // 📌 성적서 세부 값 저장
          const detailValueResult = await detailValueService.create(detailValues, req.user?.uid as number, tran); 
          detailValueResults.raws = detailValueResults.raws.concat(detailValueResult.raws);
          detailValueResults.count += detailValueResult.count;
        }

        // 📌 성적서 합불 수량 대비 창고 수불데이터 Setting
        let storeResult: ApiResult<any> = { raws: [], count: 0 };
        let receiveDetailResult: ApiResult<any> = { raws: [], count: 0 };
        let incomeResult: ApiResult<any> = { raws: [], count: 0 };
        let incomeParams = [];
        let incomeBody = [];

        // 📌 검사상세유형 정보 가져오기
        const inspDetailType = await inspDetailTypeService.readByUuid(data.header.insp_detail_type_uuid);
        const inspDetailTypeCd = inspDetailType.raws[0].insp_detail_type_cd;
        // ✅ 합격 수량 => 자재 또는 외주 입고 => 입고 창고 수불
        if (data.header.pass_qty > 0) {
          switch(inspDetailTypeCd) {
            case 'MAT_RECEIVE': 
              receiveDetailResult = await matReceiveDetailService.readRawByUuid(data.header.receive_detail_uuid);
              incomeParams = [{
                ...headerResult.raws[0].dataValues,
                receive_detail_id: data.header.receive_detail_id,
                unit_id: receiveDetailResult.raws[0].unit_id,
                qty: data.header.pass_qty
              }];
              incomeBody = await matIncomeService.getIncomeBody(incomeParams, data.header.reg_date);
              await storeService.validateStoreTypeByIds(incomeBody.map(body => body.to_store_id), 'AVAILABLE', tran);
              incomeResult = await matIncomeService.create(incomeBody, req.user?.uid as number, tran);

              storeResult = await inventoryService.transactInventory(
                incomeResult.raws, 'CREATE', 
                { inout: 'TO', tran_type: 'MAT_INCOME', reg_date: data.header.reg_date, tran_id_alias: 'income_id' },
                req.user?.uid as number, tran
              );
              break;

            case 'OUT_RECEIVE': 
              receiveDetailResult = await outReceiveDetailService.readRawByUuid(data.header.receive_detail_uuid);
              incomeParams = [{
                ...headerResult.raws[0].dataValues,
                receive_detail_id: data.header.receive_detail_id,
                unit_id: receiveDetailResult.raws[0].unit_id,
                qty: data.header.pass_qty
              }]
              incomeBody = await outIncomeService.getIncomeBody(incomeParams, data.header.reg_date);
              await storeService.validateStoreTypeByIds(incomeBody.map(body => body.to_store_id), 'AVAILABLE', tran);
              incomeResult = await outIncomeService.create(incomeBody, req.user?.uid as number, tran);

              storeResult = await inventoryService.transactInventory(
                incomeResult.raws, 'CREATE', 
                { inout: 'TO', tran_type: 'OUT_INCOME', reg_date: data.header.reg_date, tran_id_alias: 'income_id' },
                req.user?.uid as number, tran
              );
              break;

            default: break;
          }
        }

        // ✅ 부적합 수량 => 부적합 창고 수불
        let rejectStoreResult: ApiResult<any> = { raws: [], count: 0 };
        let storeParams = [];
        let rejectStoreBody: any = [];
        if (data.header.reject_qty > 0) {
          switch(inspDetailTypeCd) {
            case 'MAT_RECEIVE': 
              receiveDetailResult = await matReceiveDetailService.readRawByUuid(data.header.receive_detail_uuid);
              storeParams = [{
                ...headerResult.raws[0].dataValues,
                unit_id: receiveDetailResult.raws[0].unit_id,
                qty: data.header.reject_qty
              }];
              rejectStoreBody = await service.getStoreBody(storeParams, data.header.reg_date);
              break;

            case 'OUT_RECEIVE': 
              receiveDetailResult = await outReceiveDetailService.readRawByUuid(data.header.receive_detail_uuid);
              storeParams = [{
                ...headerResult.raws[0].dataValues,
                unit_id: receiveDetailResult.raws[0].unit_id,
                qty: data.header.reject_qty
              }];
              rejectStoreBody = await service.getStoreBody(storeParams, data.header.reg_date);
              break;

            default: break;
          }

          await storeService.validateStoreTypeByIds(rejectStoreBody.map((body: any) => body.to_store_id), 'REJECT', tran);
          rejectStoreResult = await inventoryService.transactInventory(
            rejectStoreBody, 'CREATE', 
            { inout: 'TO', tran_type: 'QMS_RECEIVE_INSP_REJECT', reg_date: data.header.reg_date, tran_id_alias: 'insp_result_id' },
            req.user?.uid as number, tran
          );
        }

        result.raws.push({
          result: {
            header: headerResult.raws,
            detailInfos: detailInfoResults.raws,
            detailValues: detailValueResults.raws
          },
          income: incomeResult.raws,
          store: [...storeResult.raws, ...rejectStoreResult.raws]
        });

        result.count += headerResult.count + detailInfoResults.count + detailValueResults.count + incomeResult.count + storeResult.count + rejectStoreResult.count;
      });

      return createApiResult(res, result, 201, '데이터 생성 성공', this.stateTag, successState.CREATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[createProcInsp]: Proc Inspection(공정검사) 데이터 생성
  public createProcInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const detailInfoService = new QmsInspResultDetailInfoService(req.tenant.uuid);
      const detailValueService = new QmsInspResultDetailValueService(req.tenant.uuid);
      const inspTypeService = new AdmInspTypeService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailInfoService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 공정검사 성적서 Create Flow
        // ✅ 1. 검사 성적서 및 상세 데이터 생성

        // 📌 검사 성적서 및 상세 데이터 Setting
        const inspTypeId: number = await inspTypeService.getIdByCd('PROC_INSP');
        data.header.seq = await service.getMaxSeq(inspTypeId, data.header.insp_detail_type_id, data.header.insp_reference_id);
        data.header.seq++;

        // ✅ 검사 성적서 및 상세 데이터 생성
        const headerResult = await service.create([data.header], req.user?.uid as number, tran);

        const detailInfoResults: ApiResult<any> = { raws: [], count: 0 };
        const detailValueResults: ApiResult<any> = { raws: [], count: 0 };

        for await (const detail of data.details) {
          const header = headerResult.raws[0];

          let detailValues = detail.values;
          delete detail.values;
          detail.factory_id = header.factory_id;
          detail.insp_result_id = header.insp_result_id;

          // 📌 성적서 세부정보 저장
          const detailInfoResult = await detailInfoService.create([detail], req.user?.uid as number, tran);
          detailInfoResults.raws = detailInfoResults.raws.concat(detailInfoResult.raws);
          detailInfoResults.count += detailInfoResult.count;

          // 📌 성적서 세부 값에 세부정보 ID 입력
          detailValues = detailValues.map((value: any) => {
            value.factory_id = detailInfoResult.raws[0]?.factory_id;
            value.insp_result_detail_info_id = detailInfoResult.raws[0]?.insp_result_detail_info_id;
            return value;
          })

          // 📌 성적서 세부 값 저장
          const detailValueResult = await detailValueService.create(detailValues, req.user?.uid as number, tran); 
          detailValueResults.raws = detailValueResults.raws.concat(detailValueResult.raws);
          detailValueResults.count += detailValueResult.count;
        }

        result.raws.push({
          result: {
            header: headerResult.raws,
            detailInfos: detailInfoResults.raws,
            detailValues: detailValueResults.raws
          },
        });

        result.count += headerResult.count + detailInfoResults.count + detailValueResults.count;
      });

      return createApiResult(res, result, 201, '데이터 생성 성공', this.stateTag, successState.CREATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[createFinalInsp]: Final Inspection(최종검사) 데이터 생성
  public createFinalInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const detailInfoService = new QmsInspResultDetailInfoService(req.tenant.uuid);
      const detailValueService = new QmsInspResultDetailValueService(req.tenant.uuid);
      const inspTypeService = new AdmInspTypeService(req.tenant.uuid);
      const inspDetailTypeService = new AdmInspDetailTypeService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailInfoService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 최종검사 성적서 Create Flow
          // ✅ 1. 검사 성적서 및 상세 데이터 생성
          // ✅ 2. 성적서 합불 수량 대비 창고 수불

          // 📌 검사 성적서 및 상세 데이터 Setting
          const inspTypeId: number = await inspTypeService.getIdByCd('FINAL_INSP');
          const inspDetailTypeId: number = await inspDetailTypeService.getIdByCd('FINAL_INSP');
          data.header.seq = await service.getMaxSeq(inspTypeId, inspDetailTypeId, data.header.insp_reference_id);
          data.header.seq++;

          // ✅ 검사 성적서 및 상세 데이터 생성
          const headerResult = await service.create([data.header], req.user?.uid as number, tran);

          const detailInfoResults: ApiResult<any> = { raws: [], count: 0 };
          const detailValueResults: ApiResult<any> = { raws: [], count: 0 };

          for await (const detail of data.details) {
            const header = headerResult.raws[0];

            let detailValues = detail.values;
            delete detail.values;
            detail.factory_id = header.factory_id;
            detail.insp_result_id = header.insp_result_id;

            // 📌 성적서 세부정보 저장
            const detailInfoResult = await detailInfoService.create([detail], req.user?.uid as number, tran);
            detailInfoResults.raws = detailInfoResults.raws.concat(detailInfoResult.raws);
            detailInfoResults.count += detailInfoResult.count;

            // 📌 성적서 세부 값에 세부정보 ID 입력
            detailValues = detailValues.map((value: any) => {
              value.factory_id = detailInfoResult.raws[0]?.factory_id;
              value.insp_result_detail_info_id = detailInfoResult.raws[0]?.insp_result_detail_info_id;
              return value;
            })

            // 📌 성적서 세부 값 저장
            const detailValueResult = await detailValueService.create(detailValues, req.user?.uid as number, tran); 
            detailValueResults.raws = detailValueResults.raws.concat(detailValueResult.raws);
            detailValueResults.count += detailValueResult.count;
          }

          // ✅ 성적서 합불 수량 대비 창고 수불 데이터 생성
          // 📌 합격수량 => 가용 창고 수불 (IN)
          const fromStoreResult: ApiResult<any> = { raws: [], count: 0 };
          const toStoreResult: ApiResult<any> = { raws: [], count: 0 };
          if (data.header.pass_qty > 0) { 
            const fromStoreResultByPass = await inventoryService.transactInventory(
              headerResult.raws, 'CREATE', 
              { inout: 'FROM', tran_type: 'QMS_FINAL_INSP_INCOME', tran_id_alias: 'insp_result_id', qty_alias: 'pass_qty' },
              req.user?.uid as number, tran
            );
            fromStoreResult.raws = [...fromStoreResultByPass.raws];
            fromStoreResult.count += fromStoreResultByPass.count;

            const toStoreResultByPass = await inventoryService.transactInventory(
              headerResult.raws, 'CREATE', 
              { inout: 'TO', tran_type: 'QMS_FINAL_INSP_INCOME', tran_id_alias: 'insp_result_id', qty_alias: 'pass_qty' },
              req.user?.uid as number, tran
            );
            toStoreResult.raws = [...toStoreResultByPass.raws];
            toStoreResult.count += toStoreResultByPass.count;
          }
          // 📌 불합격수량 => 부적합 창고 수불
          if (data.header.reject_qty > 0) { 
            const fromStoreResultByReject = await inventoryService.transactInventory(
              headerResult.raws, 'CREATE', 
              { inout: 'FROM', tran_type: 'QMS_FINAL_INSP_REJECT', tran_id_alias: 'insp_result_id', qty_alias: 'reject_qty' },
              req.user?.uid as number, tran
            );
            fromStoreResult.raws = [...fromStoreResultByReject.raws];
            fromStoreResult.count += fromStoreResultByReject.count;

            const toStoreResultByReject = await inventoryService.transactInventory(
              headerResult.raws, 'CREATE', 
              { inout: 'TO', tran_type: 'QMS_FINAL_INSP_REJECT', tran_id_alias: 'insp_result_id', qty_alias: 'reject_qty', store_alias: 'reject_store_id', location_alias: 'reject_location_id' },
              req.user?.uid as number, tran
            );
            toStoreResult.raws = [...toStoreResultByReject.raws];
            toStoreResult.count += toStoreResultByReject.count;
          }

          result.raws.push({
            result: {
              header: headerResult.raws,
              detailInfos: detailInfoResults.raws,
              detailValues: detailValueResults.raws
            },
            fromStore: fromStoreResult.raws,
            toStore: toStoreResult.raws
          });

          result.count += headerResult.count + detailInfoResults.count + detailValueResults.count + fromStoreResult.count + toStoreResult.count;
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
  // 📒 Fn[readWaitingReceive]: 수입검사 성적서 대기 List Read Function
  public readWaitingReceive = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      result = await service.readWaitingReceive(params);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readReceive]: 수입검사 성적서 Read Function
  public readReceive = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const inspDetailTypeService = new AdmInspDetailTypeService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      if (!params.insp_detail_type_uuid) {
        const matReceiveRead = await service.readMatReceive(params);
        const outReceiveRead = await service.readOutReceive(params);

        result.raws = [...matReceiveRead.raws, ...outReceiveRead.raws];
        result.count = matReceiveRead.count + outReceiveRead.count;

      } else {
        const inspDetailTypeResult = await inspDetailTypeService.readByUuid(params.insp_detail_type_uuid);
        const inspDeatilTypeCd = await inspDetailTypeResult.raws[0].insp_detail_type_cd;

        switch (inspDeatilTypeCd) {
          case 'MAT_RECEIVE': 
            result = params.receive_detail_uuid ? await service.readMatReceiveByUuid(params.receive_detail_uuid) : await service.readMatReceive(params); 
            break;
  
          case 'OUT_RECEIVE': 
            result = params.receive_detail_uuid ? await service.readOutReceiveByUuid(params.receive_detail_uuid) : await service.readOutReceive(params); 
            break;
        }
      }
  
      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readReceiveIncludeDetails]: 수입검사 성적서 데이터의 Header + Detail 함께 조회
  public readReceiveIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const detailInfoService = new QmsInspResultDetailInfoService(req.tenant.uuid);
      const detailValueService = new QmsInspResultDetailValueService(req.tenant.uuid);
      const inspDetailTypeService = new AdmInspDetailTypeService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      let headerResult: ApiResult<any> = { raws: [], count: 0 };
      // 📌 수입검사 상세유형 조회
      const inspResultRead = await service.readRawByUuid(params.uuid);

      // ❗ 등록되어있는 성적서가 없을 경우 Error Throw
      if (inspResultRead.raws[0]) { 
        (params as any).insp_result_uuid = params.uuid;
      } else {
        throw createApiError(
          400, 
          '성적서 조회결과가 없습니다.', 
          this.stateTag, 
          errorState.NO_DATA
        );
      }

      const inspDetailTypeResult = await inspDetailTypeService.readRawById(inspResultRead.raws[0].insp_detail_type_id);
      const inspDeatilTypeCd = await inspDetailTypeResult.raws[0].insp_detail_type_cd;

      // 📌 수입검사 유형에 따라 성적서 Header 조회
      switch (inspDeatilTypeCd) {
        case 'MAT_RECEIVE': headerResult = await service.readMatReceiveByUuid(params.uuid); break;
        case 'OUT_RECEIVE': headerResult = await service.readOutReceiveByUuid(params.uuid); break;
      }

      // 📌 insp_detail_type(세부검사유형)에 따라 작업자 검사 혹은 QC 검사 항목만 조회
      if (inspDetailTypeResult.raws[0].worker_fg == '1') { (params as any).worker_fg = true; }
      if (inspDetailTypeResult.raws[0].inspector_fg == '1') { (params as any).inspector_fg = true; }
      
      const detailInfoResult = await detailInfoService.read(params);
      let detailsResult: ApiResult<any> = { raws: [], count: detailInfoResult.count };
      let maxSampleCnt: number = 0;

      // 📌 성적서 세부 데이터 Setting 및 작업자, 검사원별 Max 시료수를 계산하여 Header에 입력
      for await (const info of detailInfoResult.raws) {
        const detailValueResult = await detailValueService.read({ insp_result_detail_info_uuid: info.insp_result_detail_info_uuid });
        detailsResult.count += detailValueResult.count;

        detailValueResult.raws.forEach((raw: any) => {
          info['x' + raw.sample_no + '_insp_result_detail_value_uuid'] = raw.insp_result_detail_value_uuid;
          info['x' + raw.sample_no + '_sample_no'] = raw.sample_no;
          info['x' + raw.sample_no + '_insp_result_fg'] = raw.insp_result_fg;
          info['x' + raw.sample_no + '_insp_result_state'] = raw.insp_result_state;

          if (!isNumber(info.spec_min) && !isNumber(info.spec_max)) {
            // 📌 최소 값, 최대 값이 입력되지 않은 경우 1: OK, 0: NG, 이외의 값은 공백으로 전달
            info['x' + raw.sample_no + '_insp_value'] = raw.insp_value == 1 ? 'OK' : raw.insp_value == 0 ? 'NG' : '';
          } else {
            // 📌 소수점 입력된 자리까지 변환하여 전달
            info['x' + raw.sample_no + '_insp_value'] = Number(raw.insp_value);
          }
        });
        detailsResult.raws.push(info);

        // 📌 insp_detail_type(세부검사유형)이 작업자 검사인지 QC 검사인지 구분
        if (inspDetailTypeResult.raws[0].worker_fg) { 
          info.sample_cnt = info.worker_sample_cnt; delete info.worker_sample_cnt;
          info.insp_cycle = info.worker_insp_cycle; delete info.worker_insp_cycle;
        }
        if (inspDetailTypeResult.raws[0].inspector_fg) { 
          info.sample_cnt = info.inspector_sample_cnt; delete info.inspector_sample_cnt;
          info.insp_cycle = info.inspector_insp_cycle; delete info.inspector_insp_cycle;
        }

        if (info.sample_cnt > maxSampleCnt) { maxSampleCnt = info.sample_cnt; }
      }
      headerResult.raws[0].max_sample_cnt = maxSampleCnt;
      
      result.raws = [{ 
        header: headerResult.raws[0], 
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

  // 📒 Fn[readProc]: 공정검사 성적서 Read Function
  public readProc = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      result = await service.readProc(params);
      // if (params.work_uuid) { result = await service.readProcByUuid(params.work_uuid); }
      // else {  }
  
      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readProcIncludeDetails]: 공정검사 성적서 데이터의 Header + Detail 함께 조회
  public readProcIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const detailInfoService = new QmsInspResultDetailInfoService(req.tenant.uuid);
      const detailValueService = new QmsInspResultDetailValueService(req.tenant.uuid);
      const inspDetailTypeService = new AdmInspDetailTypeService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      const headerResult = await service.readProcByUuid(params.uuid);
      // ❗ 등록되어있는 성적서가 없을 경우 Error Throw
      if (headerResult.raws[0]) { 
        (params as any).insp_result_uuid = params.uuid;
      } else {
        throw createApiError(
          400, 
          '성적서 조회결과가 없습니다.', 
          this.stateTag, 
          errorState.NO_DATA
        );
      }
      
      // 📌 insp_detail_type(세부검사유형)에 따라 작업자 검사 혹은 QC 검사 항목만 조회
      const inspDetailTypeResult = await inspDetailTypeService.readByUuid(headerResult.raws[0].insp_detail_type_uuid);
      if (inspDetailTypeResult.raws[0].worker_fg == '1') { (params as any).worker_fg = true; }
      if (inspDetailTypeResult.raws[0].inspector_fg == '1') { (params as any).inspector_fg = true; }

      const detailInfoResult = await detailInfoService.read(params);
      let detailsResult: ApiResult<any> = { raws: [], count: detailInfoResult.count };
      let maxSampleCnt: number = 0;

      // 📌 성적서 세부 데이터 Setting 및 작업자, 검사원별 Max 시료수를 계산하여 Header에 입력
      for await (const info of detailInfoResult.raws) {
        const detailValueResult = await detailValueService.read({ insp_result_detail_info_uuid: info.insp_result_detail_info_uuid });
        detailsResult.count += detailValueResult.count;

        detailValueResult.raws.forEach((raw: any) => {
          info['x' + raw.sample_no + '_insp_result_detail_value_uuid'] = raw.insp_result_detail_value_uuid;
          info['x' + raw.sample_no + '_sample_no'] = raw.sample_no;
          info['x' + raw.sample_no + '_insp_result_fg'] = raw.insp_result_fg;
          info['x' + raw.sample_no + '_insp_result_state'] = raw.insp_result_state;

          if (!isNumber(info.spec_min) && !isNumber(info.spec_max)) {
            // 📌 최소 값, 최대 값이 입력되지 않은 경우 1: OK, 0: NG, 이외의 값은 공백으로 전달
            info['x' + raw.sample_no + '_insp_value'] = raw.insp_value == 1 ? 'OK' : raw.insp_value == 0 ? 'NG' : '';
          } else {
            // 📌 소수점 입력된 자리까지 변환하여 전달
            info['x' + raw.sample_no + '_insp_value'] = Number(raw.insp_value);
          }
        });
        detailsResult.raws.push(info);

        // 📌 insp_detail_type(세부검사유형)이 작업자 검사인지 QC 검사인지 구분
        if (inspDetailTypeResult.raws[0].worker_fg) { 
          info.sample_cnt = info.worker_sample_cnt; delete info.worker_sample_cnt;
          info.insp_cycle = info.worker_insp_cycle; delete info.worker_insp_cycle;
        }
        if (inspDetailTypeResult.raws[0].inspector_fg) { 
          info.sample_cnt = info.inspector_sample_cnt; delete info.inspector_sample_cnt;
          info.insp_cycle = info.inspector_insp_cycle; delete info.inspector_insp_cycle;
        }

        if (info.sample_cnt > maxSampleCnt) { maxSampleCnt = info.sample_cnt; }
      }
      headerResult.raws[0].max_sample_cnt = maxSampleCnt;

      result.raws = [{ 
        header: headerResult.raws[0], 
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

  // 📒 Fn[readProcDetailsByWork]: 실적기준 모든 차수의 공정검사 성적서 Detail 데이터 조회
  public readProcDetailsByWork = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const detailInfoService = new QmsInspResultDetailInfoService(req.tenant.uuid);
      const detailValueService = new QmsInspResultDetailValueService(req.tenant.uuid);
      const inspDetailTypeService = new AdmInspDetailTypeService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      let maxSampleCnt: number = 0;
      const headerResult = await service.readProc(params);
      for await (const header of headerResult.raws) {
        // 📌 insp_detail_type(세부검사유형)에 따라 작업자 검사 혹은 QC 검사 항목만 조회
        const inspDetailTypeResult = await inspDetailTypeService.readByUuid(params.insp_detail_type_uuid);

        const detailParams: any = { insp_result_uuid: header.insp_result_uuid };
        if (inspDetailTypeResult.raws[0].worker_fg == '1') { detailParams.worker_fg = true; }
        if (inspDetailTypeResult.raws[0].inspector_fg == '1') { detailParams.inspector_fg = true; }

        const detailInfoResult = await detailInfoService.read(detailParams);
        let detailsResult: ApiResult<any> = { raws: [], count: detailInfoResult.count };

        // 📌 성적서 세부 데이터 Setting 및 작업자, 검사원별 Max 시료수를 계산하여 Header에 입력
        for await (const info of detailInfoResult.raws) {
          const detailValueResult = await detailValueService.read({ insp_result_detail_info_uuid: info.insp_result_detail_info_uuid });
          detailsResult.count += detailValueResult.count;

          detailValueResult.raws.forEach((raw: any) => {
            info['x' + raw.sample_no + '_insp_result_detail_value_uuid'] = raw.insp_result_detail_value_uuid;
            info['x' + raw.sample_no + '_sample_no'] = raw.sample_no;
            info['x' + raw.sample_no + '_insp_result_fg'] = raw.insp_result_fg;
            info['x' + raw.sample_no + '_insp_result_state'] = raw.insp_result_state;

            if (!isNumber(info.spec_min) && !isNumber(info.spec_max)) {
              // 📌 최소 값, 최대 값이 입력되지 않은 경우 1: OK, 0: NG, 이외의 값은 공백으로 전달
              info['x' + raw.sample_no + '_insp_value'] = raw.insp_value == 1 ? 'OK' : raw.insp_value == 0 ? 'NG' : '';
            } else {
              // 📌 소수점 입력된 자리까지 변환하여 전달
              info['x' + raw.sample_no + '_insp_value'] = Number(raw.insp_value);
            }
          });
          detailsResult.raws.push(info);

          // 📌 insp_detail_type(세부검사유형)이 작업자 검사인지 QC 검사인지 구분
        if (inspDetailTypeResult.raws[0].worker_fg) { 
          info.sample_cnt = info.worker_sample_cnt; delete info.worker_sample_cnt;
          info.insp_cycle = info.worker_insp_cycle; delete info.worker_insp_cycle;
        }
        if (inspDetailTypeResult.raws[0].inspector_fg) { 
          info.sample_cnt = info.inspector_sample_cnt; delete info.inspector_sample_cnt;
          info.insp_cycle = info.inspector_insp_cycle; delete info.inspector_insp_cycle;
        }

          if (info.sample_cnt > maxSampleCnt) { maxSampleCnt = info.sample_cnt; }
        }
        headerResult.raws[0].max_sample_cnt = maxSampleCnt;
        
        result.raws = result.raws.concat(detailsResult.raws);
        result.count += detailsResult.count;
      }
      
      //📌 Value Object 추가되는 부분 처리를 위한 Response Function 직접 호출
      return response(
        res, 
        { value: { count: result.count, max_sample_cnt: maxSampleCnt }, raws: result.raws, status: 200, message: '데이터 조회 성공' },
        { state_tag: this.stateTag, type: 'SUCCESS', state_no: successState.READ }
      );
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readFinal]: 최종검사 성적서 Read Function
  public readFinal = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      
      result = await service.readFinal(params);
      
      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readFinalIncludeDetails]: 최종검사 성적서 데이터의 Header + Detail 함께 조회
  public readFinalIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const detailInfoService = new QmsInspResultDetailInfoService(req.tenant.uuid);
      const detailValueService = new QmsInspResultDetailValueService(req.tenant.uuid);
      const inspDetailTypeService = new AdmInspDetailTypeService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      const headerResult = await service.readFinalByUuid(params.uuid);
      if (headerResult.raws[0]) { 
        (params as any).insp_result_uuid = params.uuid;
      } else {
        throw createApiError(
          400, 
          '성적서 조회결과가 없습니다.', 
          this.stateTag, 
          errorState.NO_DATA
        );
      }

      // 📌 insp_detail_type(세부검사유형)에 따라 작업자 검사 혹은 QC 검사 항목만 조회
      const inspDetailTypeResult = await inspDetailTypeService.read({ insp_type_uuid: headerResult.raws[0].insp_type_uuid });
      if (inspDetailTypeResult.raws[0].worker_fg == '1') { (params as any).worker_fg = true; }
      if (inspDetailTypeResult.raws[0].inspector_fg == '1') { (params as any).inspector_fg = true; }

      const detailInfoResult = await detailInfoService.read(params);
      let detailsResult: ApiResult<any> = { raws: [], count: detailInfoResult.count };
      let maxSampleCnt: number = 0;

      // 📌 성적서 세부 데이터 Setting 및 작업자, 검사원별 Max 시료수를 계산하여 Header에 입력
      for await (const info of detailInfoResult.raws) {
        const detailValueResult = await detailValueService.read({ insp_result_detail_info_uuid: info.insp_result_detail_info_uuid });
        detailsResult.count += detailValueResult.count;

        detailValueResult.raws.forEach((raw: any) => {
          info['x' + raw.sample_no + '_insp_result_detail_value_uuid'] = raw.insp_result_detail_value_uuid;
          info['x' + raw.sample_no + '_sample_no'] = raw.sample_no;
          info['x' + raw.sample_no + '_insp_result_fg'] = raw.insp_result_fg;
          info['x' + raw.sample_no + '_insp_result_state'] = raw.insp_result_state;

          if (!isNumber(info.spec_min) && !isNumber(info.spec_max)) {
            // 📌 최소 값, 최대 값이 입력되지 않은 경우 1: OK, 0: NG, 이외의 값은 공백으로 전달
            info['x' + raw.sample_no + '_insp_value'] = raw.insp_value == 1 ? 'OK' : raw.insp_value == 0 ? 'NG' : '';
          } else {
            // 📌 소수점 입력된 자리까지 변환하여 전달
            info['x' + raw.sample_no + '_insp_value'] = Number(raw.insp_value);
          }
        });
        detailsResult.raws.push(info);

        // 📌 insp_detail_type(세부검사유형)이 작업자 검사인지 QC 검사인지 구분
        if (inspDetailTypeResult.raws[0].worker_fg) { 
          info.sample_cnt = info.worker_sample_cnt; delete info.worker_sample_cnt;
          info.insp_cycle = info.worker_insp_cycle; delete info.worker_insp_cycle;
        }
        if (inspDetailTypeResult.raws[0].inspector_fg) { 
          info.sample_cnt = info.inspector_sample_cnt; delete info.inspector_sample_cnt;
          info.insp_cycle = info.inspector_insp_cycle; delete info.inspector_insp_cycle;
        }

        if (info.sample_cnt > maxSampleCnt) { maxSampleCnt = info.sample_cnt; }
      }
      headerResult.raws[0].max_sample_cnt = maxSampleCnt;
      
      result.raws = [{ 
        header: headerResult.raws[0], 
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

  // 📒 Fn[readMaxSeqInProcInsp]: 공정검사 성적서의 현재 최대 차수(Seq) Read
  public readMaxSeqInProcInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const inspTypeService = new AdmInspTypeService(req.tenant.uuid);
      const inspDetailTypeService = new AdmInspDetailTypeService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      
      const workService = new PrdWorkService(req.tenant.uuid);
      const workResult = await workService.readByUuid(params.work_uuid);

      const workId = workResult.raws[0].work_id;
      const inspTypeId: number = await inspTypeService.getIdByCd('PROC_INSP');
      const inspDetailTypeResult = await inspDetailTypeService.readByUuid(params.insp_detail_type_uuid);

      const seq = await service.getMaxSeq(inspTypeId, inspDetailTypeResult.raws[0].insp_detail_type_id, workId);
      result.count = seq as number;
      
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

  // 📒 Fn[updateReceiveInsp]: Receive Inspection(수입검사) 데이터 수정
  public updateReceiveInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const detailInfoService = new QmsInspResultDetailInfoService(req.tenant.uuid);
      const detailValueService = new QmsInspResultDetailValueService(req.tenant.uuid);
      const inspDetailTypeService = new AdmInspDetailTypeService(req.tenant.uuid);
      const matReceiveDetailService = new MatReceiveDetailService(req.tenant.uuid);
      const matIncomeService = new MatIncomeService(req.tenant.uuid);
      const outReceiveDetailService = new OutReceiveDetailService(req.tenant.uuid);
      const outIncomeService = new OutIncomeService(req.tenant.uuid);
      const storeService = new StdStoreService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailInfoService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 수입검사 성적서 Update Flow
        // ✅ 1. 검사 성적서 및 상세 데이터 수정 및 생성 (상세 값 추가 된 것은 생성, 기존 값에서 수정된 것은 수정)
        // ✅ 2. 수불 데이터 및 입고내역 삭제 후 재 등록

        // 📌 검사 성적서 및 상세 데이터 Setting
        let detailInfos: any[] = [];
        let detailValuesForCreate: any[] = [];
        let detailValuesForUpdate: any[] = [];
        let detailValuesForDelete: any[] = [];

        data.details.forEach((detail: any) => {
          // 📌 시료 값에 대하여 수정 및 신규 생성 데이터 분류
          detail.values.forEach((value: any) => {
            if (!value.uuid) { 
              value.factory_id = detail.factory_id;
              value.insp_result_detail_info_id = detail.insp_result_detail_info_id;

              detailValuesForCreate.push(value); 
            } else { value.delete_fg ? detailValuesForDelete.push(value) : detailValuesForUpdate.push(value); }
          });

          delete detail.values;
          detailInfos.push(detail);
        });

        // ✅ 검사 성적서 및 상세 데이터 수정 및 생성 (상세 값 추가 된 것은 생성, 기존 값에서 수정된 것은 수정)
        const headerResult = await service.update([data.header], req.user?.uid as number, tran);
        const detailInfosResult = await detailInfoService.update(detailInfos, req.user?.uid as number, tran);

        const createdDetailValuesResult = await detailValueService.create(detailValuesForCreate, req.user?.uid as number, tran);
        const updatedDetailValuesResult = await detailValueService.update(detailValuesForUpdate, req.user?.uid as number, tran);
        const deletedDetailValuesResult = await detailValueService.delete(detailValuesForDelete, req.user?.uid as number, tran);
        const detailValuesResult = { 
          raws: [ ...createdDetailValuesResult.raws, ...updatedDetailValuesResult.raws, ...deletedDetailValuesResult.raws ],
          count: createdDetailValuesResult.count + updatedDetailValuesResult.count + deletedDetailValuesResult.count
        };

        // ✅ 수불 데이터 및 입고내역 삭제 후 재 등록
        let deleteIncomeResult: ApiResult<any> = { count:0, raws: [] };
        // 📌 자재 또는 외주 입고 내역 및 수불 내역을 삭제 목록에 추가
        const inspDetailTypeResult = await inspDetailTypeService.readByUuid(data.header.insp_detail_type_uuid);
        const inspDetailTypeCd = inspDetailTypeResult.raws[0].insp_detail_type_cd;
        switch (inspDetailTypeCd) {
          case 'MAT_RECEIVE': 
            deleteIncomeResult = await matIncomeService.deleteByReceiveDetailIds([headerResult.raws[0].insp_reference_id], req.user?.uid as number, tran);
            if (deleteIncomeResult.raws[0]) {
              await inventoryService.transactInventory(
                deleteIncomeResult.raws, 'DELETE', 
                { inout: 'TO', tran_type: 'MAT_INCOME', reg_date: data.header.reg_date, tran_id_alias: 'income_id' },
                req.user?.uid as number, tran
              );
            } 
            break;
          case 'OUT_RECEIVE': 
            deleteIncomeResult = await outIncomeService.deleteByReceiveDetailIds([headerResult.raws[0].insp_reference_id], req.user?.uid as number, tran);
            if (deleteIncomeResult.raws[0]) {
              await inventoryService.transactInventory(
                deleteIncomeResult.raws, 'DELETE', 
                { inout: 'TO', tran_type: 'OUT_INCOME', reg_date: data.header.reg_date, tran_id_alias: 'income_id' },
                req.user?.uid as number, tran
              );
            }
            break;
          default: break;
        }

        // ✅ 불량 수불 데이터 삭제 후 재 등록
        await inventoryService.transactInventory(
          headerResult.raws, 'DELETE', 
          { inout: 'TO', tran_type: 'QMS_RECEIVE_INSP_REJECT', reg_date: data.header.reg_date, tran_id_alias: 'insp_result_id' },
          req.user?.uid as number, tran
        );
        
        // 📌 성적서 합불 수량 대비 창고 수불데이터 Setting
        let storeResult: ApiResult<any> = { raws: [], count: 0 };
        let receiveDetailResult: ApiResult<any> = { raws: [], count: 0 };
        let incomeResult: ApiResult<any> = { raws: [], count: 0 };
        let incomeParams = [];
        let incomeBody = [];

        // ✅ 합격 수량 => 자재 또는 외주 입고 => 입고 창고 수불
        if (data.header.pass_qty > 0) {
          switch(inspDetailTypeCd) {
            case 'MAT_RECEIVE': 
              receiveDetailResult = await matReceiveDetailService.readRawById(headerResult.raws[0].insp_reference_id);
              
              incomeParams = [{
                ...headerResult.raws[0],
                receive_detail_id: headerResult.raws[0].insp_reference_id,
                unit_id: receiveDetailResult.raws[0].unit_id,
                qty: data.header.pass_qty
              }];
              incomeBody = await matIncomeService.getIncomeBody(incomeParams, headerResult.raws[0].reg_date);
              await storeService.validateStoreTypeByIds(incomeBody.map(body => body.to_store_id), 'AVAILABLE', tran);
              incomeResult = await matIncomeService.create(incomeBody, req.user?.uid as number, tran);

              storeResult = await inventoryService.transactInventory(
                incomeResult.raws, 'CREATE', 
                { inout: 'TO', tran_type: 'MAT_INCOME', reg_date: data.header.reg_date, tran_id_alias: 'income_id' },
                req.user?.uid as number, tran
              );
              break;

            case 'OUT_RECEIVE': 
              receiveDetailResult = await outReceiveDetailService.readRawByUuid(headerResult.raws[0].insp_reference_id);
              
              incomeParams = [{
                ...headerResult.raws[0],
                receive_detail_id: headerResult.raws[0].insp_reference_id,
                unit_id: receiveDetailResult.raws[0].unit_id,
                qty: data.header.pass_qty
              }];
              incomeBody = await outIncomeService.getIncomeBody(incomeParams, headerResult.raws[0].reg_date);
              await storeService.validateStoreTypeByIds(incomeBody.map(body => body.to_store_id), 'AVAILABLE', tran);
              incomeResult = await outIncomeService.create(incomeBody, req.user?.uid as number, tran);

              storeResult = await inventoryService.transactInventory(
                incomeResult.raws, 'CREATE', 
                { inout: 'TO', tran_type: 'OUT_INCOME', reg_date: data.header.reg_date, tran_id_alias: 'income_id' },
                req.user?.uid as number, tran
              );
              break;

            default: break;
          }
        }
        
        // ✅ 부적합 수량 => 부적합 창고 수불
        let rejectStoreResult: ApiResult<any> = { raws: [], count: 0 };
        let storeParams = [];
        let rejectStoreBody: any = [];
        if (data.header.reject_qty > 0) {
          switch(inspDetailTypeCd) {
            case 'MAT_RECEIVE': 
              receiveDetailResult = await matReceiveDetailService.readRawByUuid(data.header.receive_detail_uuid);
              storeParams = [{
                ...headerResult.raws[0].dataValues,
                unit_id: receiveDetailResult.raws[0].unit_id,
                qty: data.header.reject_qty
              }];
              rejectStoreBody = await service.getStoreBody(storeParams, data.header.reg_date);
              break;

            case 'OUT_RECEIVE': 
              receiveDetailResult = await outReceiveDetailService.readRawByUuid(data.header.receive_detail_uuid);
              storeParams = [{
                ...headerResult.raws[0].dataValues,
                unit_id: receiveDetailResult.raws[0].unit_id,
                qty: data.header.reject_qty
              }];
              rejectStoreBody = await service.getStoreBody(storeParams, data.header.reg_date);
              break;

            default: break;
          }

          await storeService.validateStoreTypeByIds(rejectStoreBody.map((body: any) => body.to_store_id), 'REJECT', tran);
          rejectStoreResult = await inventoryService.transactInventory(
            rejectStoreBody, 'CREATE', 
            { inout: 'TO', tran_type: 'QMS_RECEIVE_INSP_REJECT', reg_date: data.header.reg_date, tran_id_alias: 'insp_result_id' },
            req.user?.uid as number, tran
          );
        }

        result.raws.push({
          result: {
            header: headerResult.raws,
            detailInfos: detailInfosResult.raws,
            detailValues: detailValuesResult.raws
          },
          income: incomeResult.raws,
          store: [...storeResult.raws, ...rejectStoreResult.raws]
        });

        result.count += headerResult.count + detailInfosResult.count + detailValuesResult.count + incomeResult.count + storeResult.count + rejectStoreResult.count;
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[updateProcInsp]: Proc Inspection(공정검사) 데이터 수정
  public updateProcInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      // 📌 공정검사 성적서 Update Flow
      // ✅ 1. 검사 성적서 및 상세 데이터 수정 및 생성 (상세 값 추가 된 것은 생성, 기존 값에서 수정된 것은 수정)
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const detailInfoService = new QmsInspResultDetailInfoService(req.tenant.uuid);
      const detailValueService = new QmsInspResultDetailValueService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailInfoService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 검사 성적서 및 상세 데이터 Setting
        let detailInfos: any[] = [];
        let detailValuesForCreate: any[] = [];
        let detailValuesForUpdate: any[] = [];
        let detailValuesForDelete: any[] = [];

        data.details.forEach((detail: any) => {
          // 📌 시료 값에 대하여 수정 및 신규 생성 데이터 분류
          detail.values.forEach((value: any) => {
            if (!value.uuid) { 
              value.factory_id = detail.factory_id;
              value.insp_result_detail_info_id = detail.insp_result_detail_info_id;

              detailValuesForCreate.push(value); 
            } else { value.delete_fg ? detailValuesForDelete.push(value) : detailValuesForUpdate.push(value); }
          });

          delete detail.values;
          detailInfos.push(detail);
        });

        // ✅ 검사 성적서 및 상세 데이터 수정 및 생성 (상세 값 추가 된 것은 생성, 기존 값에서 수정된 것은 수정)
        const headerResult = await service.update([data.header], req.user?.uid as number, tran);
        const detailInfosResult = await detailInfoService.update(detailInfos, req.user?.uid as number, tran);

        const createdDetailValuesResult = await detailValueService.create(detailValuesForCreate, req.user?.uid as number, tran);
        const updatedDetailValuesResult = await detailValueService.update(detailValuesForUpdate, req.user?.uid as number, tran);
        const deletedDetailValuesResult = await detailValueService.delete(detailValuesForDelete, req.user?.uid as number, tran);
        const detailValuesResult = { 
          raws: [ ...createdDetailValuesResult.raws, ...updatedDetailValuesResult.raws, ...deletedDetailValuesResult.raws ],
          count: createdDetailValuesResult.count + updatedDetailValuesResult.count + deletedDetailValuesResult.count
        };

        result.raws.push({
          result: {
            header: headerResult.raws,
            detailInfos: detailInfosResult.raws,
            detailValues: detailValuesResult.raws
          },
        });

        result.count += headerResult.count + detailInfosResult.count + detailValuesResult.count;
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[updateFinalInsp]: Final Inspection(최종검사) 데이터 수정
  public updateFinalInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      // 📌 최종검사 성적서 Update Flow
      // ✅ 1. 검사 성적서 및 상세 데이터 수정 및 생성 (상세 값 추가 된 것은 생성, 기존 값에서 수정된 것은 수정)
      // ✅ 2. 수불 데이터 및 입고내역 삭제 후 재 등록
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const detailInfoService = new QmsInspResultDetailInfoService(req.tenant.uuid);
      const detailValueService = new QmsInspResultDetailValueService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailInfoService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 검사 성적서 및 상세 데이터 Setting
        let detailInfos: any[] = [];
        let detailValuesForCreate: any[] = [];
        let detailValuesForUpdate: any[] = [];
        let detailValuesForDelete: any[] = [];

        data.details.forEach((detail: any) => {
          // 📌 시료 값에 대하여 수정 및 신규 생성 데이터 분류
          detail.values.forEach((value: any) => {
            if (!value.uuid) { 
              value.factory_id = detail.factory_id;
              value.insp_result_detail_info_id = detail.insp_result_detail_info_id;

              detailValuesForCreate.push(value); 
            } else { value.delete_fg ? detailValuesForDelete.push(value) : detailValuesForUpdate.push(value); }
          });

          delete detail.values;
          detailInfos.push(detail);
        });

        // ✅ 검사 성적서 및 상세 데이터 수정 및 생성 (상세 값 추가 된 것은 생성, 기존 값에서 수정된 것은 수정)
        const headerResult = await service.update([data.header], req.user?.uid as number, tran);
        const detailInfosResult = await detailInfoService.update(detailInfos, req.user?.uid as number, tran);

        const createdDetailValuesResult = await detailValueService.create(detailValuesForCreate, req.user?.uid as number, tran);
        const updatedDetailValuesResult = await detailValueService.update(detailValuesForUpdate, req.user?.uid as number, tran);
        const deletedDetailValuesResult = await detailValueService.delete(detailValuesForDelete, req.user?.uid as number, tran);
        const detailValuesResult = { 
          raws: [ ...createdDetailValuesResult.raws, ...updatedDetailValuesResult.raws, ...deletedDetailValuesResult.raws ],
          count: createdDetailValuesResult.count + updatedDetailValuesResult.count + deletedDetailValuesResult.count
        };

        // ✅ 수불 데이터 및 입고내역 삭제 후 재 등록
        // 📌 최종검사 입출고 및 부적합 수불 내역을 삭제 목록에 추가
        await inventoryService.transactInventory(
          headerResult.raws, 'DELETE', 
          { inout: 'TO', tran_type: 'QMS_FINAL_INSP_INCOME', tran_id_alias: 'insp_result_id' },
          req.user?.uid as number, tran
        );
        await inventoryService.transactInventory(
          headerResult.raws, 'DELETE', 
          { inout: 'FROM', tran_type: 'QMS_FINAL_INSP_INCOME', tran_id_alias: 'insp_result_id' },
          req.user?.uid as number, tran
        );

        await inventoryService.transactInventory(
          headerResult.raws, 'DELETE', 
          { inout: 'TO', tran_type: 'QMS_FINAL_INSP_REJECT', tran_id_alias: 'insp_result_id' },
          req.user?.uid as number, tran
        );
        await inventoryService.transactInventory(
          headerResult.raws, 'DELETE', 
          { inout: 'FROM', tran_type: 'QMS_FINAL_INSP_REJECT', tran_id_alias: 'insp_result_id' },
          req.user?.uid as number, tran
        );

        // ✅ 성적서 합불 수량 대비 창고 수불 데이터 생성
        // 📌 합격수량 => 가용 창고 수불 (IN)
        const fromStoreResult: ApiResult<any> = { raws: [], count: 0 };
        const toStoreResult: ApiResult<any> = { raws: [], count: 0 };
        if (data.header.pass_qty > 0) { 
          const fromStoreResultByPass = await inventoryService.transactInventory(
            headerResult.raws, 'CREATE', 
            { inout: 'FROM', tran_type: 'QMS_FINAL_INSP_INCOME', tran_id_alias: 'insp_result_id', qty_alias: 'pass_qty' },
            req.user?.uid as number, tran
          );
          fromStoreResult.raws = [...fromStoreResultByPass.raws];
          fromStoreResult.count += fromStoreResultByPass.count;

          const toStoreResultByPass = await inventoryService.transactInventory(
            headerResult.raws, 'CREATE', 
            { inout: 'TO', tran_type: 'QMS_FINAL_INSP_INCOME', tran_id_alias: 'insp_result_id', qty_alias: 'pass_qty' },
            req.user?.uid as number, tran
          );
          toStoreResult.raws = [...toStoreResultByPass.raws];
          toStoreResult.count += toStoreResultByPass.count;
        }
        // 📌 불합격수량 => 부적합 창고 수불
        if (data.header.reject_qty > 0) { 
          const fromStoreResultByReject = await inventoryService.transactInventory(
            headerResult.raws, 'CREATE', 
            { inout: 'FROM', tran_type: 'QMS_FINAL_INSP_REJECT', tran_id_alias: 'insp_result_id', qty_alias: 'reject_qty' },
            req.user?.uid as number, tran
          );
          fromStoreResult.raws = [...fromStoreResultByReject.raws];
          fromStoreResult.count += fromStoreResultByReject.count;

          const toStoreResultByReject = await inventoryService.transactInventory(
            headerResult.raws, 'CREATE', 
            { inout: 'TO', tran_type: 'QMS_FINAL_INSP_REJECT', tran_id_alias: 'insp_result_id', qty_alias: 'reject_qty', store_alias: 'reject_store_id', location_alias: 'reject_location_id' },
            req.user?.uid as number, tran
          );
          toStoreResult.raws = [...toStoreResultByReject.raws];
          toStoreResult.count += toStoreResultByReject.count;
        }

        result.raws.push({
          result: {
            header: headerResult.raws,
            detailInfos: detailInfosResult.raws,
            detailValues: detailValuesResult.raws
          },
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws
        });

        result.count += headerResult.count + detailInfosResult.count + detailValuesResult.count + fromStoreResult.count + toStoreResult.count;
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

  //#region 🔴 Delete Functions

  // 📒 Fn[deleteReceiveInsp]: Receive Inspection(수입검사) 데이터 삭제
  public deleteReceiveInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
			let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const detailInfoService = new QmsInspResultDetailInfoService(req.tenant.uuid);
      const detailValueService = new QmsInspResultDetailValueService(req.tenant.uuid);
      const inspDetailTypeService = new AdmInspDetailTypeService(req.tenant.uuid);
      const matIncomeService = new MatIncomeService(req.tenant.uuid);
      const outIncomeService = new OutIncomeService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 수입검사 성적서 Delete Flow
          // ✅ 1. 수불내역 삭제
          // ✅ 2. 입고내역 삭제
          // ✅ 3. 검사성적서상세값 삭제
          // ✅ 4. 검사성적서상세정보 삭제
          // ✅ 5. 검사성적서 삭제
          for await (const data of datas) {
            const headerRead = await service.readRawByUuid(data.uuid);

            // 📌 자재 또는 외주 입고 내역 및 수불 내역을 삭제req.body = checkArray(req.body); 목록에 추가
            let incomeResult: ApiResult<any> = { count:0, raws: [] };
            let storeResult: ApiResult<any> = { count:0, raws: [] };
            const inspDetailTypeResult = await inspDetailTypeService.readByUuid(data.insp_detail_type_uuid);
            const inspDetailTypeCd = inspDetailTypeResult.raws[0].insp_detail_type_cd;
            switch (inspDetailTypeCd) {
              case 'MAT_RECEIVE': 
                incomeResult = await matIncomeService.deleteByReceiveDetailIds([headerRead.raws[0].insp_reference_id], req.user?.uid as number, tran);
                if (incomeResult.raws[0]) {
                  storeResult = await inventoryService.transactInventory(
                    incomeResult.raws, 'DELETE', 
                    { inout: 'TO', tran_type: 'MAT_INCOME', tran_id_alias: 'income_id' },
                    req.user?.uid as number, tran
                  );
                } 
                break;
              case 'OUT_RECEIVE': 
                incomeResult = await outIncomeService.deleteByReceiveDetailIds([headerRead.raws[0].insp_reference_id], req.user?.uid as number, tran);
                if (incomeResult.raws[0]) {
                  storeResult = await inventoryService.transactInventory(
                    incomeResult.raws, 'DELETE', 
                    { inout: 'TO', tran_type: 'OUT_INCOME', tran_id_alias: 'income_id' },
                    req.user?.uid as number, tran
                  );
                } 
                break;
              default: break;
            }
            // 📌 수입검사 부적합 수불 내역을 삭제 목록에 추가
            // ✅ 불량 수불 데이터 삭제 후 재 등록
            let rejectStoreResult: ApiResult<any> = { count:0, raws: [] };
            await inventoryService.transactInventory(
              headerRead.raws, 'DELETE', 
              { inout: 'TO', tran_type: 'QMS_RECEIVE_INSP_REJECT', tran_id_alias: 'insp_result_id' },
              req.user?.uid as number, tran
            );

            // 📌 검사 성적서 상세 값을 삭제하기 위하여 검사 성적서 상세정보 Id 조회
            const detailInfos = await detailInfoService.readByResultId(headerRead.raws[0].insp_result_id);
            const detailInfoIds = detailInfos.raws.map((raw: any) => { return raw.insp_result_detail_info_id });
            // ✅ 검사성적서상세값 삭제
            const detailValuesResult = await detailValueService.deleteByInfoIds(detailInfoIds, req.user?.uid as number, tran);

            // ✅ 검사성적서상세정보 삭제
            const detailInfosResult = await detailInfoService.deleteByResultIds([headerRead.raws[0].insp_result_id], req.user?.uid as number, tran);

            // ✅ 검사성적서 삭제
            const headerResult = await service.delete([data], req.user?.uid as number, tran);
            result.raws.push({
              result: {
                header: headerResult.raws,
                detailInfos: detailInfosResult.raws,
                detailValues: detailValuesResult.raws
              },
              income: incomeResult.raws,
              store: [...storeResult.raws, ...rejectStoreResult.raws]
            });

           result.count += headerResult.count + detailInfosResult.count + detailValuesResult.count + incomeResult.count + storeResult.count + rejectStoreResult.count;
          }
      });

      return createApiResult(res, result, 200, '데이터 삭제 성공', this.stateTag, successState.DELETE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[deleteProcInsp]: Proc Inspection(공정검사) 데이터 삭제
  public deleteProcInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const detailInfoService = new QmsInspResultDetailInfoService(req.tenant.uuid);
      const detailValueService = new QmsInspResultDetailValueService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        for await (const data of datas) {
          // 📌 공정검사 성적서 Delete Flow
          // ✅ 1. 검사성적서상세값 삭제
          // ✅ 2. 검사성적서상세정보 삭제
          // ✅ 3. 검사성적서 삭제
          const headerRead = await service.readRawByUuid(data.uuid);
          // 📌 검사 성적서 상세 값을 삭제하기 위하여 검사 성적서 상세정보 Id 조회
          const detailInfos = await detailInfoService.readByResultId(headerRead.raws[0].insp_result_id);
          const detailInfoIds = detailInfos.raws.map((raw: any) => { return raw.insp_result_detail_info_id });
          // ✅ 검사성적서상세값 삭제
          const detailValuesResult = await detailValueService.deleteByInfoIds(detailInfoIds, req.user?.uid as number, tran);
          // ✅ 검사성적서상세정보 삭제
          const detailInfosResult = await detailInfoService.deleteByResultIds([headerRead.raws[0].insp_result_id], req.user?.uid as number, tran);
          // ✅ 검사성적서 삭제	
          const headerResult = await service.delete([data], req.user?.uid as number, tran);

          result.raws.push({
            result: {
              header: headerResult.raws,
              detailInfos: detailInfosResult.raws,
              detailValues: detailValuesResult.raws
            }
          });

          result.count += headerResult.count + detailInfosResult.count + detailValuesResult.count;
        }
      });

      return createApiResult(res, result, 200, '데이터 삭제 성공', this.stateTag, successState.DELETE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[deleteFinalInsp]: Final Inspection(최종검사) 데이터 삭제
  public deleteFinalInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
			let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspResultService(req.tenant.uuid);
      const detailInfoService = new QmsInspResultDetailInfoService(req.tenant.uuid);
      const detailValueService = new QmsInspResultDetailValueService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        for await (const data of datas) {
          // 📌 최종검사 성적서 Delete Flow
          // ✅ 1. 수불내역 삭제
          // ✅ 2. 검사성적서상세값 삭제
          // ✅ 3. 검사성적서상세정보 삭제
          // ✅ 4. 검사성적서 삭제
          const headerRead = await service.readRawByUuid(data.uuid);

          // 📌 최종검사 입출고 및 부적합 수불 내역을 삭제 목록에 추가
          const toIncomeStoreResult = await inventoryService.transactInventory(
            headerRead.raws, 'DELETE', 
            { inout: 'TO', tran_type: 'QMS_FINAL_INSP_INCOME', tran_id_alias: 'insp_result_id' },
            req.user?.uid as number, tran
          );
          const fromIncomeStoreResult = await inventoryService.transactInventory(
            headerRead.raws, 'DELETE', 
            { inout: 'FROM', tran_type: 'QMS_FINAL_INSP_INCOME', tran_id_alias: 'insp_result_id' },
            req.user?.uid as number, tran
          );
  
          const toRejectStoreResult = await inventoryService.transactInventory(
            headerRead.raws, 'DELETE', 
            { inout: 'TO', tran_type: 'QMS_FINAL_INSP_REJECT', tran_id_alias: 'insp_result_id' },
            req.user?.uid as number, tran
          );
          const fromRejectStoreResult = await inventoryService.transactInventory(
            headerRead.raws, 'DELETE', 
            { inout: 'FROM', tran_type: 'QMS_FINAL_INSP_REJECT', tran_id_alias: 'insp_result_id' },
            req.user?.uid as number, tran
          );

          // 📌 검사 성적서 상세 값을 삭제하기 위하여 검사 성적서 상세정보 Id 조회
          const detailInfos = await detailInfoService.readByResultId(headerRead.raws[0].insp_result_id);
          const detailInfoIds = detailInfos.raws.map((raw: any) => { return raw.insp_result_detail_info_id });

          // ✅ 검사성적서상세값 삭제
          const detailValuesResult = await detailValueService.deleteByInfoIds(detailInfoIds, req.user?.uid as number, tran);

          // ✅ 검사성적서상세정보 삭제
          const detailInfosResult = await detailInfoService.deleteByResultIds([headerRead.raws[0].insp_result_id], req.user?.uid as number, tran);

          // ✅ 검사성적서 삭제
          const headerResult = await service.delete([data], req.user?.uid as number, tran);

          result.raws.push({
            result: {
              header: headerResult.raws,
              detailInfos: detailInfosResult.raws,
              detailValues: detailValuesResult.raws
            },
            store: [...toIncomeStoreResult.raws, ...fromIncomeStoreResult.raws, ...toRejectStoreResult.raws, ...fromRejectStoreResult.raws]
          });

          result.count += headerResult.count + detailInfosResult.count + detailValuesResult.count + toIncomeStoreResult.count + fromIncomeStoreResult.count + toRejectStoreResult.count + fromRejectStoreResult.count;
        }
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

export default QmsInspResultCtl;