import QmsInspResultDetailInfoRepo from '../../repositories/qms/insp-result-detail-info.repository';
import QmsInspResultRepo from '../../repositories/qms/insp-result.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import BaseCtl from '../base.controller';
import express = require('express');
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import checkArray from '../../utils/checkArray';
import QmsInspRepo from '../../repositories/qms/insp.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdEmpRepo from '../../repositories/std/emp.repository';
import QmsInspDetailRepo from '../../repositories/qms/insp-detail.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import QmsInspResultDetailValueRepo from '../../repositories/qms/insp-result-detail-value.repository';
import InvStoreRepo from '../../repositories/inv/store.repository';
import getStoreBody from '../../utils/getStoreBody';
import MatIncomeRepo from '../../repositories/mat/income.repository';
import OutIncomeRepo from '../../repositories/out/income.repository';
import getTranTypeCd from '../../utils/getTranTypeCd';
import getInspTypeCd from '../../utils/getInspTypeCd';
import QmsInspResult from '../../models/qms/insp-result.model';
import PrdWorkRepo from '../../repositories/prd/work.repository';
import MatReceiveDetailRepo from '../../repositories/mat/receive-detail.repository';
import OutReceiveDetailRepo from '../../repositories/out/receive-detail.repository';
import ApiResult from '../../interfaces/common/api-result.interface';
import unsealArray from '../../utils/unsealArray';
import StdRejectRepo from '../../repositories/std/reject.repository';
import getInspDetailTypeCd from '../../utils/getInspDetailTypeCd';
import AdmInspDetailTypeRepo from '../../repositories/adm/insp-detail-type.repository';
import StdUnitConvertRepo from '../../repositories/std/unit-convert.repository';
import isNumber from '../../utils/isNumber';
import StdUnitRepo from '../../repositories/std/unit.repository';
import { getSequelize } from '../../utils/getSequelize';
import config from '../../configs/config';

class QmsInspResultCtl extends BaseCtl {
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(QmsInspResultRepo);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'uuid',
        TRepo: QmsInspResultRepo,
        idName: 'insp_result_id',
        uuidName: 'uuid'
      },
      {
        key: 'insp',
        TRepo: QmsInspRepo,
        idName: 'insp_id',
        uuidName: 'insp_uuid'
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'unit',
        TRepo: StdUnitRepo,
        idName: 'unit_id',
        uuidName: 'unit_uuid'
      },
      {
        key: 'emp',
        TRepo: StdEmpRepo,
        idName: 'emp_id',
        uuidName: 'emp_uuid'
      },
      {
        key: 'reject',
        TRepo: StdRejectRepo,
        idName: 'reject_id',
        uuidName: 'reject_uuid'
      },
      {
        key: 'fromStore',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        idAlias: 'from_store_id',
        uuidName: 'from_store_uuid'
      },
      {
        key: 'fromLocation',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        idAlias: 'from_location_id',
        uuidName: 'from_location_uuid'
      },
      {
        key: 'toStore',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        idAlias: 'to_store_id',
        uuidName: 'to_store_uuid'
      },
      {
        key: 'toLocation',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        idAlias: 'to_location_id',
        uuidName: 'to_location_uuid'
      },
      {
        key: 'rejectStore',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        idAlias: 'reject_store_id',
        uuidName: 'reject_store_uuid'
      },
      {
        key: 'rejectLocation',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        idAlias: 'reject_location_id',
        uuidName: 'reject_location_uuid'
      },
    ];
  };

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[createReceiveInsp]: Receive Inspection(수입검사) 데이터 생성
  public createReceiveInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getBodyIncludedId(req.tenant.uuid, req.body);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      const detailInfoRepo = new QmsInspResultDetailInfoRepo(req.tenant.uuid);
      const detailValueRepo = new QmsInspResultDetailValueRepo(req.tenant.uuid);
      const matIncomeRepo = new MatIncomeRepo(req.tenant.uuid);
      const outIncomeRepo = new OutIncomeRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      const inspDetailTypeCd = req.body[0]?.header.insp_detail_type_cd;
      switch (inspDetailTypeCd) {
        case 'MAT_RECEIVE':
          this.fkIdInfos.push({
            key: 'receiveDetail',
            TRepo: MatReceiveDetailRepo,
            idName: 'receive_detail_id',
            idAlias: 'insp_reference_id',
            uuidName: 'receive_detail_uuid'
          });
          break;
        case 'OUT_RECEIVE':
          this.fkIdInfos.push({
            key: 'receiveDetail',
            TRepo: OutReceiveDetailRepo,
            idName: 'receive_detail_id',
            idAlias: 'insp_reference_id',
            uuidName: 'receive_detail_uuid'
          });
          break;
        default: throw new Error('잘못된 insp_detail_type_cd(세부검사유형) 입력');
      }

      await sequelize.transaction(async(tran) => { 
        // 📌 수입검사 성적서 Create Flow
        // ✅ 1. 검사 성적서 및 상세 데이터 생성
        // ✅ 2. 합격 수량 => 자재 또는 외주 입고 => 입고 창고 수불
        // ✅ 3. 부적합 수량 => 부적합 창고 수불

        for await (const data of req.body) {
          // 📌 검사 성적서 및 상세 데이터 Setting
          data.header[0].insp_type_cd = getInspTypeCd('RECEIVE_INSP');
          data.header[0].seq = await repo.getMaxSeq(getInspTypeCd('RECEIVE_INSP'), data.header[0].insp_detail_type_cd, data.header[0].insp_reference_id);
          data.header[0].seq++;

          // ✅ 검사 성적서 및 상세 데이터 생성
          const headerResult = await repo.create(data.header, req.user?.uid as number, tran);

          const detailInfoResults: ApiResult<any> = { raws: [], count: 0 };
          const detailValueResults: ApiResult<any> = { raws: [], count: 0 };

          for await (const detail of data.details) {
            const header = unsealArray(headerResult.raws);

            let detailValues = detail.values;
            delete detail.values;
            detail.factory_id = header.factory_id;
            detail.insp_result_id = header.insp_result_id;
            const detailInfo = checkArray(detail);

            // 📌 성적서 세부정보 저장
            const detailInfoResult = await detailInfoRepo.create(detailInfo, req.user?.uid as number, tran);
            detailInfoResults.raws = detailInfoResults.raws.concat(detailInfoResult.raws);
            detailInfoResults.count += detailInfoResult.count;

            // 📌 성적서 세부 값에 세부정보 ID 입력
            detailValues = detailValues.map((value: any) => {
              value.factory_id = detailInfoResult.raws[0]?.factory_id;
              value.insp_result_detail_info_id = detailInfoResult.raws[0]?.insp_result_detail_info_id;
              return value;
            })

            // 📌 성적서 세부 값 저장
            const detailValueResult = await detailValueRepo.create(detailValues, req.user?.uid as number, tran); 
            detailValueResults.raws = detailValueResults.raws.concat(detailValueResult.raws);
            detailValueResults.count += detailValueResult.count;
          }

          // 📌 성적서 합불 수량 대비 창고 수불데이터 Setting
          const storeBody: any[] = [];
          let incomeResult: ApiResult<any> = { raws: [], count: 0 };
          if (data.header[0].pass_qty > 0) {
            // ✅ 합격 수량 => 자재 또는 외주 입고 => 입고 창고 수불
            const incomeBody = await this.getIncomeBody(req.tenant.uuid, {...headerResult.raws[0], unit_id: data.header[0].unit_id, qty: data.header[0].pass_qty});
            switch (data.header[0].insp_detail_type_cd) {
              case 'MAT_RECEIVE': 
                incomeResult = await matIncomeRepo.create(incomeBody, req.user?.uid as number, tran); 
                storeBody.push(...getStoreBody(incomeResult.raws, 'TO', 'income_id', getTranTypeCd('MAT_INCOME')));
                break;
              case 'OUT_RECEIVE': 
                incomeResult = await outIncomeRepo.create(incomeBody, req.user?.uid as number, tran); 
                storeBody.push(...getStoreBody(incomeResult.raws, 'TO', 'income_id', getTranTypeCd('OUT_INCOME')));
                break;
              default: break;
            }
          }
          // ✅ 부적합 수량 => 부적합 창고 수불
          if (data.header[0].reject_qty > 0) { storeBody.push(...getStoreBody(data.header, 'TO', 'insp_result_id', getTranTypeCd('QMS_RECEIVE_INSP_REJECT'))); }

          // 📌 수불 데이터 생성
          const storeResult = await storeRepo.create(storeBody, req.user?.uid as number, tran);

          result.raws.push({
            result: {
              header: headerResult.raws,
              detailInfos: detailInfoResults.raws,
              detailValues: detailValueResults.raws
            },
            income: incomeResult.raws,
            store: storeResult.raws
          });

          result.count += headerResult.count + detailInfoResults.count + detailValueResults.count + incomeResult.count + storeResult.count;
        }
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[createProcInsp]: Proc Inspection(공정검사) 데이터 생성
  public createProcInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      this.fkIdInfos.push({
        key: 'work',
        TRepo: PrdWorkRepo,
        idName: 'work_id',
        idAlias: 'insp_reference_id',
        uuidName: 'work_uuid'
      });

      req.body = await this.getBodyIncludedId(req.tenant.uuid, req.body);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      const detailInfoRepo = new QmsInspResultDetailInfoRepo(req.tenant.uuid);
      const detailValueRepo = new QmsInspResultDetailValueRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 공정검사 성적서 Create Flow
          // ✅ 1. 검사 성적서 및 상세 데이터 생성

          // 📌 검사 성적서 및 상세 데이터 Setting
          data.header[0].insp_type_cd = getInspTypeCd('PROC_INSP');
          data.header[0].seq = await repo.getMaxSeq(getInspTypeCd('PROC_INSP'), data.header[0].insp_detail_type_cd, data.header[0].insp_reference_id);
          data.header[0].seq++;

          // ✅ 검사 성적서 및 상세 데이터 생성
          const headerResult = await repo.create(data.header, req.user?.uid as number, tran);

          const detailInfoResults: ApiResult<any> = { raws: [], count: 0 };
          const detailValueResults: ApiResult<any> = { raws: [], count: 0 };

          for await (const detail of data.details) {
            const header = unsealArray(headerResult.raws);

            let detailValues = detail.values;
            delete detail.values;
            detail.factory_id = header.factory_id;
            detail.insp_result_id = header.insp_result_id;
            const detailInfo = checkArray(detail);

            // 📌 성적서 세부정보 저장
            const detailInfoResult = await detailInfoRepo.create(detailInfo, req.user?.uid as number, tran);
            detailInfoResults.raws = detailInfoResults.raws.concat(detailInfoResult.raws);
            detailInfoResults.count += detailInfoResult.count;

            // 📌 성적서 세부 값에 세부정보 ID 입력
            detailValues = detailValues.map((value: any) => {
              value.factory_id = detailInfoResult.raws[0]?.factory_id;
              value.insp_result_detail_info_id = detailInfoResult.raws[0]?.insp_result_detail_info_id;
              return value;
            })

            // 📌 성적서 세부 값 저장
            const detailValueResult = await detailValueRepo.create(detailValues, req.user?.uid as number, tran); 
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
        }
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[createFinalInsp]: Final Inspection(최종검사) 데이터 생성
  public createFinalInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getBodyIncludedId(req.tenant.uuid, req.body);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      const detailInfoRepo = new QmsInspResultDetailInfoRepo(req.tenant.uuid);
      const detailValueRepo = new QmsInspResultDetailValueRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 최종검사 성적서 Create Flow
          // ✅ 1. 검사 성적서 및 상세 데이터 생성
          // ✅ 2. 성적서 합불 수량 대비 창고 수불

          // 📌 검사 성적서 및 상세 데이터 Setting
          data.header[0].insp_type_cd = getInspTypeCd('FINAL_INSP');
          data.header[0].insp_detail_type_cd = getInspDetailTypeCd('finalInsp');
          data.header[0].seq = await repo.getMaxSeq(getInspTypeCd('FINAL_INSP'), data.header[0].insp_detail_type_cd, data.header[0].insp_reference_id);
          data.header[0].seq++;

          // ✅ 검사 성적서 및 상세 데이터 생성
          const headerResult = await repo.create(data.header, req.user?.uid as number, tran);

          const detailInfoResults: ApiResult<any> = { raws: [], count: 0 };
          const detailValueResults: ApiResult<any> = { raws: [], count: 0 };

          for await (const detail of data.details) {
            const header = unsealArray(headerResult.raws);

            let detailValues = detail.values;
            delete detail.values;
            detail.factory_id = header.factory_id;
            detail.insp_result_id = header.insp_result_id;
            const detailInfo = checkArray(detail);

            // 📌 성적서 세부정보 저장
            const detailInfoResult = await detailInfoRepo.create(detailInfo, req.user?.uid as number, tran);
            detailInfoResults.raws = detailInfoResults.raws.concat(detailInfoResult.raws);
            detailInfoResults.count += detailInfoResult.count;

            // 📌 성적서 세부 값에 세부정보 ID 입력
            detailValues = detailValues.map((value: any) => {
              value.factory_id = detailInfoResult.raws[0]?.factory_id;
              value.insp_result_detail_info_id = detailInfoResult.raws[0]?.insp_result_detail_info_id;
              return value;
            })

            // 📌 성적서 세부 값 저장
            const detailValueResult = await detailValueRepo.create(detailValues, req.user?.uid as number, tran); 
            detailValueResults.raws = detailValueResults.raws.concat(detailValueResult.raws);
            detailValueResults.count += detailValueResult.count;
          }

          // ✅ 성적서 합불 수량 대비 창고 수불
          const storeBody: any[] = [];
          // 📌 합격수량 => 가용 창고 수불 (IN)
          if (data.header[0].pass_qty > 0) { 
            storeBody.push(...getStoreBody(headerResult.raws, 'FROM', 'insp_result_id', getTranTypeCd('QMS_FINAL_INSP_INCOME')));
            storeBody.push(...getStoreBody(headerResult.raws, 'TO', 'insp_result_id', getTranTypeCd('QMS_FINAL_INSP_INCOME'))); 
          }
          // 📌 불합격수량 => 부적합 창고 수불
          if (data.header[0].reject_qty > 0) { 
            storeBody.push(...getStoreBody(headerResult.raws, 'FROM', 'insp_result_id', getTranTypeCd('QMS_FINAL_INSP_REJECT')));
            storeBody.push(...getStoreBody(headerResult.raws, 'TO', 'insp_result_id', getTranTypeCd('QMS_FINAL_INSP_REJECT'))); 
          }

          // 📌 수불 데이터 생성
          const storeResult = await storeRepo.create(storeBody, req.user?.uid as number, tran);

          result.raws.push({
            result: {
              header: headerResult.raws,
              detailInfos: detailInfoResults.raws,
              detailValues: detailValueResults.raws
            },
            store: storeResult.raws
          });

          result.count += headerResult.count + detailInfoResults.count + detailValueResults.count + storeResult.count;
        }
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };
  
  //#endregion

  //#region 🔵 Read Functions

  // 📒 Fn[read] (✅ Inheritance): Default Read Function
  // public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  // 📒 Fn[readWaitingReceive]: 수입검사 성적서 대기 List Read Function
  public readWaitingReceive = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new QmsInspResultRepo(req.tenant.uuid);

      const params = Object.assign(req.query, req.params);
      if (![ 'all', 'matReceive', 'outReceive' ].includes(params.insp_detail_type)) { throw new Error('잘못된 insp_detail_type(세부검사유형) 입력') }

      const result = await repo.readWaitingReceive(params);
      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readReceive]: 수입검사 성적서 Read Function
  public readReceive = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      const params = Object.assign(req.query, req.params);

      switch (params.insp_detail_type) {
        case 'all':
          if (params.uuid) { throw new Error('잘못된 insp_detail_type(세부검사유형) 입력'); }

          const matReceiveRead = await repo.readMatReceive(params);
          const outReceiveRead = await repo.readOutReceive(params);

          result.raws = [...matReceiveRead.raws, ...outReceiveRead.raws];
          result.count = matReceiveRead.count + outReceiveRead.count;
          break;
        case 'matReceive': 
          result = params.uuid ? await repo.readMatReceiveByUuid(params.uuid, params) : await repo.readMatReceive(params); 
          break;
        case 'outReceive': 
          result = params.uuid ? await repo.readOutReceiveByUuid(params.uuid, params) : await repo.readOutReceive(params); 
          break;
        default: throw new Error('잘못된 insp_detail_type(세부검사유형) 입력');
      }
  
      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readReceiveIncludeDetails]: 수입검사 성적서 데이터의 Header + Detail 함께 조회
  public readReceiveIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      const detailInfoRepo = new QmsInspResultDetailInfoRepo(req.tenant.uuid);
      const detailValueRepo = new QmsInspResultDetailValueRepo(req.tenant.uuid);
      const inspDetailTypeRepo = new AdmInspDetailTypeRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      const params = Object.assign(req.query, req.params);
      params.insp_result_uuid = params.uuid;
      let headerResult: ApiResult<any> = { raws: [], count: 0 };

      // 📌 수입검사 상세유형 조회
      const inspResultRead = await repo.readRawByUuid(params.uuid);

      // ❗ 등록되어있는 성적서가 없을 경우 Error Throw
      if (!inspResultRead.raws[0]) { throw new Error('성적서 조회결과가 없습니다.'); }
      const inspDeatilTypeCd = unsealArray(inspResultRead.raws).insp_detail_type_cd;

      // 📌 수입검사 유형에 따라 성적서 Header 조회
      switch (inspDeatilTypeCd) {
        case 'MAT_RECEIVE': headerResult = await repo.readMatReceiveByUuid(params.uuid, params); break;
        case 'OUT_RECEIVE': headerResult = await repo.readOutReceiveByUuid(params.uuid, params); break;
      }

      // 📌 insp_detail_type(세부검사유형)에 따라 작업자 검사 혹은 QC 검사 항목만 조회
      const inspDetailTypeRead = await inspDetailTypeRepo.read({ insp_detail_type_cd: inspDeatilTypeCd });
      const inspDetailType = unsealArray(inspDetailTypeRead.raws);
      if (inspDetailType.worker_fg === '1') { (params as any).worker_fg = true; }
      if (inspDetailType.inspector_fg === '1') { (params as any).inspector_fg = true; }

      const detailInfoResult = await detailInfoRepo.read(params);
      let detailsResult: ApiResult<any> = { raws: [], count: detailInfoResult.count };
      let maxSampleCnt: number = 0;

      // 📌 성적서 세부 데이터 Setting 및 작업자, 검사원별 Max 시료수를 계산하여 Header에 입력
      for await (const info of detailInfoResult.raws) {
        const detailValueResult = await detailValueRepo.read({ insp_result_detail_info_uuid: info.insp_result_detail_info_uuid });
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
        if (inspDetailType.worker_fg) { 
          info.sample_cnt = info.worker_sample_cnt; delete info.worker_sample_cnt;
          info.insp_cycle = info.worker_insp_cycle; delete info.worker_insp_cycle;
        }
        if (inspDetailType.inspector_fg) { 
          info.sample_cnt = info.inspector_sample_cnt; delete info.inspector_sample_cnt;
          info.insp_cycle = info.inspector_insp_cycle; delete info.inspector_insp_cycle;
        }

        if (info.sample_cnt > maxSampleCnt) { maxSampleCnt = info.sample_cnt; }
      }
      headerResult.raws[0].max_sample_cnt = maxSampleCnt;
      
      result.raws = [{ header: unsealArray(headerResult.raws), details: detailsResult.raws }];
      result.count = headerResult.count + detailsResult.count;
      
      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readProc]: 공정검사 성적서 Read Function
  public readProc = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      const params = Object.assign(req.query, req.params);

      if (params.uuid) { result = await repo.readProcByUuid(params.uuid, params); }
      else { 
        // 📌 공정검사 유형에 따라 성적서 Header 조회
        const inspDetailTypeCd = getInspDetailTypeCd(params.insp_detail_type as any);
        if (params.insp_detail_type != 'all' && !inspDetailTypeCd) { throw new Error('잘못된 insp_detail_type(세부검사유형) 입력'); }
        
        result = await repo.readProc(params); 
      }
  
      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readProcIncludeDetails]: 공정검사 성적서 데이터의 Header + Detail 함께 조회
  public readProcIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      const detailInfoRepo = new QmsInspResultDetailInfoRepo(req.tenant.uuid);
      const detailValueRepo = new QmsInspResultDetailValueRepo(req.tenant.uuid);
      const inspDetailTypeRepo = new AdmInspDetailTypeRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      const params = Object.assign(req.query, req.params);
      params.insp_result_uuid = params.uuid;

      const headerResult = await repo.readProcByUuid(params.uuid);
      if (!headerResult.raws[0]) { throw new Error('성적서 조회결과가 없습니다.'); }
      
      // 📌 insp_detail_type(세부검사유형)에 따라 작업자 검사 혹은 QC 검사 항목만 조회
      const inspDetailTypeRead = await inspDetailTypeRepo.read({ insp_detail_type_cd: getInspDetailTypeCd(params.insp_detail_type as any) });
      const inspDetailType = unsealArray(inspDetailTypeRead.raws);

      if (inspDetailType.worker_fg === '1') { (params as any).worker_fg = true; }
      if (inspDetailType.inspector_fg === '1') { (params as any).inspector_fg = true; }

      const detailInfoResult = await detailInfoRepo.read(params);
      let detailsResult: ApiResult<any> = { raws: [], count: detailInfoResult.count };
      let maxSampleCnt: number = 0;

      // 📌 성적서 세부 데이터 Setting 및 작업자, 검사원별 Max 시료수를 계산하여 Header에 입력
      for await (const info of detailInfoResult.raws) {
        const detailValueResult = await detailValueRepo.read({ insp_result_detail_info_uuid: info.insp_result_detail_info_uuid });
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
        if (inspDetailType.worker_fg) { 
          info.sample_cnt = info.worker_sample_cnt; delete info.worker_sample_cnt;
          info.insp_cycle = info.worker_insp_cycle; delete info.worker_insp_cycle;
        }
        if (inspDetailType.inspector_fg) { 
          info.sample_cnt = info.inspector_sample_cnt; delete info.inspector_sample_cnt;
          info.insp_cycle = info.inspector_insp_cycle; delete info.inspector_insp_cycle;
        }

        if (info.sample_cnt > maxSampleCnt) { maxSampleCnt = info.sample_cnt; }
      }
      headerResult.raws[0].max_sample_cnt = maxSampleCnt;

      result.raws = [{ header: unsealArray(headerResult.raws), details: detailsResult.raws }];
      result.count = headerResult.count + detailsResult.count;
      
      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readProcDetailsByWork]: 실적기준 모든 차수의 공정검사 성적서 Detail 데이터 조회
  public readProcDetailsByWork = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      const detailInfoRepo = new QmsInspResultDetailInfoRepo(req.tenant.uuid);
      const detailValueRepo = new QmsInspResultDetailValueRepo(req.tenant.uuid);
      const inspDetailTypeRepo = new AdmInspDetailTypeRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      const params = Object.assign(req.query, req.params);

      const inspDetailTypeCd = getInspDetailTypeCd(params.insp_detail_type as any);
      if (params.insp_detail_type != 'all' && !inspDetailTypeCd) { throw new Error('잘못된 insp_detail_type(세부검사유형) 입력'); }
      if (!params.work_uuid) { throw new Error('잘못된 work_uuid(생산실적UUID) 입력'); }

      let maxSampleCnt: number = 0;

      const headerResult = await repo.readProc({ work_uuid: params.uuid, insp_detail_type_cd: inspDetailTypeCd });
      for await (const header of headerResult.raws) {
        // 📌 insp_detail_type(세부검사유형)에 따라 작업자 검사 혹은 QC 검사 항목만 조회
        const inspDetailTypeRead = await inspDetailTypeRepo.read({ insp_detail_type_cd: getInspDetailTypeCd(params.insp_detail_type as any) });
        const inspDetailType = unsealArray(inspDetailTypeRead.raws);

        const detailParams: any = { insp_result_uuid: header.insp_result_uuid };
        if (inspDetailType.worker_fg === '1') { detailParams.worker_fg = true; }
        if (inspDetailType.inspector_fg === '1') { detailParams.inspector_fg = true; }

        const detailInfoResult = await detailInfoRepo.read(detailParams);
        let detailsResult: ApiResult<any> = { raws: [], count: detailInfoResult.count };

        // 📌 성적서 세부 데이터 Setting 및 작업자, 검사원별 Max 시료수를 계산하여 Header에 입력
        for await (const info of detailInfoResult.raws) {
          const detailValueResult = await detailValueRepo.read({ insp_result_detail_info_uuid: info.insp_result_detail_info_uuid });
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
        if (inspDetailType.worker_fg) { 
          info.sample_cnt = info.worker_sample_cnt; delete info.worker_sample_cnt;
          info.insp_cycle = info.worker_insp_cycle; delete info.worker_insp_cycle;
        }
        if (inspDetailType.inspector_fg) { 
          info.sample_cnt = info.inspector_sample_cnt; delete info.inspector_sample_cnt;
          info.insp_cycle = info.inspector_insp_cycle; delete info.inspector_insp_cycle;
        }

          if (info.sample_cnt > maxSampleCnt) { maxSampleCnt = info.sample_cnt; }
        }
        headerResult.raws[0].max_sample_cnt = maxSampleCnt;
        
        result.raws = result.raws.concat(detailsResult.raws);
        result.count += detailsResult.count;
      }
      
      return response(res, result.raws, { count: result.count, max_sample_cnt: maxSampleCnt });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readFinal]: 최종검사 성적서 Read Function
  public readFinal = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      const params = Object.assign(req.query, req.params);

      if (params.uuid) { result = await repo.readFinalByUuid(params.uuid, params); }
      else { result = await repo.readFinal(params); }
  
      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readFinalIncludeDetails]: 최종검사 성적서 데이터의 Header + Detail 함께 조회
  public readFinalIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      const detailInfoRepo = new QmsInspResultDetailInfoRepo(req.tenant.uuid);
      const detailValueRepo = new QmsInspResultDetailValueRepo(req.tenant.uuid);
      const inspDetailTypeRepo = new AdmInspDetailTypeRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      const params = Object.assign(req.query, req.params);
      params.insp_result_uuid = params.uuid;

      const headerResult = await repo.readFinalByUuid(params.uuid);
      if (!headerResult.raws[0]) { throw new Error('성적서 조회결과가 없습니다.'); }

      // 📌 insp_detail_type(세부검사유형)에 따라 작업자 검사 혹은 QC 검사 항목만 조회
      const inspDetailTypeRead = await inspDetailTypeRepo.read({ insp_detail_type_cd: getInspDetailTypeCd(params.insp_detail_type as any) });
      const inspDetailType = unsealArray(inspDetailTypeRead.raws);
      if (inspDetailType.worker_fg === '1') { (params as any).worker_fg = true; }
      if (inspDetailType.inspector_fg === '1') { (params as any).inspector_fg = true; }

      const detailInfoResult = await detailInfoRepo.read(params);
      let detailsResult: ApiResult<any> = { raws: [], count: detailInfoResult.count };
      let maxSampleCnt: number = 0;

      // 📌 성적서 세부 데이터 Setting 및 작업자, 검사원별 Max 시료수를 계산하여 Header에 입력
      for await (const info of detailInfoResult.raws) {
        const detailValueResult = await detailValueRepo.read({ insp_result_detail_info_uuid: info.insp_result_detail_info_uuid });
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
        if (inspDetailType.worker_fg) { 
          info.sample_cnt = info.worker_sample_cnt; delete info.worker_sample_cnt;
          info.insp_cycle = info.worker_insp_cycle; delete info.worker_insp_cycle;
        }
        if (inspDetailType.inspector_fg) { 
          info.sample_cnt = info.inspector_sample_cnt; delete info.inspector_sample_cnt;
          info.insp_cycle = info.inspector_insp_cycle; delete info.inspector_insp_cycle;
        }

        if (info.sample_cnt > maxSampleCnt) { maxSampleCnt = info.sample_cnt; }
      }
      headerResult.raws[0].max_sample_cnt = maxSampleCnt;
      
      result.raws = [{ header: unsealArray(headerResult.raws), details: detailsResult.raws }];
      result.count = headerResult.count + detailsResult.count;
      
      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readMaxSeqInProcInsp]: 공정검사 성적서의 현재 최대 차수(Seq) Read
  public readMaxSeqInProcInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new QmsInspResultRepo(req.tenant.uuid);

      const params = Object.assign(req.query, req.params);
      const workRead = await new PrdWorkRepo(req.tenant.uuid).readRawByUuid(params.work_uuid);
      const workId = unsealArray(workRead.raws).work_id;
      const inspDetailTypeCd = getInspDetailTypeCd(params.insp_detail_type as any);
      if (!inspDetailTypeCd) { throw new Error('잘못된 insp_detail_type(세부검사유형) 입력'); }

      const seq = await repo.getMaxSeq(getInspTypeCd('PROC_INSP'), inspDetailTypeCd, workId);
  
      return response(res, [], { seq });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🟡 Update Functions

  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  // public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  // 📒 Fn[updateReceiveInsp]: Receive Inspection(수입검사) 데이터 수정
  public updateReceiveInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getBodyIncludedId(req.tenant.uuid, req.body);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      const detailInfoRepo = new QmsInspResultDetailInfoRepo(req.tenant.uuid);
      const detailValueRepo = new QmsInspResultDetailValueRepo(req.tenant.uuid);
      const matIncomeRepo = new MatIncomeRepo(req.tenant.uuid);
      const outIncomeRepo = new OutIncomeRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
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
          const headerResult = await repo.update(data.header, req.user?.uid as number, tran);
          const detailInfosResult = await detailInfoRepo.update(detailInfos, req.user?.uid as number, tran);

          const createdDetailValuesResult = await detailValueRepo.create(detailValuesForCreate, req.user?.uid as number, tran);
          const updatedDetailValuesResult = await detailValueRepo.update(detailValuesForUpdate, req.user?.uid as number, tran);
          const deletedDetailValuesResult = await detailValueRepo.delete(detailValuesForDelete, req.user?.uid as number, tran);
          const detailValuesResult = { 
            raws: [ ...createdDetailValuesResult.raws, ...updatedDetailValuesResult.raws, ...deletedDetailValuesResult.raws ],
            count: createdDetailValuesResult.count + updatedDetailValuesResult.count + deletedDetailValuesResult.count
          };

          // ✅ 수불 데이터 및 입고내역 삭제 후 재 등록
          const deleteStoreBody: any[] = [];
          // const receiveDetailIds = headerResult.raws.map((raw: any) => { return raw.insp_reference_id; });
          let incomeIds: any[] = [];
          // 📌 자재 또는 외주 입고 내역 및 수불 내역을 삭제 목록에 추가
          switch (data.header[0].insp_detail_type_cd) {
            case 'MAT_RECEIVE': 
              // incomeIds = await matIncomeRepo.readIncomeIdsToReceiveDetailIds(receiveDetailIds);
              if (incomeIds[0]) deleteStoreBody.push({ tran_id: incomeIds[0], inout_fg: true, tran_cd: getTranTypeCd('MAT_INCOME') });
              break;
            case 'OUT_RECEIVE': 
              // incomeIds = await outIncomeRepo.readIncomeIdsToReceiveDetailIds(receiveDetailIds);
              if (incomeIds[0]) deleteStoreBody.push({ tran_id: incomeIds[0], inout_fg: true, tran_cd: getTranTypeCd('OUT_INCOME') });
              break;
            default: break;
          }

          // 📌 수입검사 부적합 수불 내역을 삭제 목록에 추가
          deleteStoreBody.push({ tran_id: data.header[0].insp_result_id, inout_fg: true, tran_cd: getTranTypeCd('QMS_RECEIVE_INSP_REJECT') });
          // deleteStoreBody.push(...getStoreBody(data.header, 'TO', 'insp_result_id', getTranTypeCd('QMS_RECEIVE_INSP_REJECT')));

          // 📌❌ 수불 내역 삭제
          await storeRepo.deleteToTransaction(deleteStoreBody, req.user?.uid as number, tran);
        
          let incomeResult: ApiResult<any> = { raws: [], count: 0 };
          // 📌❌ 자재 또는 외주 입고 내역 삭제
          switch (data.header[0].insp_detail_type_cd) {
            case 'MAT_RECEIVE': incomeResult = await matIncomeRepo.deleteToPk(incomeIds, req.user?.uid as number, tran); break;
            case 'OUT_RECEIVE': incomeResult = await outIncomeRepo.deleteToPk(incomeIds, req.user?.uid as number, tran); break;
            default: break;
          }

          // 📌 성적서 합불 수량 대비 창고 수불데이터 Setting
          const storeBody: any[] = [];
          if (data.header[0].pass_qty > 0) {
            // 📌✅ 합격수량 => 자재 또는 외주 입고 => 입고 창고 수불 데이터 생성
            const incomeBody = await this.getIncomeBody(req.tenant.uuid, {...headerResult.raws[0], unit_id: data.header[0].unit_id, qty: data.header[0].pass_qty});
            switch (data.header[0].insp_detail_type_cd) {
              case 'MAT_RECEIVE': 
                incomeResult = await matIncomeRepo.create(incomeBody, req.user?.uid as number, tran); 
                storeBody.push(...getStoreBody(incomeResult.raws, 'TO', 'income_id', getTranTypeCd('MAT_INCOME')));
                break;
              case 'OUT_RECEIVE': 
                incomeResult = await outIncomeRepo.create(incomeBody, req.user?.uid as number, tran); 
                storeBody.push(...getStoreBody(incomeResult.raws, 'TO', 'income_id', getTranTypeCd('OUT_INCOME')));
                break;
              default: break;
            }
          }
          // 📌 불합격수량 => 부적합 창고 수불 데이터 생성
          if (data.header[0].reject_qty > 0) { storeBody.push(...getStoreBody(data.header, 'TO', 'insp_result_id', getTranTypeCd('QMS_RECEIVE_INSP_REJECT'))); }

          // 📌✅ 수불 데이터 생성
          const storeResult = await storeRepo.create(storeBody, req.user?.uid as number, tran);

          result.raws.push({
            result: {
              header: headerResult.raws,
              detailInfos: detailInfosResult.raws,
              detailValues: detailValuesResult.raws
            },
            income: incomeResult.raws,
            store: storeResult.raws
          });

          result.count += headerResult.count + detailInfosResult.count + detailValuesResult.count + incomeResult.count + storeResult.count;
        }
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[updateProcInsp]: Proc Inspection(공정검사) 데이터 수정
  public updateProcInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      // 📌 공정검사 성적서 Update Flow
      // ✅ 1. 검사 성적서 및 상세 데이터 수정 및 생성 (상세 값 추가 된 것은 생성, 기존 값에서 수정된 것은 수정)

      req.body = await this.getBodyIncludedId(req.tenant.uuid, req.body);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      const detailInfoRepo = new QmsInspResultDetailInfoRepo(req.tenant.uuid);
      const detailValueRepo = new QmsInspResultDetailValueRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
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
          const headerResult = await repo.update(data.header, req.user?.uid as number, tran);
          const detailInfosResult = await detailInfoRepo.update(detailInfos, req.user?.uid as number, tran);

          const createdDetailValuesResult = await detailValueRepo.create(detailValuesForCreate, req.user?.uid as number, tran);
          const updatedDetailValuesResult = await detailValueRepo.update(detailValuesForUpdate, req.user?.uid as number, tran);
          const deletedDetailValuesResult = await detailValueRepo.delete(detailValuesForDelete, req.user?.uid as number, tran);
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
        }
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[updateFinalInsp]: Final Inspection(최종검사) 데이터 수정
  public updateFinalInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      // 📌 최종검사 성적서 Update Flow
      // ✅ 1. 검사 성적서 및 상세 데이터 수정 및 생성 (상세 값 추가 된 것은 생성, 기존 값에서 수정된 것은 수정)
      // ✅ 2. 수불 데이터 및 입고내역 삭제 후 재 등록

      req.body = await this.getBodyIncludedId(req.tenant.uuid, req.body);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      const detailInfoRepo = new QmsInspResultDetailInfoRepo(req.tenant.uuid);
      const detailValueRepo = new QmsInspResultDetailValueRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
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
          const headerResult = await repo.update(data.header, req.user?.uid as number, tran);
          const detailInfosResult = await detailInfoRepo.update(detailInfos, req.user?.uid as number, tran);

          const createdDetailValuesResult = await detailValueRepo.create(detailValuesForCreate, req.user?.uid as number, tran);
          const updatedDetailValuesResult = await detailValueRepo.update(detailValuesForUpdate, req.user?.uid as number, tran);
          const deletedDetailValuesResult = await detailValueRepo.delete(detailValuesForDelete, req.user?.uid as number, tran);
          const detailValuesResult = { 
            raws: [ ...createdDetailValuesResult.raws, ...updatedDetailValuesResult.raws, ...deletedDetailValuesResult.raws ],
            count: createdDetailValuesResult.count + updatedDetailValuesResult.count + deletedDetailValuesResult.count
          };

          // ✅ 수불 데이터 및 입고내역 삭제 후 재 등록
          const deleteStoreBody: any[] = [];
          // 📌 최종검사 입출고 및 부적합 수불 내역을 삭제 목록에 추가
          deleteStoreBody.push({ tran_id: data.header[0].insp_result_id, inout_fg: true, tran_cd: getTranTypeCd('QMS_FINAL_INSP_INCOME') });
          deleteStoreBody.push({ tran_id: data.header[0].insp_result_id, inout_fg: false, tran_cd: getTranTypeCd('QMS_FINAL_INSP_INCOME') });
          deleteStoreBody.push({ tran_id: data.header[0].insp_result_id, inout_fg: true, tran_cd: getTranTypeCd('QMS_FINAL_INSP_REJECT') });
          deleteStoreBody.push({ tran_id: data.header[0].insp_result_id, inout_fg: false, tran_cd: getTranTypeCd('QMS_FINAL_INSP_REJECT') });

          // 📌❌ 수불 내역 삭제
          await storeRepo.deleteToTransaction(deleteStoreBody, req.user?.uid as number, tran);

          // 📌 성적서 합불 수량 대비 창고 수불데이터 Setting
          const storeBody: any[] = [];
          // 📌 합격수량 => 가용 창고 수불
          if (data.header[0].pass_qty > 0) { 
            storeBody.push(...getStoreBody(headerResult.raws, 'FROM', 'insp_result_id', getTranTypeCd('QMS_FINAL_INSP_INCOME'))); 
            storeBody.push(...getStoreBody(headerResult.raws, 'TO', 'insp_result_id', getTranTypeCd('QMS_FINAL_INSP_INCOME'))); 
          }
          // 📌 불합격수량 => 부적합 창고 수불
          if (data.header[0].reject_qty > 0) { 
            storeBody.push(...getStoreBody(headerResult.raws, 'FROM', 'insp_result_id', getTranTypeCd('QMS_RECEIVE_INSP_REJECT'))); 
            storeBody.push(...getStoreBody(headerResult.raws, 'TO', 'insp_result_id', getTranTypeCd('QMS_RECEIVE_INSP_REJECT'))); 
          }

          // 📌 수불 데이터 생성
          const storeResult = await storeRepo.create(storeBody, req.user?.uid as number, tran);

          result.raws.push({
            result: {
              header: headerResult.raws,
              detailInfos: detailInfosResult.raws,
              detailValues: detailValuesResult.raws
            },
            store: storeResult.raws
          });

          result.count += headerResult.count + detailInfosResult.count + detailValuesResult.count + storeResult.count;
        }
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch] (✅ Inheritance): Default Patch Function
  // public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  // public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  // 📒 Fn[deleteReceiveInsp]: Receive Inspection(수입검사) 데이터 삭제
  public deleteReceiveInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
			req.body = checkArray(req.body); 
			req.body = await this.getFkId(req.body, [...this.fkIdInfos]);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      const detailInfoRepo = new QmsInspResultDetailInfoRepo(req.tenant.uuid);
      const detailValueRepo = new QmsInspResultDetailValueRepo(req.tenant.uuid);
      const matIncomeRepo = new MatIncomeRepo(req.tenant.uuid);
      const outIncomeRepo = new OutIncomeRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 수입검사 성적서 Delete Flow
          // ✅ 1. 수불내역 삭제
          // ✅ 2. 입고내역 삭제
          // ✅ 3. 검사성적서상세값 삭제
          // ✅ 4. 검사성적서상세정보 삭제
          // ✅ 5. 검사성적서 삭제

          const header: QmsInspResult = unsealArray((await repo.readRawByUuid(data.uuid)).raws);
          // const receiveDetailId = header.insp_reference_id;
          const storeBody: any[] = [];
          let incomeIds: any[] = [];
          // 📌 자재 또는 외주 입고 내역 및 수불 내역을 삭제req.body = checkArray(req.body); 목록에 추가
          switch (data.insp_detail_type_cd) {
            case 'MAT_RECEIVE': 
              // incomeIds = await matIncomeRepo.readIncomeIdsToReceiveDetailIds([receiveDetailId]);
              if (incomeIds[0]) storeBody.push({ tran_id: incomeIds[0], inout_fg: true, tran_cd: getTranTypeCd('MAT_INCOME') });
              break;
            case 'OUT_RECEIVE': 
              // incomeIds = await outIncomeRepo.readIncomeIdsToReceiveDetailIds([receiveDetailId]);
              if (incomeIds[0]) storeBody.push({ tran_id: incomeIds[0], inout_fg: true, tran_cd: getTranTypeCd('OUT_INCOME') });
              break;
            default: break;
          }
          // 📌 수입검사 부적합 수불 내역을 삭제 목록에 추가
          // storeBody.push(...getStoreBody([header], 'TO', 'insp_result_id', getTranTypeCd('QMS_RECEIVE_INSP_REJECT')));
          storeBody.push({ tran_id: data.insp_result_id, inout_fg: true, tran_cd: getTranTypeCd('QMS_RECEIVE_INSP_REJECT') });

          // ✅ 수불 내역 삭제
          const storeResult = await storeRepo.deleteToTransaction(storeBody, req.user?.uid as number, tran);

          let incomeResult: ApiResult<any> = { raws: [], count: 0 };
          // ✅ 자재 또는 외주 입고 내역 삭제
          switch (header.insp_detail_type_cd) {
            case 'MAT_RECEIVE': incomeResult = await matIncomeRepo.deleteToPk(incomeIds, req.user?.uid as number, tran); break;
            case 'OUT_RECEIVE': incomeResult = await outIncomeRepo.deleteToPk(incomeIds, req.user?.uid as number, tran); break;
            default: break;
          }

          // 📌 검사 성적서 상세 값을 삭제하기 위하여 검사 성적서 상세정보 Id 조회
          const detailInfos = await detailInfoRepo.readByResultId(header.insp_result_id);
          const detailInfoIds = detailInfos.raws.map((raw: any) => { return raw.insp_result_detail_info_id });

          // ✅ 검사성적서상세값 삭제
          const detailValuesResult = await detailValueRepo.deleteByInfoIds(detailInfoIds, req.user?.uid as number, tran);

          // ✅ 검사성적서상세정보 삭제
          const detailInfosResult = await detailInfoRepo.deleteByResultIds([header.insp_result_id], req.user?.uid as number, tran);

          // ✅ 검사성적서 삭제
          const headerResult = await repo.delete([data], req.user?.uid as number, tran);

          result.raws.push({
            result: {
              header: headerResult.raws,
              detailInfos: detailInfosResult.raws,
              detailValues: detailValuesResult.raws
            },
            income: incomeResult.raws,
            store: storeResult.raws
          });

          result.count += headerResult.count + detailInfosResult.count + detailValuesResult.count + incomeResult.count + storeResult.count;
        }
      });

      return response(res, result.raws, { count: result.count }, '', 200);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[deleteProcInsp]: Proc Inspection(공정검사) 데이터 삭제
  public deleteProcInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = checkArray(req.body);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      const detailInfoRepo = new QmsInspResultDetailInfoRepo(req.tenant.uuid);
      const detailValueRepo = new QmsInspResultDetailValueRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 공정검사 성적서 Delete Flow
          // ✅ 1. 검사성적서상세값 삭제
          // ✅ 2. 검사성적서상세정보 삭제
          // ✅ 3. 검사성적서 삭제
          const header: QmsInspResult = unsealArray((await repo.readRawByUuid(data.uuid)).raws);
          // 📌 검사 성적서 상세 값을 삭제하기 위하여 검사 성적서 상세정보 Id 조회
          const detailInfos = await detailInfoRepo.readByResultId(header.insp_result_id);
          const detailInfoIds = detailInfos.raws.map((raw: any) => { return raw.insp_result_detail_info_id });
          // ✅ 검사성적서상세값 삭제
          const detailValuesResult = await detailValueRepo.deleteByInfoIds(detailInfoIds, req.user?.uid as number, tran);
          // ✅ 검사성적서상세정보 삭제
          const detailInfosResult = await detailInfoRepo.deleteByResultIds([header.insp_result_id], req.user?.uid as number, tran);
          // ✅ 검사성적서 삭제	
          const headerResult = await repo.delete([data], req.user?.uid as number, tran);

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

      return response(res, result.raws, { count: result.count }, '', 200);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[deleteFinalInsp]: Final Inspection(최종검사) 데이터 삭제
  public deleteFinalInsp = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
			req.body = checkArray(req.body); 
			req.body = await this.getFkId(req.body, [...this.fkIdInfos]);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new QmsInspResultRepo(req.tenant.uuid);
      const detailInfoRepo = new QmsInspResultDetailInfoRepo(req.tenant.uuid);
      const detailValueRepo = new QmsInspResultDetailValueRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 최종검사 성적서 Delete Flow
          // ✅ 1. 수불내역 삭제
          // ✅ 2. 검사성적서상세값 삭제
          // ✅ 3. 검사성적서상세정보 삭제
          // ✅ 4. 검사성적서 삭제

          const header: QmsInspResult = unsealArray((await repo.readRawByUuid(data.uuid)).raws);
          const storeBody: any[] = [];

          // 📌 최종검사 입출고 및 부적합 수불 내역을 삭제 목록에 추가
          storeBody.push({ tran_id: data.insp_result_id, inout_fg: true, tran_cd: getTranTypeCd('QMS_FINAL_INSP_INCOME') });
          storeBody.push({ tran_id: data.insp_result_id, inout_fg: false, tran_cd: getTranTypeCd('QMS_FINAL_INSP_INCOME') });
          storeBody.push({ tran_id: data.insp_result_id, inout_fg: true, tran_cd: getTranTypeCd('QMS_FINAL_INSP_REJECT') });
          storeBody.push({ tran_id: data.insp_result_id, inout_fg: false, tran_cd: getTranTypeCd('QMS_FINAL_INSP_REJECT') });

          // ✅ 수불 내역 삭제
          const storeResult = await storeRepo.deleteToTransaction(storeBody, req.user?.uid as number, tran);

          // 📌 검사 성적서 상세 값을 삭제하기 위하여 검사 성적서 상세정보 Id 조회
          const detailInfos = await detailInfoRepo.readByResultId(header.insp_result_id);
          const detailInfoIds = detailInfos.raws.map((raw: any) => { return raw.insp_result_detail_info_id });

          // ✅ 검사성적서상세값 삭제
          const detailValuesResult = await detailValueRepo.deleteByInfoIds(detailInfoIds, req.user?.uid as number, tran);

          // ✅ 검사성적서상세정보 삭제
          const detailInfosResult = await detailInfoRepo.deleteByResultIds([header.insp_result_id], req.user?.uid as number, tran);

          // ✅ 검사성적서 삭제
          const headerResult = await repo.delete([data], req.user?.uid as number, tran);

          result.raws.push({
            result: {
              header: headerResult.raws,
              detailInfos: detailInfosResult.raws,
              detailValues: detailValuesResult.raws
            },
            store: storeResult.raws
          });

          result.count += headerResult.count + detailInfosResult.count + detailValuesResult.count + storeResult.count;
        }
      });

      return response(res, result.raws, { count: result.count }, '', 200);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#endregion

  //#region ✅ Inherited Hooks

  //#region 🟢 Create Hooks

  // 📒 Fn[beforeCreate] (✅ Inheritance): Create Transaction 이 실행되기 전 호출되는 Function
  // beforeCreate = async(req: express.Request) => {}

  // 📒 Fn[beforeTranCreate] (✅ Inheritance): Create Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranCreate = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranCreate] (✅ Inheritance): Create Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranCreate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterCreate] (✅ Inheritance): Create Transaction 이 실행된 후 호출되는 Function
  // afterCreate = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🔵 Read Hooks

  // 📒 Fn[beforeRead] (✅ Inheritance): Read DB Tasking 이 실행되기 전 호출되는 Function
  // beforeRead = async(req: express.Request) => {}

  // 📒 Fn[afterRead] (✅ Inheritance): Read DB Tasking 이 실행된 후 호출되는 Function
  // afterRead = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🟡 Update Hooks

  // 📒 Fn[beforeUpdate] (✅ Inheritance): Update Transaction 이 실행되기 전 호출되는 Function
  // beforeUpdate = async(req: express.Request) => {}

  // 📒 Fn[beforeTranUpdate] (✅ Inheritance): Update Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranUpdate = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranUpdate] (✅ Inheritance): Update Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranUpdate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterUpdate] (✅ Inheritance): Update Transaction 이 실행된 후 호출되는 Function
  // afterUpdate = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🟠 Patch Hooks

  // 📒 Fn[beforePatch] (✅ Inheritance): Patch Transaction 이 실행되기 전 호출되는 Function
  // beforePatch = async(req: express.Request) => {}

  // 📒 Fn[beforeTranPatch] (✅ Inheritance): Patch Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranPatch = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranPatch] (✅ Inheritance): Patch Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranPatch = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterPatch] (✅ Inheritance): Patch Transaction 이 실행된 후 호출되는 Function
  // afterPatch = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🔴 Delete Hooks

  // 📒 Fn[beforeDelete] (✅ Inheritance): Delete Transaction 이 실행되기 전 호출되는 Function
  // beforeDelete = async(req: express.Request) => {}

  // 📒 Fn[beforeTranDelete] (✅ Inheritance): Delete Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranDelete = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranDelete] (✅ Inheritance): Delete Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranDelete = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterDelete] (✅ Inheritance): Delete Transaction 이 실행된 후 호출되는 Function
  // afterDelete = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#endregion

  //#region ✅ Optional Functions

  // 📒 Fn[getBodyIncludedId]: Body 내의 Uuid => Id Conversion
  /**
   * Body 내 Uuid => Id Conversion
   * @param _body Request Body
   * @returns Uuid => Id 로 Conversion 되어있는 Body
   */
  getBodyIncludedId = async (tenant: string, _body: any) => {
    const resultBody: any[] = [];
    _body = checkArray(_body);
    for await (const data of _body) {
      if (data.header) { 
        data.header = checkArray(data.header); 
        data.header = await this.getFkId(tenant, data.header, [...this.fkIdInfos]);
      }
    if (data.details) { 
      data.details = checkArray(data.details); 
      data.details = await this.getFkId(tenant, data.details, 
        [
          {
            key: 'factory',
            TRepo: StdFactoryRepo,
            idName: 'factory_id',
            uuidName: 'factory_uuid'
          },
          {
            key: 'uuid',
            TRepo: QmsInspResultDetailInfoRepo,
            idName: 'insp_result_detail_info_id',
            uuidName: 'uuid'
          },
          {
            key: 'inspResult',
            TRepo: QmsInspResultRepo,
            idName: 'insp_result_id',
            uuidName: 'insp_result_uuid'
          },
          {
            key: 'inspDetail',
            TRepo: QmsInspDetailRepo,
            idName: 'insp_detail_id',
            uuidName: 'insp_detail_uuid'
          },
          {
            key: 'prod',
            TRepo: StdProdRepo,
            idName: 'prod_id',
            uuidName: 'prod_uuid'
          }
        ]);
      }

      resultBody.push({ header: data.header, details: data.details });
    }

    return resultBody;
  }

  // 📒 Fn[getIncomeBody]: 자재입고 데이터 생성
  /**
   * 자재입고 데이터 생성
   * @param _body Request Body
   * @param _regDate 
   * @returns 
   */
  getIncomeBody = async (tenant: string, _body: any) => {
    const result: any[] = [];
    const prodRepo = new StdProdRepo(tenant);
    const unitConvertRepo = new StdUnitConvertRepo(tenant);

    _body = checkArray(_body);
    const datas = _body.raws ?? _body;
    
    for await (const data of datas) {
      const prod = unsealArray((await prodRepo.readRawByPk(data.prod_id)).raws);
      if (data.unit_id != prod.unit_id) {
        const convertValue = await unitConvertRepo.getConvertValueByUnitId(data.unit_id, prod.unit_id, data.prod_id);
        if (!convertValue) { throw new Error('단위 변환에 실패하였습니다.'); }

        data.qty *= convertValue;
      }

      result.push({
        factory_id: data.factory_id,
        prod_id: data.prod_id,
        reg_date: data.reg_date,
        lot_no: data.lot_no,
        qty: data.qty,
        receive_detail_id: data.receive_detail_id,
        to_store_id: data.to_store_id,
        to_location_id: data.to_location_id
      })
    }

    return result;
  }

  //#endregion
}

export default QmsInspResultCtl;