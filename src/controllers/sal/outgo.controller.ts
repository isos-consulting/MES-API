import express from 'express';
import { matchedData } from 'express-validator';
import config from '../../configs/config';
import SalOutgoService from '../../services/sal/outgo.service';
import SalOutgoDetailService from '../../services/sal/outgo-detail.service';
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
import fkInfos from '../../types/fk-info.type';
import getFkUuidByCd from '../../utils/getFkUuidByCd';
import InvEcerpService from '../../services/inv/ecerp.service';
import StdProdService from '../../services/std/prod.service';
import StdCustomerPriceService from '../../services/std/customer-price.service';
import { setExcelValidationEmptyError } from '../../utils/setExcelValidationEmptyError';
import moment from 'moment';

class SalOutgoCtl {
  stateTag: string

  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'salOutgo'
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new SalOutgoService(req.tenant.uuid);
      const detailService = new SalOutgoDetailService(req.tenant.uuid);
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
        let outgoUuid: string;
        let outgoId: number;
        let regDate: string;
        let maxSeq: number;
        let headerResult: ApiResult<any> = { count: 0, raws: [] };

        // 📌 제품출하의 UUID가 입력되지 않은 경우 제품출하 신규 발행
        if (!data.header.uuid) {
          // 📌 전표자동발행 옵션 여부 확인
          const hasAutoOption = await patternOptService.hasAutoOption({ table_nm: 'SAL_OUTGO_TB', col_nm: 'stmt_no', tran });

          // 📌 전표의 자동발행옵션이 On인 경우
          if (hasAutoOption) {
            data.header.stmt_no = await patternService.getPattern({
              factory_id: data.header.factory_id,
              table_nm: 'SAL_OUTGO_TB',
              col_nm: 'stmt_no',
              reg_date: data.header.reg_date,
              uid: req.user?.uid as number,
              tran: tran
            });
          }

          // 📌 전표 생성
          headerResult = await service.create([data.header], req.user?.uid as number, tran);
          outgoUuid = headerResult.raws[0].uuid;
          outgoId = headerResult.raws[0].outgo_id;
          regDate = headerResult.raws[0].reg_date;
          maxSeq = 0;
        } else {
          outgoUuid = data.header.uuid;
          outgoId = data.header.outgo_id;
          regDate = data.header.reg_date;

          // 📌 Max Seq 계산
          maxSeq = await detailService.getMaxSeq(outgoId, tran) as number;
        }

        // 📌 생성된 출하ID 입력 및 Max Seq 기준 Seq 발행
        data.details = data.details.map((detail: any) => {
          detail.outgo_id = outgoId;
          detail.seq = ++maxSeq;
          return detail;
        });
      
        // 📌 제품출하상세 등록 및 합계금액 계산
        let detailResult = await detailService.create(data.details, req.user?.uid as number, tran);
        detailResult = await detailService.updateTotalPrice(detailResult.raws, req.user?.uid as number, tran);

        // 📌 제품출하의 합계수량 및 합계금액 계산
        headerResult = await service.updateTotal(outgoId, outgoUuid, req.user?.uid as number, tran);

        // 📌 수불 데이터 생성
        await storeService.validateStoreTypeByIds(detailResult.raws.map(raw => raw.from_store_id), 'OUTGO', tran);
        const storeResult = await inventoryService.transactInventory(
          detailResult.raws, 'CREATE', 
          { inout: 'FROM', tran_type: 'SAL_OUTGO', reg_date: regDate, tran_id_alias: 'outgo_detail_id' },
          req.user?.uid as number, tran
        );

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws,
          store: storeResult.raws
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

  // 📒 Fn[createEcerp] (✅ Inheritance): CreateEcerp Function
  public createEcerp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new SalOutgoService(req.tenant.uuid);
      const detailService = new SalOutgoDetailService(req.tenant.uuid);
      const storeService = new StdStoreService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      const patternOptService = new AdmPatternOptService(req.tenant.uuid);
      const patternService = new AdmPatternHistoryService(req.tenant.uuid);
      const ecerpService = new InvEcerpService(req.tenant.uuid);

      const matched = Object.values(matchedData(req, { locations: [ 'body' ] }));

      const datas:any = {};
      
      matched.forEach((data: any) => {
        if (datas[data['reg_date'] + data['partner_cd']] === undefined) {
          datas[data['reg_date'] + data['partner_cd']] = {
            header: {
              factory_uuid: data['factory_uuid'],
              partner_uuid: data['partner_uuid'],
              reg_date: data['reg_date']
            },
            details: []
          }
        }

        datas[data['reg_date'] + data['partner_cd']].details.push({ ...data });
      });

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        for (let dataObject of Object.values(datas) as any[]) {
          let outgoUuid: string;
          let outgoId: number;
          let _regDate: string;
          let maxSeq: number;
          let headerResult: ApiResult<any> = { count: 0, raws: [] };
          
          const data = {
            header: (await service.convertFk(dataObject.header))[0],
            details: await detailService.convertFk(dataObject.details),
          };

          // 📌 제품출하의 UUID가 입력되지 않은 경우 제품출하 신규 발행
          if (!data.header.uuid) {
            // 📌 전표자동발행 옵션 여부 확인
            const hasAutoOption = await patternOptService.hasAutoOption({ table_nm: 'SAL_OUTGO_TB', col_nm: 'stmt_no', tran });
  
            // 📌 전표의 자동발행옵션이 On인 경우
            if (hasAutoOption) {
              data.header.stmt_no = await patternService.getPattern({
                factory_id: data.header.factory_id,
                table_nm: 'SAL_OUTGO_TB',
                col_nm: 'stmt_no',
                reg_date: data.header.reg_date,
                uid: req.user?.uid as number,
                tran: tran
              });
            }
  
            // 📌 전표 생성
            headerResult = await service.create([data.header], req.user?.uid as number, tran);
            outgoUuid = headerResult.raws[0].uuid;
            outgoId = headerResult.raws[0].outgo_id;
            _regDate = headerResult.raws[0].reg_date;
            maxSeq = 0;
          } else {
            outgoUuid = data.header.uuid;
            outgoId = data.header.outgo_id;
            _regDate = data.header.reg_date;
  
            // 📌 Max Seq 계산
            maxSeq = await detailService.getMaxSeq(outgoId, tran) as number;
          }
  
          // 📌 생성된 출하ID 입력 및 Max Seq 기준 Seq 발행
          data.details = data.details.map((detail: any) => {
            detail.outgo_id = outgoId;
            detail.seq = ++maxSeq;
            return detail;
          });

          // 📌 제품출하상세 등록 및 합계금액 계산
          let detailResult = await detailService.create(data.details, req.user?.uid as number, tran);
          detailResult = await detailService.updateTotalPrice(detailResult.raws, req.user?.uid as number, tran);

          // 📌 제품출하의 합계수량 및 합계금액 계산
          headerResult = await service.updateTotal(outgoId, outgoUuid, req.user?.uid as number, tran);

          // 📌 수불 데이터 생성
          await storeService.validateStoreTypeByIds(detailResult.raws.map(raw => raw.from_store_id), 'OUTGO', tran);
          const storeResult = await inventoryService.transactInventory(
            detailResult.raws, 'CREATE', 
            { inout: 'FROM', tran_type: 'SAL_OUTGO', reg_date: _regDate, tran_id_alias: 'outgo_detail_id' },
            req.user?.uid as number, tran
          );

          const ecerpCreateBody = detailResult.raws.map((result: any) => {
            return {
              type: '출고',
              header_id: outgoId,
              detail_id: result.outgo_detail_id,
              qty: result.qty
            }
          });

          await ecerpService.create(ecerpCreateBody, req.user?.uid as number, tran);

          result.raws.push({
            header: headerResult.raws[0],
            details: detailResult.raws,
            store: storeResult.raws
          });
        }
        
      });

      let count = 0;
      result.raws.forEach((value: any) => {
        count += value.details.length;
      });

      result.count = count;

      return createApiResult(res, result, 201, '데이터 생성 성공', this.stateTag, successState.CREATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

  // 📒 Fn[createEcerp] (✅ Inheritance): CreateEcerp Function
  public ecountValidation = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const prodService = new StdProdService(req.tenant.uuid);
      const customerPriceService = new StdCustomerPriceService(req.tenant.uuid);

      const matched = setExcelValidationEmptyError(req.body);

      const fkInfoList = [ fkInfos.from_store, fkInfos.partner ];

      const datas = await getFkUuidByCd(req.tenant.uuid, matched, fkInfoList);

      const notNullColumns = [
        {
          columnCd: 'partner_cd',
          columnNm: '거래처'
        },
        {
          columnCd: 'lot_no',
          columnNm: 'Lot No'
        },
        {
          columnCd: 'qty',
          columnNm: '수량'
        },
        {
          columnCd: 'from_store_cd',
          columnNm: '출고창고'
        }
      ];
      
      for (let data of datas) {
        notNullColumns.forEach((column: any) => {
          if (data[column.columnCd] === undefined || data[column.columnCd] === null || data[column.columnCd].toString().length === 0) {
            data.error.push(`${column.columnNm} 빈 값 입니다.`);
          }
        });

        if (data['reg_date'] === undefined || data['reg_date'] === null) {
          data.error.push(`날짜 빈 값 입니다.`);
          continue;
        }

        if (data['prod_no'] === undefined || data['prod_no'] === null) {
          data.error.push(`품목 빈 값 입니다.`);
          continue;
        }

        const prodInfo = (await prodService.readByUnique({ prod_no: data['prod_no'] }));
        if (prodInfo.count == 0) {
          data.error.push(`품목 데이터가 없습니다.`);
          continue;
        }

        data['prod_uuid'] = prodInfo.raws[0].uuid;

        if (data['partner_uuid']) {
          const date = moment(data['reg_date'], 'YYYYMMDD').format('YYYY-MM-DD'); 
          const customerPriceInfo = await customerPriceService.read({ 
            partner_uuid: data['partner_uuid'], 
            prod_uuid: data['prod_uuid'],
            date: date
          });
          
          if (customerPriceInfo.count == 0) {
            data.error.push(`판매단가 데이터가 없습니다.`);
            continue;
          }

          data['money_unit_uuid'] = customerPriceInfo.raws[0].money_unit_uuid;
          data['price'] = customerPriceInfo.raws[0].price;

          data['exchange'] = 1;
          data['carry_fg'] = false;
        }
      }

      result = { count: datas.length, raws: datas };

      return createApiResult(res, result, 201, '데이터 생성 성공', this.stateTag, successState.CREATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#region 🔵 Read Functions

  // 📒 Fn[read] (✅ Inheritance): Default Read Function
  public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new SalOutgoService(req.tenant.uuid);
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
      const service = new SalOutgoService(req.tenant.uuid);

      result = await service.readByUuid(req.params.uuid);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readIncludeDetails]: 제품출하 데이터의 Header + Detail 함께 조회
  public readIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const service = new SalOutgoService(req.tenant.uuid);
      const detailService = new SalOutgoDetailService(req.tenant.uuid);
      
      const headerResult = await service.readByUuid(params.uuid);
      const detailsResult = await detailService.read({ ...params, outgo_uuid: params.uuid });

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

  // 📒 Fn[readDetails]: 제품출하 데이터의 Detail 조회
  public readDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const detailService = new SalOutgoDetailService(req.tenant.uuid);
      
      const result = await detailService.read({ ...params, outgo_uuid: params.uuid });
      
      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readReport]: 제품출하현황 데이터 조회
  public readReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const service = new SalOutgoService(req.tenant.uuid);

      const result = await service.readReport(params);
      
      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readLotTracking]: 제품출하 기준 LOT 추적 데이터 조회
  public readLotTracking = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const service = new SalOutgoService(req.tenant.uuid);

      const result = await service.readLotTracking(params);
      
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
      const service = new SalOutgoService(req.tenant.uuid);
      const detailService = new SalOutgoDetailService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 제품출하 수정
        let headerResult = await service.update([data.header], req.user?.uid as number, tran);

        // 📌 제품출하상세 수정 및 합계금액 계산
        let detailResult = await detailService.update(data.details, req.user?.uid as number, tran);
        detailResult = await detailService.updateTotalPrice(detailResult.raws, req.user?.uid as number, tran);

        // 📌 제품출하의 합계수량 및 합계금액 계산
        const outgoId = headerResult.raws[0].outgo_id;
        const outgoUuid = headerResult.raws[0].uuid;
        const regDate = headerResult.raws[0].reg_date;
        headerResult = await service.updateTotal(outgoId, outgoUuid, req.user?.uid as number, tran);

        // 📌 수불 데이터 수정
        const storeResult = await inventoryService.transactInventory(
          detailResult.raws, 'UPDATE', 
          { inout: 'FROM', tran_type: 'SAL_OUTGO', reg_date: regDate, tran_id_alias: 'outgo_detail_id' },
          req.user?.uid as number, tran
        );

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws,
          store: storeResult.raws
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
      const service = new SalOutgoService(req.tenant.uuid);
      const detailService = new SalOutgoDetailService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 제품출하 수정
        let headerResult = await service.patch([data.header], req.user?.uid as number, tran);

        // 📌 제품출하상세 수정 및 합계금액 계산
        let detailResult = await detailService.patch(data.details, req.user?.uid as number, tran);
        detailResult = await detailService.updateTotalPrice(detailResult.raws, req.user?.uid as number, tran);

        // 📌 제품출하의 합계수량 및 합계금액 계산
        const outgoId = headerResult.raws[0].outgo_id;
        const outgoUuid = headerResult.raws[0].uuid;
        const regDate = headerResult.raws[0].reg_date;
        headerResult = await service.updateTotal(outgoId, outgoUuid, req.user?.uid as number, tran);

        // 📌 수불 데이터 수정
        const storeResult = await inventoryService.transactInventory(
          detailResult.raws, 'UPDATE', 
          { inout: 'FROM', tran_type: 'SAL_OUTGO', reg_date: regDate, tran_id_alias: 'outgo_detail_id' },
          req.user?.uid as number, tran
        );

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws,
          store: storeResult.raws
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

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new SalOutgoService(req.tenant.uuid);
      const detailService = new SalOutgoDetailService(req.tenant.uuid);
      const inventoryService = new InvStoreService(req.tenant.uuid);
      
      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 제품출하상세 삭제
        const detailResult = await detailService.delete(data.details, req.user?.uid as number, tran);

        // 📌 수불 데이터 삭제
        const storeResult = await inventoryService.transactInventory(
          detailResult.raws, 'DELETE', 
          { inout: 'FROM', tran_type: 'SAL_OUTGO', tran_id_alias: 'outgo_detail_id' },
          req.user?.uid as number, tran
        );

        // 📌 전표 내 상세전표 데이터 개수 조회
        //    상세전표개수가 0개일 경우 (전표데이터 삭제)
        //    상세전표개수가 1개 이상일 경우 (전표데이터 합계 데이터 계산)
        const count = await detailService.getCountInHeader(data.header.outgo_id, tran);
        let headerResult: ApiResult<any>;
        if (count == 0) {
          headerResult = await service.delete([data.header], req.user?.uid as number, tran);
        } else {
          headerResult = await service.updateTotal(data.header.outgo_id, data.header.uuid, req.user?.uid as number, tran);
        }

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws,
          store: storeResult.raws
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

export default SalOutgoCtl;