import express from 'express';
import { matchedData } from 'express-validator';
import config from '../../configs/config';
import EqmInspService from '../../services/eqm/insp.service';
import EqmInspDetailService from '../../services/eqm/insp-detail.service';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import { sequelizes } from '../../utils/getSequelize';
import isServiceResult from '../../utils/isServiceResult';
import response from '../../utils/response_new';
import createApiResult from '../../utils/createApiResult_new';
import { errorState, successState } from '../../states/common.state';
import ApiResult from '../../interfaces/common/api-result.interface';
import AdmPatternHistoryCtl from '../adm/pattern-history.controller';
import moment from 'moment';
import createApiError from '../../utils/createApiError';

class EqmInspCtl {
  stateTag: string

  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'eqmInsp'
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new EqmInspService(req.tenant.uuid);
      const detailService = new EqmInspDetailService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        let inspUuid: string;
        let inspId: number;
        let maxSeq: number;
        let headerResult: ApiResult<any> = { count: 0, raws: [] };

        // 📌 설비점검 상세 기준서의 유형(정기, 일상)에 따르는 필요 데이터 검증
        detailService.validatePeriodicity(data.details);

        // 📌 기준서의 UUID가 입력되지 않은 경우 기준서 신규 발행
        if (!data.header.uuid) {
          // 📌 설비점검 기준서의 등록일시와 적용일시 데이터 검증
          service.validateDateDiff({
            reg_date: data.header.reg_date,
            apply_date: data.header.apply_date ?? moment(moment.now()).toString(),
          });

          // 📌 기준서를 신규등록할때 기준서 번호가 입력되어있지 않을 경우 기준서 번호(insp_no) 자동 발행
          if (!data.header.insp_no) {
            data.header.insp_no = await new AdmPatternHistoryCtl().getPattern({
              tenant: req.tenant.uuid,
              factory_id: data.header.factory_id,
              table_nm: 'EQM_INSP_TB',
              col_nm: 'insp_no',
              reg_date: data.header.reg_date,
              uid: req.user?.uid as number,
              tran: tran
            });
          }

          headerResult = await service.create([data.header], req.user?.uid as number, tran);
          inspId = headerResult.raws[0].insp_id;
          inspUuid = headerResult.raws[0].uuid;
          maxSeq = 0;

          // 📌 기준서를 생성과 동시에 적용 할 경우.
          if (data.header.apply_fg) {
            // 📌 기준서의 설비에 해당하는 모든 기준서를 적용해제
            await service.cancelApplyByEquip(data.header.equip_uuid, req.user?.uid as number, tran);

            // 📌 등록한 기준서만 적용
            await service.updateApply({
              uuid: inspUuid,
              apply_fg: true,
              apply_date: headerResult.raws[0].apply_date ?? moment(moment.now()).toString()
            }, req.user?.uid as number, tran);
          }
        } else {
          inspId = data.header.insp_id;

          // 📌 Max Seq 계산
          maxSeq = await detailService.getMaxSeq(inspId, tran) as number;
        }

        data.details = data.details.map((detail: any) => {
          detail.insp_id = inspId;
          detail.seq = ++maxSeq;
          return detail;
        });
      
        // 📌 세부 기준서 등록
        const detailResult = await detailService.create(data.details, req.user?.uid as number, tran);

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws
        }];
        result.count = headerResult.count + detailResult.count;
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
      const service = new EqmInspService(req.tenant.uuid);
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
      const service = new EqmInspService(req.tenant.uuid);

      result = await service.readByUuid(req.params.uuid);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readIncludeDetails]: 기준서 데이터의 Header + Detail 함께 조회
  public readIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const service = new EqmInspService(req.tenant.uuid);
      const detailService = new EqmInspDetailService(req.tenant.uuid);
      
      const headerResult = await service.readByUuid(params.uuid);
      const detailsResult = await detailService.read({ ...params, insp_uuid: params.uuid });

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

  // 📒 Fn[readIncludeDetailsByEquip]: 설비 기준 기준서 데이터의 Header + Detail 함께 조회
  public readIncludeDetailsByEquip = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const service = new EqmInspService(req.tenant.uuid);
      const detailService = new EqmInspDetailService(req.tenant.uuid);
      
      const headerResult = await service.read({ equip_uuid: params.equip_uuid, apply_fg: true });
      if (headerResult.count == 0) {
        throw createApiError(
          400, 
          { 
            admin_message: `기준서 정보가 존재하지 않습니다.`,
            user_message: `기준서 정보가 존재하지 않습니다.`
          }, 
          this.stateTag, 
          errorState.NO_DATA
        );
      }

      const detailsResult = await detailService.read({ ...params, insp_uuid: headerResult.raws[0].insp_uuid });

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

  // 📒 Fn[readDetails]: 기준서 데이터의 Detail 조회
  public readDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const detailService = new EqmInspDetailService(req.tenant.uuid);
      
      const result = await detailService.read({ ...params, insp_uuid: params.uuid });
      
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
      const service = new EqmInspService(req.tenant.uuid);
      const detailService = new EqmInspDetailService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 기준서 수정
        const headerResult = await service.update([data.header], req.user?.uid as number, tran);
        // 📌 설비점검 기준서의 등록일시와 적용일시 데이터 검증
        service.validateDateDiff({
          reg_date: headerResult.raws[0].reg_date,
          apply_date: headerResult.raws[0].apply_date ?? moment(moment.now()).toString(),
        });

        // 📌 세부 기준서 수정
        const detailResult = await detailService.update(data.details, req.user?.uid as number, tran);
        // 📌 설비점검 상세 기준서의 유형(정기, 일상)에 따르는 필요 데이터 검증
        detailService.validatePeriodicity(detailResult.raws);

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws
        }];
        result.count = headerResult.count + detailResult.count;
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

    // 📒 Fn[updateApply]: 설비별 기준서 적용여부 수정 / 설비별로 1개의 기준서만 적용되어야 함
  public updateApply = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new EqmInspService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      
      const data = await service.read(matched.uuid);
      const equipUuid = data.raws[0].equip_uuid;
      
      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 기준서의 설비에 해당하는 모든 기준서를 적용해제
        const canceledResult = await service.cancelApplyByEquip(equipUuid, req.user?.uid as number, tran);

        // 📌 기준서 적용
        const appliedResult = await service.updateApply({
          uuid: matched.uuid,
          apply_fg: true,
          apply_date: moment(moment.now()).toString()
        }, req.user?.uid as number, tran);

        result.raws = [{
          applied: appliedResult.raws[0],
          canceled: canceledResult.raws
        }];
        result.count = appliedResult.count + canceledResult.count;
      });
      
      return createApiResult(res, result, 200, '기준서 적용 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };
  
  // 📒 Fn[updateCancelApply]: 기준서 적용 해제
  public updateCancelApply = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new EqmInspService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      
      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 기준서 적용해제
        result = await service.updateApply({
          uuid: matched.uuid,
          apply_fg: false,
          apply_date: null
        }, req.user?.uid as number, tran);
      });
      
      return createApiResult(res, result, 200, '기준서 적용 해제 성공', this.stateTag, successState.UPDATE);
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
      const service = new EqmInspService(req.tenant.uuid);
      const detailService = new EqmInspDetailService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 기준서 수정
        const headerResult = await service.patch([data.header], req.user?.uid as number, tran);
        // 📌 설비점검 기준서의 등록일시와 적용일시 데이터 검증
        service.validateDateDiff({
          reg_date: headerResult.raws[0].reg_date,
          apply_date: headerResult.raws[0].apply_date ?? moment(moment.now()).toString(),
        });

        // 📌 세부 기준서 수정
        const detailResult = await detailService.patch(data.details, req.user?.uid as number, tran);
        // 📌 설비점검 상세 기준서의 유형(정기, 일상)에 따르는 필요 데이터 검증
        detailService.validatePeriodicity(detailResult.raws);

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws
        }];
        result.count = headerResult.count + detailResult.count;
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
      const service = new EqmInspService(req.tenant.uuid);
      const detailService = new EqmInspDetailService(req.tenant.uuid);
      
      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        const detailResult = await detailService.delete(data.details, req.user?.uid as number, tran);
        const count = await detailService.getCountInInsp(data.header.insp_id, tran);

        let headerResult: ApiResult<any> = { count: 0, raws: [] };
        if (count == 0) {
          headerResult = await service.delete([data.header], req.user?.uid as number, tran);
        }

        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws
        }];
        result.count = headerResult.count + detailResult.count;
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

export default EqmInspCtl;