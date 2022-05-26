import express from 'express';
import { matchedData } from 'express-validator';
import config from '../../configs/config';
import QmsInspService from '../../services/qms/insp.service';
import QmsInspDetailService from '../../services/qms/insp-detail.service';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import { sequelizes } from '../../utils/getSequelize';
import isServiceResult from '../../utils/isServiceResult';
import response from '../../utils/response_new';
import createApiResult from '../../utils/createApiResult_new';
import { errorState, successState } from '../../states/common.state';
import ApiResult from '../../interfaces/common/api-result.interface';
import AdmPatternHistoryService from '../../services/adm/pattern-history.service';
import AdmPatternOptService from '../../services/adm/pattern-opt.service';
import moment from 'moment';
import AdmInspDetailTypeService from '../../services/adm/insp-detail-type.service';
import createApiError from '../../utils/createApiError';
import QmsInspResultService from '../../services/qms/insp-result.service';
import MatReceiveDetailService from '../../services/mat/receive-detail.service';
import OutReceiveDetailService from '../../services/out/receive-detail.service';
import PrdWorkService from '../../services/prd/work.service';
import AdmFileMgmtService from '../../services/adm/file-mgmt.service';

class QmsInspCtl {
  stateTag: string;
  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'qmsInsp';
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspService(req.tenant.uuid);
      const detailService = new QmsInspDetailService(req.tenant.uuid);
      const patternOptService = new AdmPatternOptService(req.tenant.uuid);
      const patternService = new AdmPatternHistoryService(req.tenant.uuid);
			const fileService = new AdmFileMgmtService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

			let fileUuids: string[] = [];

			// 📌 파일을 함께 저장하는 경우
			if (req.headers['file-included'] === 'true') {
				// 📌 데이터 내에 있는 file 데이터가 Temp S3에 존재하는지 Validation
				fileUuids = await fileService.validateFileInTempStorage(data.header);
			}

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        let inspId: number;
        let maxSeq: number;
        let headerResult: ApiResult<any> = { count: 0, raws: [] };
        
        // 📌 자재입하의 UUID가 입력되지 않은 경우 자재입하 신규 발행
        if (!data.header.uuid) {
          // 📌 공정검사 기준서 등록시 해당 품목의 생산이 진행중일 경우 기준서 생성 후 즉시 적용 불가
          if(data.header.apply_fg) {
            await service.validateWorkingByProd(data.header);
            data.header.apply_date = data.header.apply_date ? data.header.apply_date : moment(moment.now()).format().toString();

            // 📌 해당 품목의 모든 기준서를 비 활성화 상태로 만들기 위한 Body 생성
            const read = await service.read({ 
              factory_uuid:  data.header.factory_uuid,
              prod_uuid:  data.header.prod_uuid,
              insp_type_id:  data.header.insp_type_uuid
            });

            const wholeInspBody = read.raws.map((raw: any) => {
              return {
                uuid: raw.insp_uuid,
                apply_fg: false,
                apply_date: null
              };
            });

            // 📌 수정할 품목의 모든 기준서를 미적용 상태로 수정
            await service.updateApply(wholeInspBody, req.user?.uid as number, tran);
          }

          // 📌 전표자동발행 옵션 여부 확인
          const hasAutoOption = await patternOptService.hasAutoOption({ table_nm: 'QMS_INSP_TB', col_nm: 'insp_no', tran });

          // 📌 전표의 자동발행옵션이 On인 경우
          if (hasAutoOption) {
            data.header.insp_no = await patternService.getPattern({
              factory_id: data.header.factory_id,
              table_nm: 'QMS_INSP_TB',
              col_nm: 'insp_no',
              reg_date: data.header.reg_date,
              uid: req.user?.uid as number,
              tran: tran
            });
          }

          // 📌 전표 생성
          headerResult = await service.create([data.header], req.user?.uid as number, tran);
          inspId = headerResult.raws[0].insp_id;
          maxSeq = 0;

					// 📌 파일관리 저장
					if (req.headers['file-included'] === 'true') {
						const fileDatas = await fileService.getFileDatasByUnique(data.header, headerResult.raws, ['insp_no', 'factory_id'])
						await fileService.create(fileDatas, req.user?.uid as number, tran);
					}
        } else {
          // 📌 전표 수정
          headerResult = await service.update([data.header], req.user?.uid as number, tran);
          inspId = headerResult.raws[0].insp_id;

          // 📌 Max Seq 계산
          maxSeq = await detailService.getMaxSeq(inspId, tran) as number;
        }
        // 📌 생성된 기준서ID 입력 및 Max Seq 기준 Seq 발행
        data.details = data.details.map((detail: any) => {
          detail.insp_id = inspId;
          detail.seq = ++maxSeq;
          return detail;
        });

        // 📌 자재입하상세 등록 및 합계금액 계산
        const detailResult = await detailService.create(data.details, req.user?.uid as number, tran);
        result.raws = [{
          header: headerResult.raws[0],
          details: detailResult.raws,
        }];

        result.count += headerResult.count + detailResult.count;
      });

			// 📌 Temp S3에 있는 File 데이터를 Real S3로 이동
      if (fileUuids) { await fileService.moveToRealStorage(fileUuids); }

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
      const service = new QmsInspService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      result = await service.read(params);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  }

  // 📒 Fn[readByUuid] (✅ Inheritance): Default ReadByUuid Function
  public readByUuid = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspService(req.tenant.uuid);

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
      const service = new QmsInspService(req.tenant.uuid);
      const detailService = new QmsInspDetailService(req.tenant.uuid);
      const inspDetailTypeService = new AdmInspDetailTypeService(req.tenant.uuid);

      let inspDetailTypeRead: ApiResult<any> = { count: 0, raws: [] };
      // ❗ insp_detail_type(세부검사유형)
      if (!params.insp_detail_type_uuid && !params.insp_detail_type_cd) {
        throw createApiError(
          400, 
          { 
            admin_message: '세부검사유형 정보가 입력되지 않았습니다.',
            user_message: '세부검사유형 정보가 입력되지 않았습니다.' 
          }, 
          this.stateTag, 
          errorState.NO_INPUT_REQUIRED_PARAM
        );
      } else if (params.insp_detail_type_cd) {
        inspDetailTypeRead = await inspDetailTypeService.read(params);
      } else { 
        inspDetailTypeRead = await inspDetailTypeService.readByUuid(params.insp_detail_type_uuid); 
      }
      
      const headerResult = await service.readByUuid(params.uuid);

      // ❗ 등록되어있는 기준서가 없을 경우 Error Throw
      if (!headerResult.raws[0]) { 
        throw createApiError(
          400, 
          { 
            admin_message: '기준서 조회결과가 없습니다.',
            user_message: '기준서 조회결과가 없습니다.'
          }, 
          this.stateTag, 
          errorState.NO_DATA
        );
      } else { params.insp_uuid = params.uuid; }

      // 📌 insp_detail_type(세부검사유형)에 따라 작업자 검사 혹은 QC 검사 항목만 조회
      const inspDetailType = inspDetailTypeRead.raws[0];
      if (inspDetailType.worker_fg == '1') { params.worker_fg = true; }
      if (inspDetailType.inspector_fg == '1') { params.inspector_fg = true; }

      const detailsResult = await detailService.read(params);
      let maxSampleCnt: number = 0;

      // 📌 작업자, 검사원별 Max 시료수 계산
      detailsResult.raws.forEach((raw: any) => {
        // 📌 insp_detail_type(세부검사유형)이 작업자 검사인지 QC 검사인지 구분
        if (inspDetailType.worker_fg) { 
          raw.sample_cnt = raw.worker_sample_cnt; delete raw.worker_sample_cnt;
          raw.insp_cycle = raw.worker_insp_cycle; delete raw.worker_insp_cycle;
        }
        if (inspDetailType.inspector_fg) { 
          raw.sample_cnt = raw.inspector_sample_cnt; delete raw.inspector_sample_cnt;
          raw.insp_cycle = raw.inspector_insp_cycle; delete raw.inspector_insp_cycle;
        }

        if (raw.sample_cnt > maxSampleCnt) { maxSampleCnt = raw.sample_cnt; }
      });
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

  // 📒 Fn[readDetails]: 기준서 데이터의 Detail 조회
  public readDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { raws: [], count: 0 };
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      params.insp_uuid = params.uuid;

      const detailService = new QmsInspDetailService(req.tenant.uuid);

      result = await detailService.read(params);
      
      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  
  // 📒 Fn[readIncludeDetailsByReceive]: 자재 또는 외주 입하상세내역을 통하여 수입검사 기준서 및 상세내역 조회
  public readIncludeDetailsByReceive = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const service = new QmsInspService(req.tenant.uuid);
      const detailService = new QmsInspDetailService(req.tenant.uuid);
      const resultService = new QmsInspResultService(req.tenant.uuid);
      const inspDetailTypeService = new AdmInspDetailTypeService(req.tenant.uuid);
      const matReceiveDetailService = new MatReceiveDetailService(req.tenant.uuid);
      const outReceiveDetailService = new OutReceiveDetailService(req.tenant.uuid);
      
      let inspResultRead: ApiResult<any> = { raws: [], count: 0 };
      let prodUuid: string | undefined = undefined;
      let inspUuid: string | undefined = undefined;
      let factoryUuid: string | undefined = undefined;
      let inspTypeUuid: string | undefined = undefined;

      // 📌 세부검사유형(자재, 외주)에 따라서 입하상세내역에 등록된 성적서 검색
      const inspDetailTypeRead = await inspDetailTypeService.readByUuid(params.insp_detail_type_uuid);
      inspTypeUuid = inspDetailTypeRead.raws[0].insp_type_uuid;

      const inspDetailTypeCd = inspDetailTypeRead.raws[0].insp_detail_type_cd;
      switch (inspDetailTypeCd) {
        case 'MAT_RECEIVE':
          inspResultRead = await resultService.readMatReceive({ receive_detail_uuid: params.receive_detail_uuid });
          break;
        case 'OUT_RECEIVE':
          inspResultRead = await resultService.readOutReceive({ receive_detail_uuid: params.receive_detail_uuid });
          break;
        default: break;
      }

      let headerResult: ApiResult<any> = { raws: [], count: 0 };
      if (inspResultRead.raws[0]) { 
        // 📌 등록된 성적서가 있을 경우 기준서의 UUID를 통하여 기준서 조회
        inspUuid = inspResultRead.raws[0].insp_uuid as string; 
        headerResult = await service.readByUuid(inspUuid);
      } else { 
        // 📌 등록된 성적서가 없을 경우 품목 UUID 저장
        switch (inspDetailTypeCd) {
          case 'MAT_RECEIVE': 
            const matReceiveDetailRead = await matReceiveDetailService.readByUuid(params.receive_detail_uuid);
            prodUuid = matReceiveDetailRead.raws[0].prod_uuid;
            factoryUuid = matReceiveDetailRead.raws[0].factory_uuid;

            break;
          case 'OUT_RECEIVE': 
            const outReceiveDetailRead = await outReceiveDetailService.readByUuid(params.receive_detail_uuid);
            prodUuid = outReceiveDetailRead.raws[0].prod_uuid;
            factoryUuid = outReceiveDetailRead.raws[0].factory_uuid;
            break;
          default: break;
        } 

        // 📌 조회 조건에 따라 현재 적용중인 기준서 조회
        headerResult = await service.read({
          factory_uuid: factoryUuid,
          prod_uuid: prodUuid,
          insp_type_uuid: inspTypeUuid,
          apply_fg: true
        });
      }

      // ❗ 등록되어있는 기준서가 없을 경우 Error Throw
      if (!headerResult.raws[0]) { 
        throw createApiError(
          400, 
          { 
            admin_message: '기준서 조회결과가 없습니다.',
            user_message: '기준서 조회결과가 없습니다.'
          }, 
          this.stateTag, 
          errorState.NO_DATA
        );
      }

      // 📌 insp_detail_type(세부검사유형)에 따라 작업자 검사 혹은 QC 검사 항목만 조회
      if (inspDetailTypeRead.raws[0].worker_fg == '1') { (params as any).worker_fg = true; }
      if (inspDetailTypeRead.raws[0].inspector_fg == '1') { (params as any).inspector_fg = true; }
      params.insp_uuid = headerResult.raws[0].insp_uuid;

      const detailsResult = await detailService.read(params);
      let maxSampleCnt: number = 0;

      // 📌 작업자, 검사원별 Max 시료수 계산
      detailsResult.raws.forEach((raw: any) => {
        // 📌 insp_detail_type(세부검사유형)이 작업자 검사인지 QC 검사인지 구분
        if (inspDetailTypeRead.raws[0].worker_fg) { 
          raw.sample_cnt = raw.worker_sample_cnt; delete raw.worker_sample_cnt;
          raw.insp_cycle = raw.worker_insp_cycle; delete raw.worker_insp_cycle;
        }
        if (inspDetailTypeRead.raws[0].inspector_fg) { 
          raw.sample_cnt = raw.inspector_sample_cnt; delete raw.inspector_sample_cnt;
          raw.insp_cycle = raw.inspector_insp_cycle; delete raw.inspector_insp_cycle;
        }

        if (raw.sample_cnt > maxSampleCnt) { maxSampleCnt = raw.sample_cnt; }
      });
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

  // 📒 Fn[readIncludeDetailsByWork]: 생산실적내역을 통하여 공정검사 기준서 및 상세내역 조회
  public readIncludeDetailsByWork = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const params = matchedData(req, { locations: [ 'query', 'params' ] });
      const service = new QmsInspService(req.tenant.uuid);
      const detailService = new QmsInspDetailService(req.tenant.uuid);
      const resultService = new QmsInspResultService(req.tenant.uuid);
      const workService = new PrdWorkService(req.tenant.uuid);
      const inspDetailTypeService = new AdmInspDetailTypeService(req.tenant.uuid);

      let inspResultRead: ApiResult<any> = { raws: [], count: 0 };
      let inspUuid: string | undefined = undefined;
      let prodUuid: string | undefined = undefined;
      let factoryUuid: string | undefined = undefined;
      let inspTypeUuid: string | undefined = undefined;

      const inspDetailTypeRead = await inspDetailTypeService.readByUuid(params.insp_detail_type_uuid);
      inspTypeUuid = inspDetailTypeRead.raws[0].insp_type_uuid;

      // 📌 생산실적내역에 등록된 성적서 검색
      inspResultRead = await resultService.readProc(params);

      let headerResult: ApiResult<any> = { raws: [], count: 0 };
      if (inspResultRead.raws[0]) { 
        // 📌 등록된 성적서가 있을 경우 기준서의 UUID를 통하여 기준서 조회
        inspUuid = inspResultRead.raws[0].insp_uuid as string; 
        headerResult = await service.readByUuid(inspUuid);
      } else { 
        // 📌 등록된 성적서가 없을 경우 품목 UUID 저장
        const workRead = await workService.readByUuid(params.work_uuid);
        prodUuid = workRead.raws[0].prod_uuid; 
        factoryUuid = workRead.raws[0].factory_uuid;

        // 📌 조회 조건에 따라 현재 적용중인 기준서 조회
        headerResult = await service.read({
          factory_uuid: factoryUuid,
          prod_uuid: prodUuid,
          insp_type_uuid: inspTypeUuid,
          apply_fg: true
        });
      }

      // ❗ 등록되어있는 기준서가 없을 경우 Error Throw
      if (!headerResult.raws[0]) { 
        throw createApiError(
          400, 
          { 
            admin_message: '기준서 조회결과가 없습니다.',
            user_message: '기준서 조회결과가 없습니다.'
          }, 
          this.stateTag, 
          errorState.NO_DATA
        );
      }

      // 📌 insp_detail_type(세부검사유형)에 따라 작업자 검사 혹은 QC 검사 항목만 조회
      if (inspDetailTypeRead.raws[0].worker_fg == '1') { (params as any).worker_fg = true; }
      if (inspDetailTypeRead.raws[0].inspector_fg == '1') { (params as any).inspector_fg = true; }
      params.insp_uuid = headerResult.raws[0].insp_uuid;

      const detailsResult = await detailService.read(params);
      let maxSampleCnt: number = 0;

      // 📌 작업자, 검사원별 Max 시료수 계산
      detailsResult.raws.forEach((raw: any) => {
        // 📌 insp_detail_type(세부검사유형)이 작업자 검사인지 QC 검사인지 구분
        if (inspDetailTypeRead.raws[0].worker_fg) { 
          raw.sample_cnt = raw.worker_sample_cnt; delete raw.worker_sample_cnt;
          raw.insp_cycle = raw.worker_insp_cycle; delete raw.worker_insp_cycle;
        }
        if (inspDetailTypeRead.raws[0].inspector_fg) { 
          raw.sample_cnt = raw.inspector_sample_cnt; delete raw.inspector_sample_cnt;
          raw.insp_cycle = raw.inspector_insp_cycle; delete raw.inspector_insp_cycle;
        }

        if (raw.sample_cnt > maxSampleCnt) { maxSampleCnt = raw.sample_cnt; }
      });
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

  //#endregion

  //#region 🟡 Update Functions

  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspService(req.tenant.uuid);
      const detailService = new QmsInspDetailService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 공정검사 기준서 등록시 해당 품목의 생산이 진행중일 경우 기준서 생성 후 즉시 적용 불가
        if(data.header.apply_fg) {
          const inspRead = await service.readByUuid(data.header.uuid);
          const insp = inspRead.raws[0];

          await service.validateWorkingByProd(insp);
          data.header.apply_date = data.header.apply_date ? data.header.apply_date : moment(moment.now()).format().toString();

          // 📌 해당 품목의 모든 기준서를 비 활성화 상태로 만들기 위한 Body 생성
          const read = await service.read({ 
            factory_uuid:  insp.factory_uuid,
            prod_uuid:  insp.prod_uuid,
            insp_type_id:  insp.insp_type_uuid
          });

          const wholeInspBody = read.raws.map((raw: any) => {
            return {
              uuid: raw.insp_uuid,
              apply_fg: false,
              apply_date: null
            };
          });

          // 📌 수정할 품목의 모든 기준서를 미적용 상태로 수정
          await service.updateApply(wholeInspBody, req.user?.uid as number, tran);
        }
        // 📌 기준서 데이터 수정
        const headerResult = await service.update([data.header], req.user?.uid as number, tran);
        const detailResult = await detailService.update(data.details, req.user?.uid as number, tran);

        result.raws.push({
          header: headerResult.raws[0],
          details: detailResult.raws,
        });
        result.count += headerResult.count + detailResult.count;
      });
      
      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };
  
  // 📒 Fn[updateApply]: 품목별 기준서 적용여부 수정 / 폼목별로 1개의 기준서만 적용되어야 함
  public updateApply = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { raws: [], count: 0 };
      const service = new QmsInspService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      let wholeInspBody: any[] = [];
      let applyInspBody: any[] = [];

      // 📌 품목, 기준서 유형별 전체 기준서 조회 및 적용해야 할 기준서의 uuid를 가지고 있는 Body 생성
      for await (const data of datas) {
        const inspRead = await service.readByUuid(data.uuid);
        const insp = inspRead.raws[0];

        // 📌 공정검사 기준서 등록시 해당 품목의 생산이 진행중일 경우 기준서 생성 후 즉시 적용 불가
        await service.validateWorkingByProd(insp);

        const read = await service.read({ 
          factory_uuid: insp.factory_uuid,
          prod_uuid: insp.prod_uuid,
          insp_type_cd: insp.insp_type_cd
        });

        // 📌 해당 품목의 모든 기준서를 비 활성화 상태로 만들기 위한 Body 생성
        wholeInspBody = read.raws.map((raw: any) => {
          return {
            uuid: raw.insp_uuid,
            apply_fg: false,
            apply_date: null
          };
        });

        applyInspBody = [{
          uuid: data.uuid,
          apply_fg: true,
          apply_date: data.apply_date ? data.apply_date : moment(moment.now()).format().toString()
        }];
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 수정할 품목의 모든 기준서를 미적용 상태로 수정
        const wholeInspResult = await service.updateApply(wholeInspBody, req.user?.uid as number, tran);

        // 📌 선택된 기준서만 적용 상태로 변경
        const ApplyInspResult = await service.updateApply(applyInspBody, req.user?.uid as number, tran);

        result.raws.push({
          wholeInsp: wholeInspResult.raws,
          applyInsp: ApplyInspResult.raws
        });

        result.count += wholeInspResult.count + ApplyInspResult.count;
      });
      
      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
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
      let result: ApiResult<any> = { raws: [], count: 0 };
      const service = new QmsInspService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      // 📌 기준서를 비활성화 상태로 만들기 위한 Body 생성
      const inspBody = datas.map((data: any) => {
        return {
          uuid: data.uuid,
          apply_fg: false,
          apply_date: null
        }
      });

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.updateApply(inspBody, req.user?.uid as number, tran);
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
      const service = new QmsInspService(req.tenant.uuid);
      const detailService = new QmsInspDetailService(req.tenant.uuid);

      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 공정검사 기준서 등록시 해당 품목의 생산이 진행중일 경우 기준서 생성 후 즉시 적용 불가
        if(data.header.apply_fg) {
          const inspRead = await service.readByUuid(data.header.uuid);
          const insp = inspRead.raws[0];

          await service.validateWorkingByProd(insp);
          data.header.apply_date = data.header.apply_date ? data.header.apply_date : moment(moment.now()).format().toString();

          // 📌 해당 품목의 모든 기준서를 비 활성화 상태로 만들기 위한 Body 생성
          const read = await service.read({ 
            factory_uuid:  insp.factory_uuid,
            prod_uuid:  insp.prod_uuid,
            insp_type_id:  insp.insp_type_uuid
          });

          const wholeInspBody = read.raws.map((raw: any) => {
            return {
              uuid: raw.dataValues.insp_uuid,
              apply_fg: false,
              apply_date: null
            };
          });

          // 📌 수정할 품목의 모든 기준서를 미적용 상태로 수정
          await service.updateApply(wholeInspBody, req.user?.uid as number, tran);
        }

        // 📌 기준서 데이터 수정
        const headerResult = await service.patch(data.header, req.user?.uid as number, tran);
        const detailResult = await detailService.patch(data.details, req.user?.uid as number, tran);

        result.raws.push({
          header: headerResult.raws[0],
          details: detailResult.raws,
        });
        result.count += headerResult.count + detailResult.count;
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

  // 📒 Fn[delete] (✅ Inheritance): Delete Create Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
			let fileResult: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsInspService(req.tenant.uuid);
      const detailService = new QmsInspDetailService(req.tenant.uuid);
			const fileService = new AdmFileMgmtService(req.tenant.uuid);
			

      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await detailService.convertFk(matched.details),
      }
			const referenceUuids = data.header.map((data: any) => data.uuid);

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        // 📌 기준서 상세 삭제
        const detailResult = await detailService.delete(data.details, req.user?.uid as number, tran);
        const count = await detailService.getCount(data.header.insp_id, tran);
        
        // 📌 기준서 삭제
        let headerResult: ApiResult<any> = { count: 0, raws: [] };
        if (count == 0) {
          headerResult = await service.delete([data.header], req.user?.uid as number, tran);
					fileResult = await fileService.deleteByReferenceUuids(referenceUuids, req.user?.uid as number, tran);
        }

        result.raws.push({
          header: headerResult.raws[0],
          details: detailResult.raws,
        });

        result.count += headerResult.count + detailResult.count;
      });

			// 📌 파일 데이터가 삭제된 경우
      if (fileResult.count) { 
        const fileUuids = fileResult.raws.map(raw => raw.uuid);
        await fileService.deleteFromRealStorage(fileUuids); 
      }
  
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

export default QmsInspCtl;