import * as express from 'express';
import checkArray from '../../utils/checkArray';
import BaseCtl from '../base.controller';
import sequelize from '../../models';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import QmsInspRepo from '../../repositories/qms/insp.repository';
import QmsInspDetailRepo from '../../repositories/qms/insp-detail.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdInspItemRepo from '../../repositories/std/insp-item.repository';
import StdInspMethodRepo from '../../repositories/std/insp-method.repository';
import StdInspToolRepo from '../../repositories/std/insp-tool.repository';
import moment = require('moment');
import QmsInspResultRepo from '../../repositories/qms/insp-result.repository';
import MatReceiveDetailRepo from '../../repositories/mat/receive-detail.repository';
import OutReceiveDetailRepo from '../../repositories/out/receive-detail.repository';
import PrdWorkRepo from '../../repositories/prd/work.repository';
import getInspTypeCd from '../../utils/getInspTypeCd';
import ApiResult from '../../interfaces/common/api-result.interface';
import unsealArray from '../../utils/unsealArray';
import AdmPatternHistoryCtl from '../adm/pattern-history.controller';
import AdmInspDetailTypeRepo from '../../repositories/adm/insp-detail-type.repository';
import getInspDetailTypeCd from '../../utils/getInspDetailTypeCd';

class QmsInspCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  repo: QmsInspRepo;
  detailRepo: QmsInspDetailRepo;
  resultRepo: QmsInspResultRepo;
  matReceiveDetailRepo: MatReceiveDetailRepo;
  outReceiveDetailRepo: OutReceiveDetailRepo;
  workRepo: PrdWorkRepo;
  inspDetailTypeRepo: AdmInspDetailTypeRepo;

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(new QmsInspRepo());
    this.detailRepo = new QmsInspDetailRepo();
    this.resultRepo = new QmsInspResultRepo();
    this.matReceiveDetailRepo = new MatReceiveDetailRepo();
    this.outReceiveDetailRepo = new OutReceiveDetailRepo();
    this.workRepo = new PrdWorkRepo();
    this.inspDetailTypeRepo = new AdmInspDetailTypeRepo();

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        repo: new StdFactoryRepo(),
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'insp',
        repo: new QmsInspRepo(),
        idName: 'insp_id',
        uuidName: 'insp_uuid'
      },
    ];
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getBodyIncludedId(req.body);
      this.result = { raws: [], count: 0 };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          let inspUuid: string;
          let inspId: number;
          let maxSeq: number;
          let headerResult: ApiResult<any> = { count: 0, raws: [] };
          const header = unsealArray(data.header);

          inspUuid = header.uuid;

          // 📌 공정검사 기준서 등록시 해당 품목의 생산이 진행중일 경우 기준서 생성 후 즉시 적용 불가
          if (header.apply_fg && header.insp_type_cd == getInspTypeCd('PROC_INSP')) {
            const workRead = await this.workRepo.read({ factory_uuid: header.factory_uuid, prod_uuid: header.prod_uuid, complete_fg: false });
            if (workRead.raws.length > 0) { throw new Error('등록하려고 하는 기준서의 품번이 현재 생산 진행중입니다. 적용을 해제한 후 등록하여 주십시오.'); }
            header.apply_date = header.apply_date ? header.apply_date : moment(moment.now()).toString();
          }

          if (!inspUuid) {
            // 📌 기준서번호가 수기 입력되지 않고 자동발행 Option일 경우 번호 자동발행
            if (!header.insp_no) { 
              header.insp_no = await new AdmPatternHistoryCtl().getPattern({
                factory_id: header.factory_id,
                table_nm: 'QMS_INSP_TB',
                col_nm: 'insp_no',
                reg_date: header.reg_date,
                uid: req.user?.uid as number,
                tran: tran
              });
            }

            headerResult = await this.repo.create(data.header, req.user?.uid as number, tran);
            inspId = headerResult.raws[0].insp_id;
            inspUuid = headerResult.raws[0].uuid;

            maxSeq = 0;
          } else {
            inspId = header.insp_id;

            // 📌 Max Seq 계산
            maxSeq = await this.detailRepo.getMaxSeq(inspId, tran) as number;
          }

          data.details = data.details.map((detail: any) => {
            detail.insp_id = inspId;
            detail.seq = ++maxSeq;
            return detail;
          });

          // 📌 세부 기준서 등록
          const detailResult = await this.detailRepo.create(data.details, req.user?.uid as number, tran);

          this.result.raws.push({
            header: headerResult.raws,
            details: detailResult.raws,
          });

          this.result.count += headerResult.count + detailResult.count;
        }
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };
  //#endregion

  //#region 🔵 Read Functions

  // 📒 Fn[read] (✅ Inheritance): Default Read Function
  // public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  // 📒 Fn[readIncludeDetails]: 기준서 데이터의 Header + Detail 함께 조회
  public readIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      params.insp_uuid = params.uuid;

      const headerResult = await this.repo.readByUuid(params.insp_uuid);

      // ❗ 등록되어있는 기준서가 없을 경우 Error Throw
      if (!headerResult.raws[0]) { throw new Error('기준서 조회결과가 없습니다.'); }

      // 📌 insp_detail_type(세부검사유형)에 따라 작업자 검사 혹은 QC 검사 항목만 조회
      const inspDetailTypeRead = await this.inspDetailTypeRepo.read({ insp_detail_type_cd: getInspDetailTypeCd(params.insp_detail_type as any) });
      const inspDetailType = unsealArray(inspDetailTypeRead.raws);
      if (inspDetailType.worker_fg === '1') { (params as any).worker_fg = true; }
      if (inspDetailType.inspector_fg === '1') { (params as any).inspector_fg = true; }

      const detailsResult = await this.detailRepo.read(params);
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

      this.result.raws = [{ header: headerResult.raws[0], details: detailsResult.raws }];
      this.result.count = headerResult.count + detailsResult.count;
      
      return response(res, this.result.raws, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readDetails]: 기준서 데이터의 Detail 조회
  public readDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      params.insp_uuid = params.uuid;

      this.result = await this.detailRepo.read(params);
      
      return response(res, this.result.raws, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  
  // 📒 Fn[readIncludeDetailsByReceive]: 자재 또는 외주 입하상세내역을 통하여 수입검사 기준서 및 상세내역 조회
  public readIncludeDetailsByReceive = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      let inspResultRead: ApiResult<any> = { raws: [], count: 0 };
      let inspUuid: string | undefined = undefined;
      let prodUuid: string | undefined = undefined;

      // 📌 세부검사유형(자재, 외주)에 따라서 입하상세내역에 등록된 성적서 검색
      switch (params.insp_detail_type) {
        case 'matReceive':
          if (!params.receive_detail_uuid) { throw new Error('잘못된 receive_detail_uuid(자재입하UUID) 입력'); }
          inspResultRead = await this.resultRepo.readMatReceive({ receive_detail_uuid: params.receive_detail_uuid });
          break;
        case 'outReceive':
          if (!params.receive_detail_uuid) { throw new Error('잘못된 receive_detail_uuid(외주입하UUID) 입력'); }
          inspResultRead = await this.resultRepo.readOutReceive({ receive_detail_uuid: params.receive_detail_uuid });
          break;
        default: throw new Error('잘못된 insp_detail_type(세부검사유형) 입력');
      }

      let headerResult: ApiResult<any> = { raws: [], count: 0 };
      if (inspResultRead.raws[0]) { 
        // 📌 등록된 성적서가 있을 경우 기준서의 UUID를 통하여 기준서 조회
        inspUuid = inspResultRead.raws[0].insp_uuid as string; 
        headerResult = await this.repo.readByUuid(inspUuid);
      } else { 
        // 📌 등록된 성적서가 없을 경우 품목 UUID 저장
        switch (params.insp_detail_type) {
          case 'matReceive': 
            const matReceiveDetailRead = await this.matReceiveDetailRepo.readByUuid(params.receive_detail_uuid);
            prodUuid = unsealArray(matReceiveDetailRead.raws).prod_uuid;
            break;
          case 'outReceive': 
            const outReceiveDetailRead = await this.outReceiveDetailRepo.readByUuid(params.receive_detail_uuid);
            prodUuid = unsealArray(outReceiveDetailRead.raws).prod_uuid;
            break;
          default: break;
        } 

        // 📌 조회 조건에 따라 현재 적용중인 기준서 조회
        headerResult = await this.repo.read({
          factory_uuid: params.factory_uuid,
          prod_uuid: prodUuid,
          insp_type_cd: 'RECEIVE_INSP',
          apply_fg: true
        });
      }

      // ❗ 등록되어있는 기준서가 없을 경우 Error Throw
      if (!headerResult.raws[0]) { throw new Error('기준서 조회결과가 없습니다.'); }

      // 📌 insp_detail_type(세부검사유형)에 따라 작업자 검사 혹은 QC 검사 항목만 조회
      const inspDetailTypeRead = await this.inspDetailTypeRepo.read({ insp_detail_type_cd: getInspDetailTypeCd(params.insp_detail_type as any) });
      const inspDetailType = unsealArray(inspDetailTypeRead.raws);
      
      if (inspDetailType.worker_fg === '1') { (params as any).worker_fg = true; }
      if (inspDetailType.inspector_fg === '1') { (params as any).inspector_fg = true; }
      params.insp_uuid = headerResult.raws[0].insp_uuid;

      const detailsResult = await this.detailRepo.read(params);
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

      this.result.raws = [{ header: headerResult.raws[0], details: detailsResult.raws }];
      this.result.count = headerResult.count + detailsResult.count;
      
      return response(res, this.result.raws, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readIncludeDetailsByWork]: 생산실적내역을 통하여 공정검사 기준서 및 상세내역 조회
  public readIncludeDetailsByWork = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      let inspResultRead: ApiResult<any> = { raws: [], count: 0 };
      let inspUuid: string | undefined = undefined;
      let prodUuid: string | undefined = undefined;

      if (!params.work_uuid) { throw new Error('잘못된 work_uuid(생산실적UUID) 입력'); }

      let inspDetailTypeCd: string = '';
      switch (params.insp_detail_type) {
        case 'selfProc': inspDetailTypeCd = 'SELF_PROC'; break;
        case 'patrolProc': inspDetailTypeCd = 'PATROL_PROC'; break;
        default: throw new Error('잘못된 insp_detail_type(세부검사유형) 입력');
      }

      // 📌 생산실적내역에 등록된 성적서 검색
      inspResultRead = await this.resultRepo.readProc({ work_uuid: params.work_uuid, insp_detail_type_cd: inspDetailTypeCd });

      let headerResult: ApiResult<any> = { raws: [], count: 0 };
      if (inspResultRead.raws[0]) { 
        // 📌 등록된 성적서가 있을 경우 기준서의 UUID를 통하여 기준서 조회
        inspUuid = inspResultRead.raws[0].insp_uuid as string; 
        headerResult = await this.repo.readByUuid(inspUuid);
      } else { 
        // 📌 등록된 성적서가 없을 경우 품목 UUID 저장
        const workRead = await this.workRepo.readByUuid(params.work_uuid);
        prodUuid = unsealArray(workRead.raws).prod_uuid; 

        // 📌 조회 조건에 따라 현재 적용중인 기준서 조회
        headerResult = await this.repo.read({
          factory_uuid: params.factory_uuid,
          prod_uuid: prodUuid,
          insp_type_cd: 'PROC_INSP',
          apply_fg: true
        });
      }

      // ❗ 등록되어있는 기준서가 없을 경우 Error Throw
      if (!headerResult.raws[0]) { throw new Error('기준서 조회결과가 없습니다.'); }

      // 📌 insp_detail_type(세부검사유형)에 따라 작업자 검사 혹은 QC 검사 항목만 조회
      const inspDetailTypeRead = await this.inspDetailTypeRepo.read({ insp_detail_type_cd: getInspDetailTypeCd(params.insp_detail_type as any) });
      const inspDetailType = unsealArray(inspDetailTypeRead.raws);

      if (inspDetailType.worker_fg === '1') { (params as any).worker_fg = true; }
      if (inspDetailType.inspector_fg === '1') { (params as any).inspector_fg = true; }
      params.insp_uuid = headerResult.raws[0].insp_uuid;

      const detailsResult = await this.detailRepo.read(params);
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

      this.result.raws = [{ header: headerResult.raws[0], details: detailsResult.raws }];
      this.result.count = headerResult.count + detailsResult.count;
      
      return response(res, this.result.raws, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🟡 Update Functions

  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getBodyIncludedId(req.body);
      this.result = { raws: [], count: 0 };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 공정검사 기준서 등록시 해당 품목의 생산이 진행중일 경우 기준서 생성 후 즉시 적용 불가
          if (data.apply_fg) {
            const inspRead = await this.repo.readByUuid(data.uuid);
            const insp = unsealArray(inspRead.raws);

            if (insp.insp_type_cd == getInspTypeCd('PROC_INSP')) {
              const workRead = await this.workRepo.read({ factory_uuid: insp.factory_uuid, prod_uuid: insp.prod_uuid, complete_fg: false });
              if (workRead.raws.length > 0) { throw new Error('등록하려고 하는 기준서의 품번이 현재 생산 진행중입니다.'); }
              data.apply_date = data.apply_date ? data.apply_date : moment(moment.now()).toString();
            }

            // 📌 해당 품목의 모든 기준서를 비 활성화 상태로 만들기 위한 Body 생성
            const read = await this.repo.read({ 
              factory_uuid: insp.factory_uuid,
              prod_uuid: insp.prod_uuid,
              insp_type_cd: insp.insp_type_cd
            });
            const wholeInspBody = read.raws.map((raw: any) => {
              return {
                uuid: raw.dataValues.insp_uuid,
                apply_fg: false,
                apply_date: null
              };
            });
          
            // 📌 수정할 품목의 모든 기준서를 미적용 상태로 수정
            await this.repo.updateApply(wholeInspBody, req.user?.uid as number, tran);
          }

          // 📌 기준서 데이터 수정
          const headerResult = await this.repo.update(data.header, req.user?.uid as number, tran);
          const detailResult = await this.detailRepo.update(data.details, req.user?.uid as number, tran);

          this.result.raws.push({
            header: headerResult.raws,
            details: detailResult.raws,
          });

          this.result.count += headerResult.count + detailResult.count;
        }
      });
      
      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };
  
  // 📒 Fn[updateApply]: 품목별 기준서 적용여부 수정 / 폼목별로 1개의 기준서만 적용되어야 함
  public updateApply = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = { uuid: '80e88e3b-0c3c-4ad1-ae44-38de907013e0' }
      req.body = checkArray(req.body);
      this.result = { raws: [], count: 0 };
      const updateInspBody: any[] = [];

      // 📌 품목, 기준서 유형별 전체 기준서 조회 및 적용해야 할 기준서의 uuid를 가지고 있는 Body 생성
      for await (const data of req.body) {
        const inspRead = await this.repo.readByUuid(data.uuid);
        const insp = unsealArray(inspRead.raws);

        // 📌 공정검사 기준서 등록시 해당 품목의 생산이 진행중일 경우 기준서 생성 후 즉시 적용 불가
        if (insp.insp_type_cd == getInspTypeCd('PROC_INSP')) {
          const workRead = await this.workRepo.read({ factory_uuid: insp.factory_uuid, prod_uuid: insp.prod_uuid, complete_fg: false });
          if (workRead.raws.length > 0) { throw new Error('등록하려고 하는 기준서의 품번이 현재 생산 진행중입니다. 적용을 해제한 후 등록하여 주십시오.'); }
        }

        const read = await this.repo.read({ 
          factory_uuid: insp.factory_uuid,
          prod_uuid: insp.prod_uuid,
          insp_type_cd: insp.insp_type_cd
        });

        // 📌 해당 품목의 모든 기준서를 비 활성화 상태로 만들기 위한 Body 생성
        const wholeInspBody = read.raws.map((raw: any) => {
          return {
            uuid: raw.insp_uuid,
            apply_fg: false,
            apply_date: null
          };
        });

        const applyInspBody = [{
          uuid: data.uuid,
          apply_fg: true,
          apply_date: data.apply_date ? data.apply_date : moment(moment.now()).toString()
        }];

        updateInspBody.push({ wholeInspBody, applyInspBody });
      }

      await sequelize.transaction(async(tran) => { 
        for await (const data of updateInspBody) {
          // 📌 수정할 품목의 모든 기준서를 미적용 상태로 수정
          const wholeInspResult = await this.repo.updateApply(data.wholeInspBody, req.user?.uid as number, tran);

          // 📌 선택된 기준서만 적용 상태로 변경
          const ApplyInspResult = await this.repo.updateApply(data.applyInspBody, req.user?.uid as number, tran);

          this.result.raws.push({
            wholeInsp: wholeInspResult.raws,
            applyInsp: ApplyInspResult.raws
          });

          this.result.count += wholeInspResult.count + ApplyInspResult.count;
        }
      });
      
      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };
  
  // 📒 Fn[updateCancelApply]: 기준서 적용 해제
  public updateCancelApply = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = checkArray(req.body);
      this.result = { raws: [], count: 0 };

      // 📌 기준서를 비활성화 상태로 만들기 위한 Body 생성
      const inspBody = req.body.map((data: any) => {
        return {
          uuid: data.uuid,
          apply_fg: false,
          apply_date: null
        }
      });

      await sequelize.transaction(async(tran) => { 
        this.result = await this.repo.updateApply(inspBody, req.user?.uid as number, tran);
      });
      
      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch] (✅ Inheritance): Default Patch Function
  public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getBodyIncludedId(req.body);
      this.result = { raws: [], count: 0 };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 공정검사 기준서 등록시 해당 품목의 생산이 진행중일 경우 기준서 생성 후 즉시 적용 불가
          if (data.apply_fg) {
            const inspRead = await this.repo.readByUuid(data.uuid);
            const insp = unsealArray(inspRead.raws);
            
            if (insp.insp_type_cd == getInspTypeCd('PROC_INSP')) {
              const workRead = await this.workRepo.read({ factory_uuid: insp.factory_uuid, prod_uuid: insp.prod_uuid, complete_fg: false });
              if (workRead.raws.length > 0) { throw new Error('등록하려고 하는 기준서의 품번이 현재 생산 진행중입니다. 적용을 해제한 후 등록하여 주십시오.'); }
              data.apply_date = data.apply_date ? data.apply_date : moment(moment.now()).toString();
            }

            // 📌 해당 품목의 모든 기준서를 비 활성화 상태로 만들기 위한 Body 생성
            const read = await this.repo.read({ 
              factory_uuid: insp.factory_uuid,
              prod_uuid: insp.prod_uuid,
              insp_type_cd: insp.insp_type_cd
            });
            const wholeInspBody = read.raws.map((raw: any) => {
              return {
                uuid: raw.dataValues.insp_uuid,
                apply_fg: false,
                apply_date: null
              };
            });
          
            // 📌 수정할 품목의 모든 기준서를 미적용 상태로 수정
            await this.repo.updateApply(wholeInspBody, req.user?.uid as number, tran);
          }

          // 📌 기준서 데이터 수정
          const headerResult = await this.repo.patch(data.header, req.user?.uid as number, tran);
          const detailResult = await this.detailRepo.patch(data.details, req.user?.uid as number, tran);

          this.result.raws.push({
            header: headerResult.raws,
            details: detailResult.raws,
          });

          this.result.count += headerResult.count + detailResult.count;
        }
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Delete Create Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getBodyIncludedId(req.body);
      this.result = { raws: [], count: 0 };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 입하 내역 삭제
          const detailResult = await this.detailRepo.delete(data.details, req.user?.uid as number, tran);
          const count = await this.detailRepo.getCount(data.header[0].insp_id, tran);

          let headerResult: ApiResult<any> = { count: 0, raws: [] };
          if (count == 0) {
            headerResult = await this.repo.delete(data.header, req.user?.uid as number, tran);
          }

          this.result.raws.push({
            header: headerResult.raws,
            details: detailResult.raws,
          });

          this.result.count += headerResult.count + detailResult.count;
        }
      });
  
      return response(res, this.result.raws, { count: this.result.count }, '', 200);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#endregion

  //#region ✅ Inherited Hooks 

  //#region 🔵 Read Hooks

  // 📒 Fn[beforeRead]: Read DB Tasking 이 실행되기 전 호출되는 Function
  beforeRead = async(req: express.Request) => {
    if (req.params.uuid) { return; }
  }

  // 📒 Fn[afterRead]: Read DB Tasking 이 실행된 후 호출되는 Function
  // afterRead = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#endregion

  //#region ✅ Optional Functions

  // 📒 Fn[getBodyIncludedId]: Body 내의 Uuid => Id Conversion
  /**
   * Body 내 Uuid => Id Conversion
   * @param _body Request Body
   * @returns Uuid => Id 로 Conversion 되어있는 Body
   */
  getBodyIncludedId = async (_body: any) => {
    const resultBody: any[] = [];
    _body = checkArray(_body);

    for await (const data of _body) {
      if (data.header) { 
        data.header = checkArray(data.header); 
        data.header = await this.getFkId(data.header, 
          [...this.fkIdInfos, 
            {
              key: 'uuid',
              repo: new QmsInspRepo(),
              idName: 'insp_id',
              uuidName: 'uuid'
            },
            {
              key: 'prod',
              repo: new StdProdRepo(),
              idName: 'prod_id',
              uuidName: 'prod_uuid'
            },
          ]);
      }
    if (data.details) { 
      data.details = checkArray(data.details); 
      data.details = await this.getFkId(data.details, 
        [...this.fkIdInfos, 
          {
            key: 'uuid',
            repo: new QmsInspDetailRepo(),
            idName: 'insp_detail_id',
            uuidName: 'uuid'
          },
          {
            key: 'inspItem',
            repo: new StdInspItemRepo(),
            idName: 'insp_item_id',
            uuidName: 'insp_item_uuid'
          },
          {
            key: 'inspMethod',
            repo: new StdInspMethodRepo(),
            idName: 'insp_method_id',
            uuidName: 'insp_method_uuid'
          },
          {
            key: 'inspTool',
            repo: new StdInspToolRepo(),
            idName: 'insp_tool_id',
            uuidName: 'insp_tool_uuid'
          },
        ]);
      }

      resultBody.push({ header: data.header, details: data.details });
    }

    return resultBody;
  }
}

export default QmsInspCtl;