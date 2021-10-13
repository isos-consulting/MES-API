import express = require('express');
import IInvStore from '../../interfaces/inv/store.interface';
import sequelize from '../../models';
import InvStoreRepo from '../../repositories/inv/store.repository';
import PrdWorkInputRepo from '../../repositories/prd/work-input.repository';
import PrdWorkRepo from '../../repositories/prd/work.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import StdUnitRepo from '../../repositories/std/unit.repository';
import getStoreBody from '../../utils/getStoreBody';
import getTranTypeCd from '../../utils/getTranTypeCd';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import BaseCtl from '../base.controller';

class PrdWorkInputCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  repo: PrdWorkInputRepo;
  workRepo: PrdWorkRepo;
  storeRepo: InvStoreRepo;

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(new PrdWorkInputRepo());
    this.workRepo = new PrdWorkRepo();
    this.storeRepo = new InvStoreRepo();

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        repo: new StdFactoryRepo(),
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'work',
        repo: new PrdWorkRepo(),
        idName: 'work_id',
        uuidName: 'work_uuid'
      },
      {
        key: 'prod',
        repo: new StdProdRepo(),
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'unit',
        repo: new StdUnitRepo(),
        idName: 'unit_id',
        uuidName: 'unit_uuid'
      },
      {
        key: 'store',
        repo: new StdStoreRepo(),
        idAlias: 'from_store_id',
        idName: 'store_id',
        uuidName: 'from_store_uuid'
      },
      {
        key: 'location',
        repo: new StdLocationRepo(),
        idAlias: 'from_location_id',
        idName: 'location_id',
        uuidName: 'from_location_uuid'
      }
    ];
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);

      // 📌 생산실적이 완료상태일 경우 데이터 생성 불가
      const uuids = req.body.map((data: any) => { return data.work_uuid });
      const workRead = await this.workRepo.readRawsByUuids(uuids);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg == true) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 생성이 불가능합니다.`)} 
      });

      await sequelize.transaction(async(tran) => { 
        // 📌 실적-자재투입 데이터 생성
        const inputResult = await this.repo.create(req.body, req.user?.uid as number, tran); 

        // 📌 출고 창고 수불 내역 생성
        let storeBody: IInvStore[] = [];
        inputResult.raws.forEach((input: any) => {
          // 📌 실적 기준일자(생산일자) 검색
          const regDate = workRead.raws.find((work: any) => work.work_id == input.work_id ).reg_date;
          storeBody = storeBody.concat(getStoreBody(input, 'FROM', 'work_input_id', getTranTypeCd('PRD_INPUT'), regDate));
        });
        const storeResult = await this.storeRepo.create(storeBody, req.user?.uid as number, tran);

        this.result.raws = [{ input: inputResult.raws, store: storeResult.raws }];
        this.result.count = inputResult.count + storeResult.count;
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

  // 📒 Fn[readOngoing]: 진행중인 생산실적의 자재 투입데이터 Read Function
  public readOngoing = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      if (!params.work_uuid) { throw new Error('잘못된 work_uuid(생산실적UUID) 입력')} 

      this.result = await this.repo.readOngoing(params);
      
      return response(res, this.result.raws, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readOngoingGroup]: 진행중인 생산실적의 자재 투입데이터의 품목기준 총량 조회 Read Function
  public readOngoingGroup = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      if (!params.work_uuid) { throw new Error('잘못된 work_uuid(생산실적UUID) 입력')} 

      this.result = await this.repo.readOngoingGroup(params);
      
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
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      
      // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
      const uuids = req.body.map((data: any) => { return data.uuid });
      const workInputRead = await this.repo.readRawsByUuids(uuids);
      const workIds = workInputRead.raws.map((workInput: any) => { return workInput.work_id });
      const workRead = await this.workRepo.readRawByIds(workIds);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
      });

      await sequelize.transaction(async(tran) => { 
        // 📌 실적-자재투입 데이터 생성
        const inputResult = await this.repo.update(req.body, req.user?.uid as number, tran); 

        // 📌 출고 창고 수불 내역 생성
        let storeBody: IInvStore[] = [];
        inputResult.raws.forEach((input: any) => {
          // 📌 실적 기준일자(생산일자) 검색
          const regDate = workRead.raws.find((work: any) => work.work_id == input.work_id ).reg_date;
          storeBody = storeBody.concat(getStoreBody(input, 'FROM', 'work_input_id', getTranTypeCd('PRD_INPUT'), regDate));
        });
        const storeResult = await this.storeRepo.updateToTransaction(storeBody, req.user?.uid as number, tran);

        this.result.raws = [{ input: inputResult.raws, store: storeResult.raws }];
        this.result.count = inputResult.count + storeResult.count;
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
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      
      // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
      const uuids = req.body.map((data: any) => { return data.uuid });
      const workInputRead = await this.repo.readRawsByUuids(uuids);
      const workIds = workInputRead.raws.map((workInput: any) => { return workInput.work_id });
      const workRead = await this.workRepo.readRawByIds(workIds);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
      });

      await sequelize.transaction(async(tran) => { 
        // 📌 실적-자재투입 데이터 생성
        const inputResult = await this.repo.patch(req.body, req.user?.uid as number, tran); 

        // 📌 출고 창고 수불 내역 생성
        let storeBody: IInvStore[] = [];
        inputResult.raws.forEach((input: any) => {
          // 📌 실적 기준일자(생산일자) 검색
          const regDate = workRead.raws.find((work: any) => work.work_id == input.work_id ).reg_date;
          storeBody = storeBody.concat(getStoreBody(input, 'FROM', 'work_input_id', getTranTypeCd('PRD_INPUT'), regDate));
        });
        const storeResult = await this.storeRepo.updateToTransaction(storeBody, req.user?.uid as number, tran);

        this.result.raws = [{ input: inputResult.raws, store: storeResult.raws }];
        this.result.count = inputResult.count + storeResult.count;
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      
      // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
      const uuids = req.body.map((data: any) => { return data.uuid });
      const workInputRead = await this.repo.readRawsByUuids(uuids);
      const workIds = workInputRead.raws.map((workInput: any) => { return workInput.work_id });
      const workRead = await this.workRepo.readRawByIds(workIds);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
      });

      // 📌 수불이력을 삭제할 항목 추가
      const storeBody: IInvStore[] = [];
      workInputRead.raws.forEach((workInput: any) => { storeBody.push({ tran_id: workInput.work_input_id, inout_fg: false, tran_cd: getTranTypeCd('PRD_INPUT') }); });

      await sequelize.transaction(async(tran) => { 
        // 📌 창고 수불이력 삭제
        const storeResult = await this.storeRepo.deleteToTransaction(storeBody, req.user?.uid as number, tran);

        // 📌 실적-자재투입 데이터 삭제
        const inputResult = await this.repo.delete(req.body, req.user?.uid as number, tran); 

        this.result.raws = [{ input: inputResult.raws, store: storeResult.raws }];
        this.result.count = inputResult.count + storeResult.count;
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 200);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  // 📒 Fn[deleteByWork]: 실적 기준 투입데이터 전체 삭제
  public deleteByWork = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      
      // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
      const uuids = req.body.map((data: any) => { return data.work_uuid });
      const workRead = await this.workRepo.readRawsByUuids(uuids);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg == true) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
      });

      // 📌 수불이력을 삭제할 항목 추가
      const workIds: number[] = req.body.map((data: any) => { return data.work_id });
      const storeBody: IInvStore[] = [];
      for await (const workId of workIds) {
        const workInputs = await this.repo.readRawsByWorkId(workId);
        workInputs.raws.forEach((workInput: any) => { storeBody.push({ tran_id: workInput.work_input_id, inout_fg: false, tran_cd: getTranTypeCd('PRD_INPUT') }); });
      }
      
      await sequelize.transaction(async(tran) => { 
        // 📌 창고 수불이력 삭제
        const storeResult = await this.storeRepo.deleteToTransaction(storeBody, req.user?.uid as number, tran);

        // 📌 실적 ID 기준 자재투입 데이터 삭제
        const inputResult = await this.repo.deleteByWorkIds(workIds, req.user?.uid as number, tran); 

        this.result.raws = [{ input: inputResult.raws, store: storeResult.raws }];
        this.result.count = inputResult.count + storeResult.count;
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 200);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  //#endregion

  //#endregion

  //#region ✅ Inherited Hooks

  //#region 🔵 Read Hooks

  // 📒 Fn[beforeRead] (✅ Inheritance): Read DB Tasking 이 실행되기 전 호출되는 Function
  // beforeRead = async(req: express.Request) => {}

  // 📒 Fn[afterRead] (✅ Inheritance): Read DB Tasking 이 실행된 후 호출되는 Function
  // afterRead = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#endregion
}

export default PrdWorkInputCtl;