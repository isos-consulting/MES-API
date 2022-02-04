import express from 'express';
import { matchedData } from 'express-validator';
import config from '../../configs/config';
import OutReceiveService from '../../services/out/receive.service';
import OutReceiveDetailService from '../../services/out/receive-detail.service';
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
import OutIncomeService from '../../services/out/income.service';
import OutWorkInputService from '../../services/out/work-input.service';
import StdStoreService from '../../services/std/store.service';
import InvStoreService from '../../services/inv/store.service';
import StdTenantOptService from '../../services/std/tenant-opt.service';
import { OUT_AUTO_PULL } from '../../types/tenant-opt.type';

class OutReceiveCtl {
  stateTag: string

  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'outReceive'
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new OutReceiveService(req.tenant.uuid);
      const detailService = new OutReceiveDetailService(req.tenant.uuid);
      const incomeService = new OutIncomeService(req.tenant.uuid);
      const inputService = new OutWorkInputService(req.tenant.uuid);
      const storeService = new StdStoreService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      const patternOptService = new AdmPatternOptService(req.tenant.uuid);
      const patternService = new AdmPatternHistoryService(req.tenant.uuid);
      const tenantOptService = new StdTenantOptService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        let receiveUuid: string;
        let receiveId: number;
        let regDate: string;
        let partnerId: number;
        let maxSeq: number;
        let headerResult: ApiResult<any> = { count: 0, raws: [] };

        // 📌 외주입하의 UUID가 입력되지 않은 경우 외주입하 신규 발행
        if (!data.header.uuid) {
          // 📌 전표자동발행 옵션 여부 확인
          const hasAutoOption = await patternOptService.hasAutoOption({ table_nm: 'OUT_RECEIVE_TB', col_nm: 'stmt_no', tran });

          // 📌 전표의 자동발행옵션이 On인 경우
          if (hasAutoOption) {
            data.header.stmt_no = await patternService.getPattern({
              factory_id: data.header.factory_id,
              table_nm: 'OUT_RECEIVE_TB',
              col_nm: 'stmt_no',
              reg_date: data.header.reg_date,
              uid: req.user?.uid as number,
              tran: tran
            });
          }

          // 📌 전표 생성
          headerResult = await service.create([data.header], req.user?.uid as number, tran);
          receiveUuid = headerResult.raws[0].uuid;
          receiveId = headerResult.raws[0].receive_id;
          regDate = headerResult.raws[0].reg_date;
          partnerId = headerResult.raws[0].partner_id;
          maxSeq = 0;
        } else {
          receiveUuid = data.header.uuid;
          receiveId = data.header.receive_id;
          regDate = data.header.reg_date;
          partnerId = data.header.partner_id;

          // 📌 Max Seq 계산
          maxSeq = await detailService.getMaxSeq(receiveId, tran) as number;
        }

        // 📌 생성된 입하ID 입력 및 Max Seq기준 Seq 발행
        data.details = data.details.map((detail: any) => {
          detail.receive_id = receiveId;
          detail.seq = ++maxSeq;
          return detail;
        });
      
        // 📌 외주입하상세 등록 및 합계금액 계산
        let detailResult = await detailService.create(data.details, req.user?.uid as number, tran);
        detailResult = await detailService.updateTotalPrice(detailResult.raws, req.user?.uid as number, tran);

        // 📌 외주입하의 합계수량 및 합계금액 계산
        headerResult = await service.updateTotal(receiveId, receiveUuid, req.user?.uid as number, tran);

        // 📌 수입검사 미진행 항목(무검사 항목) 수불데이터 생성
        const datasForInventory = detailResult.raws.filter(raw => !raw.insp_fg);

        // 📌 외주입고 및 수불 데이터 생성
        const incomeBody = await incomeService.getIncomeBody(datasForInventory, regDate);
        await storeService.validateStoreTypeByIds(incomeBody.map(body => body.to_store_id), 'AVAILABLE', tran);
        const incomeResult = await incomeService.create(incomeBody, req.user?.uid as number, tran);
        const toStoreResult = await inventoryService.transactInventory(
          incomeResult.raws, 'CREATE', 
          { inout: 'TO', tran_type: 'OUT_INCOME', reg_date: regDate, tran_id_alias: 'income_id' },
          req.user?.uid as number, tran
        );

        // 📌 외주투입 및 수불 데이터 생성
        let inputResult: ApiResult<any> = { count: 0, raws: [] };
        let fromStoreResult: ApiResult<any> = { count: 0, raws: [] };

        // 📌 외주투입의 자동 선입선출 옵션이 Enable인 경우에 투입 진행
        const isPullOption = await tenantOptService.getTenantOptValue('OUT_AUTO_PULL', tran);
        if (isPullOption === OUT_AUTO_PULL.ENABLE) {
          for await (const data of datasForInventory) {
            const inputBody = await inputService.getPullInputBody(data, regDate, partnerId, isPullOption);
            await storeService.validateStoreTypeByIds(inputBody.map(body => body.from_store_id), 'OUTSOURCING', tran);
            const tempInputResult = await inputService.create(inputBody, req.user?.uid as number, tran);
            const tempFromStoreResult = await inventoryService.transactInventory(
              tempInputResult.raws, 'CREATE', 
              { inout: 'FROM', tran_type: 'OUT_INPUT', reg_date: regDate, tran_id_alias: 'work_input_id', partner_id: headerResult.raws[0].partner_id },
              req.user?.uid as number, tran
            );

            inputResult = {
              raws: [...inputResult.raws, ...tempInputResult.raws],
              count: inputResult.count + tempInputResult.count
            };

            fromStoreResult = {
              raws: [...fromStoreResult.raws, ...tempFromStoreResult.raws],
              count: fromStoreResult.count + tempFromStoreResult.count
            };
          }
        }

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws,
          income: incomeResult.raws,
          input: inputResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws
        }];
        result.count = headerResult.count + detailResult.count + incomeResult.count + inputResult.count + fromStoreResult.count + toStoreResult.count;
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
      const service = new OutReceiveService(req.tenant.uuid);
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
      const service = new OutReceiveService(req.tenant.uuid);

      result = await service.readByUuid(req.params.uuid);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readIncludeDetails]: 외주입하 데이터의 Header + Detail 함께 조회
  public readIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const service = new OutReceiveService(req.tenant.uuid);
      const detailService = new OutReceiveDetailService(req.tenant.uuid);
      
      const headerResult = await service.readByUuid(params.uuid);
      const detailsResult = await detailService.read({ ...params, receive_uuid: params.uuid });

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

  // 📒 Fn[readDetails]: 외주입하 데이터의 Detail 조회
  public readDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const detailService = new OutReceiveDetailService(req.tenant.uuid);
      
      const result = await detailService.read({ ...params, receive_uuid: params.uuid });
      
      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readReport]: 외주입하현황 데이터 조회
  public readReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const service = new OutReceiveService(req.tenant.uuid);

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
      const service = new OutReceiveService(req.tenant.uuid);
      const detailService = new OutReceiveDetailService(req.tenant.uuid);
      const incomeService = new OutIncomeService(req.tenant.uuid);
      const inputService = new OutWorkInputService(req.tenant.uuid);
      const storeService = new StdStoreService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      const tenantOptService = new StdTenantOptService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 수입검사 이력이 있을 경우 Interlock
        await detailService.validateHasInspResultByUuids(data.details.map((detail: any) => detail.uuid));

        // 📌 외주입하 수정
        let headerResult = await service.update([data.header], req.user?.uid as number, tran);

        // 📌 외주입하상세 수정 및 합계금액 계산
        let detailResult = await detailService.patch(data.details, req.user?.uid as number, tran);
        detailResult = await detailService.updateTotalPrice(detailResult.raws, req.user?.uid as number, tran);

        // 📌 외주입하의 합계수량 및 합계금액 계산
        const receiveId = headerResult.raws[0].receive_id;
        const receiveUuid = headerResult.raws[0].uuid;
        const regDate = headerResult.raws[0].reg_date;
        const partnerId = headerResult.raws[0].partner_id;
        headerResult = await service.updateTotal(receiveId, receiveUuid, req.user?.uid as number, tran);

        // 📌 외주입고 및 수불 데이터 삭제 후 재 생성
        // 📌 외주입고 및 수불 데이터 삭제
        const receiveDetailIds = data.details.map((detail: any) => detail.receive_detail_id);
        const deletedIncome = await incomeService.deleteByReceiveDetailIds(receiveDetailIds, req.user?.uid as number, tran);
        await inventoryService.transactInventory(
          deletedIncome.raws, 'DELETE', 
          { inout: 'TO', tran_type: 'OUT_INCOME', reg_date: '', tran_id_alias: 'income_id' },
          req.user?.uid as number, tran
        );

        // 📌 외주입고 및 수불 데이터 생성
        const incomeBody = await incomeService.getIncomeBody(detailResult.raws, regDate);
        await storeService.validateStoreTypeByIds(incomeBody.map(body => body.to_store_id), 'AVAILABLE', tran);
        const incomeResult = await incomeService.create(incomeBody, req.user?.uid as number, tran);
        const toStoreResult = await inventoryService.transactInventory(
          incomeResult.raws, 'CREATE', 
          { inout: 'TO', tran_type: 'OUT_INCOME', reg_date: regDate, tran_id_alias: 'income_id' },
          req.user?.uid as number, tran
        );

        // 📌 외주투입의 자동 선입선출 옵션이 Enable인 경우에 투입 진행
        const isPullOption = await tenantOptService.getTenantOptValue('OUT_AUTO_PULL', tran);

        // 📌 외주투입 및 수불 데이터 삭제 후 재 생성
        // 📌 외주투입 및 수불 데이터 삭제
        if (isPullOption === OUT_AUTO_PULL.ENABLE) {
          const receiveDetailIds = detailResult.raws.map(raw => raw.receive_id);
          const deletedInput = await inputService.deleteByReceiveDetailIds(receiveDetailIds, req.user?.uid as number, tran);
          await inventoryService.transactInventory(
            deletedInput.raws, 'DELETE', 
            { inout: 'FROM', tran_type: 'OUT_INPUT', reg_date: regDate, tran_id_alias: 'work_input_id' },
            req.user?.uid as number, tran
          );
        }

        // 📌 외주투입 및 수불 데이터 생성
        let inputResult: ApiResult<any> = { count: 0, raws: [] };
        let fromStoreResult: ApiResult<any> = { count: 0, raws: [] };

        if (isPullOption === OUT_AUTO_PULL.ENABLE) {
          for await (const detail of detailResult.raws) {
            const inputBody = await inputService.getPullInputBody(detail, regDate, partnerId, isPullOption);
            await storeService.validateStoreTypeByIds(inputBody.map(body => body.from_store_id), 'OUTSOURCING', tran);
            const tempInputResult = await inputService.create(inputBody, req.user?.uid as number, tran);
            const tempFromStoreResult = await inventoryService.transactInventory(
              tempInputResult.raws, 'CREATE', 
              { inout: 'FROM', tran_type: 'OUT_INPUT', reg_date: regDate, tran_id_alias: 'work_input_id' },
              req.user?.uid as number, tran
            );

            inputResult = {
              raws: [...inputResult.raws, ...tempInputResult.raws],
              count: inputResult.count + tempInputResult.count
            };

            fromStoreResult = {
              raws: [...fromStoreResult.raws, ...tempFromStoreResult.raws],
              count: fromStoreResult.count + tempFromStoreResult.count
            };
          }
        }

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws,
          income: incomeResult.raws,
          input: inputResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws
        }];
        result.count = headerResult.count + detailResult.count + incomeResult.count + inputResult.count + fromStoreResult.count + toStoreResult.count;
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
      const service = new OutReceiveService(req.tenant.uuid);
      const detailService = new OutReceiveDetailService(req.tenant.uuid);
      const incomeService = new OutIncomeService(req.tenant.uuid);
      const inputService = new OutWorkInputService(req.tenant.uuid);
      const storeService = new StdStoreService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      const tenantOptService = new StdTenantOptService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 수입검사 이력이 있을 경우 Interlock
        await detailService.validateHasInspResultByUuids(data.details.map((detail: any) => detail.uuid));

        // 📌 외주입하 수정
        let headerResult = await service.patch([data.header], req.user?.uid as number, tran);

        // 📌 외주입하상세 수정 및 합계금액 계산
        let detailResult = await detailService.patch(data.details, req.user?.uid as number, tran);
        detailResult = await detailService.updateTotalPrice(detailResult.raws, req.user?.uid as number, tran);

        // 📌 외주입하의 합계수량 및 합계금액 계산
        const receiveId = headerResult.raws[0].receive_id;
        const receiveUuid = headerResult.raws[0].uuid;
        const regDate = headerResult.raws[0].reg_date;
        const partnerId = headerResult.raws[0].partner_id;
        headerResult = await service.updateTotal(receiveId, receiveUuid, req.user?.uid as number, tran);

        // 📌 외주입고 및 수불 데이터 삭제 후 재 생성
        // 📌 외주입고 및 수불 데이터 삭제
        const receiveDetailIds = data.details.map((detail: any) => detail.receive_detail_id);
        const deletedIncome = await incomeService.deleteByReceiveDetailIds(receiveDetailIds, req.user?.uid as number, tran);
        await inventoryService.transactInventory(
          deletedIncome.raws, 'DELETE', 
          { inout: 'TO', tran_type: 'OUT_INCOME', reg_date: '', tran_id_alias: 'income_id' },
          req.user?.uid as number, tran
        );

        // 📌 외주입고 및 수불 데이터 생성
        const incomeBody = await incomeService.getIncomeBody(detailResult.raws, regDate);
        await storeService.validateStoreTypeByIds(incomeBody.map(body => body.to_store_id), 'AVAILABLE', tran);
        const incomeResult = await incomeService.create(incomeBody, req.user?.uid as number, tran);
        const toStoreResult = await inventoryService.transactInventory(
          incomeResult.raws, 'CREATE', 
          { inout: 'TO', tran_type: 'OUT_INCOME', reg_date: regDate, tran_id_alias: 'income_id' },
          req.user?.uid as number, tran
        );

        // 📌 외주투입의 자동 선입선출 옵션이 Enable인 경우에 투입 진행
        const isPullOption = await tenantOptService.getTenantOptValue('OUT_AUTO_PULL', tran);

        // 📌 외주투입 및 수불 데이터 삭제 후 재 생성
        // 📌 외주투입 및 수불 데이터 삭제
        if (isPullOption === OUT_AUTO_PULL.ENABLE) {
          const receiveDetailIds = detailResult.raws.map(raw => raw.receive_id);
          const deleted = await inputService.deleteByReceiveDetailIds(receiveDetailIds, req.user?.uid as number, tran);
          await inventoryService.transactInventory(
            deleted.raws, 'DELETE', 
            { inout: 'FROM', tran_type: 'OUT_INPUT', reg_date: regDate, tran_id_alias: 'work_input_id' },
            req.user?.uid as number, tran
          );
        }

        // 📌 외주투입 및 수불 데이터 생성
        let inputResult: ApiResult<any> = { count: 0, raws: [] };
        let fromStoreResult: ApiResult<any> = { count: 0, raws: [] };

        if (isPullOption === OUT_AUTO_PULL.ENABLE) {
          for await (const detail of detailResult.raws) {
            const inputBody = await inputService.getPullInputBody(detail, regDate, partnerId, isPullOption);
            await storeService.validateStoreTypeByIds(inputBody.map(body => body.from_store_id), 'OUTSOURCING', tran);
            const tempInputResult = await inputService.create(inputBody, req.user?.uid as number, tran);
            const tempFromStoreResult = await inventoryService.transactInventory(
              tempInputResult.raws, 'CREATE', 
              { inout: 'FROM', tran_type: 'OUT_INPUT', reg_date: regDate, tran_id_alias: 'work_input_id' },
              req.user?.uid as number, tran
            );

            inputResult = {
              raws: [...inputResult.raws, ...tempInputResult.raws],
              count: inputResult.count + tempInputResult.count
            };

            fromStoreResult = {
              raws: [...fromStoreResult.raws, ...tempFromStoreResult.raws],
              count: fromStoreResult.count + tempFromStoreResult.count
            };
          }
        }

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws,
          income: incomeResult.raws,
          input: inputResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws
        }];
        result.count = headerResult.count + detailResult.count + incomeResult.count + inputResult.count + fromStoreResult.count + toStoreResult.count;
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

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new OutReceiveService(req.tenant.uuid);
      const detailService = new OutReceiveDetailService(req.tenant.uuid);
      const incomeService = new OutIncomeService(req.tenant.uuid);
      const inputService = new OutWorkInputService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      
      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 수입검사 이력이 있을 경우 Interlock
        await detailService.validateHasInspResultByUuids(data.details.map((detail: any) => detail.uuid));

        // 📌 외주입고 및 수불 데이터 삭제
        const receiveDetailIds = data.details.map((detail: any) => detail.receive_detail_id);
        const incomeResult = await incomeService.deleteByReceiveDetailIds(receiveDetailIds, req.user?.uid as number, tran);
        const toStoreResult = await inventoryService.transactInventory(
          incomeResult.raws, 'DELETE', 
          { inout: 'TO', tran_type: 'OUT_INCOME', reg_date: '', tran_id_alias: 'income_id' },
          req.user?.uid as number, tran
        );

        // 📌 외주투입 및 수불 데이터 삭제
        const inputResult = await inputService.deleteByReceiveDetailIds(receiveDetailIds, req.user?.uid as number, tran);
        const fromStoreResult = await inventoryService.transactInventory(
          inputResult.raws, 'DELETE', 
          { inout: 'FROM', tran_type: 'OUT_INPUT', reg_date: '', tran_id_alias: 'work_input_id' },
          req.user?.uid as number, tran
        );

        // 📌 외주입하상세 삭제
        const detailResult = await detailService.delete(data.details, req.user?.uid as number, tran);

        // 📌 전표 내 상세전표 데이터 개수 조회
        //    상세전표개수가 0개일 경우 (전표데이터 삭제)
        //    상세전표개수가 1개 이상일 경우 (전표데이터 합계 데이터 계산)
        const count = await detailService.getCountInHeader(data.header.receive_id, tran);
        let headerResult: ApiResult<any>;
        if (count == 0) {
          headerResult = await service.delete([data.header], req.user?.uid as number, tran);
        } else {
          headerResult = await service.updateTotal(data.header.receive_id, data.header.uuid, req.user?.uid as number, tran);
        }

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws,
          income: incomeResult.raws,
          input: inputResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws
        }];
        result.count = headerResult.count + detailResult.count + incomeResult.count + inputResult.count + fromStoreResult.count + toStoreResult.count;
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

export default OutReceiveCtl;