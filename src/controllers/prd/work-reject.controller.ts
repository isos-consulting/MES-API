import express = require('express');
import sequelize from '../../models';
import PrdWorkRejectRepo from '../../repositories/prd/work-reject.repository';
import PrdWorkRepo from '../../repositories/prd/work.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdProcRepo from '../../repositories/std/proc.repository';
import StdRejectRepo from '../../repositories/std/reject.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import BaseCtl from '../base.controller';

class PrdWorkRejectCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  repo: PrdWorkRejectRepo;
  workRepo: PrdWorkRepo;

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(new PrdWorkRejectRepo());
    this.workRepo = new PrdWorkRepo();

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
        key: 'proc',
        repo: new StdProcRepo(),
        idName: 'proc_id',
        uuidName: 'proc_uuid'
      },
      {
        key: 'reject',
        repo: new StdRejectRepo(),
        idName: 'reject_id',
        uuidName: 'reject_uuid'
      },
      {
        key: 'store',
        repo: new StdStoreRepo(),
        idAlias: 'to_store_id',
        idName: 'store_id',
        uuidName: 'to_store_uuid'
      },
      {
        key: 'location',
        repo: new StdLocationRepo(),
        idAlias: 'to_location_id',
        idName: 'location_id',
        uuidName: 'to_location_uuid'
      },
    ];
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);

      const uuids: string[] = [];
      const ids: number[] = [];
      req.body.forEach((data: any) => { 
        uuids.push(data.work_uuid);  
        ids.push(data.work_id);  
      });

      // ❗ 생산실적이 완료상태일 경우 데이터 생성 불가
      const workRead = await this.workRepo.readRawsByUuids(uuids);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg == true) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 생성이 불가능합니다.`)} 
      });

      await sequelize.transaction(async(tran) => { 
        // 📌 실적-부적합 데이터 생성
        const rejectResult = await this.repo.create(req.body, req.user?.uid as number, tran); 

        // 📌 실적별 부적합 수량만큼 실적 데이터 부적합 수량 수정
        const workBody: any[] = [];
        for await (const id of ids) {
          const rejectRead = await this.repo.readRawsByWorkId(id, tran);
          let qty: number = 0;

          rejectRead.raws.forEach((reject: any) => { qty += Number(reject.qty); });
          workBody.push({ work_id: id, reject_qty: qty });
        }
        const workResult = await this.workRepo.updateRejectQtyById(workBody, req.user?.uid as number, tran);

        this.result.raws = [{ reject: rejectResult.raws, work: workResult.raws }];
        this.result.count = rejectResult.count + workResult.count;
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

  // 📒 Fn[readReport]: 부적합현황 데이터 조회
  public readReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      const sort_type = params.sort_type as string;

      if (![ 'proc', 'prod', 'reject' ].includes(sort_type)) { throw new Error('잘못된 sort_type(정렬) 입력') }

      this.result = await this.repo.readReport(params);
      
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
      const workRejectRead = await this.repo.readRawsByUuids(uuids);
      const workIds = workRejectRead.raws.map((workReject: any) => { return workReject.work_id });
      const workRead = await this.workRepo.readRawByIds(workIds);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
      });

      await sequelize.transaction(async(tran) => { 
        // 📌 실적-부적합 데이터 수정
        const rejectResult = await this.repo.update(req.body, req.user?.uid as number, tran); 

        // 📌 실적별 부적합 수량만큼 실적 데이터 부적합 수량 수정
        const workBody: any[] = [];
        for await (const id of workIds) {
          const rejectRead = await this.repo.readRawsByWorkId(id, tran);
          let qty: number = 0;

          rejectRead.raws.forEach((reject: any) => { qty += reject.qty; });
          workBody.push({ work_id: id, reject_qty: qty });
        }
        const workResult = await this.workRepo.updateRejectQtyById(workBody, req.user?.uid as number, tran);

        this.result.raws = [{ reject: rejectResult.raws, work: workResult.raws }];
        this.result.count = rejectResult.count + workResult.count;
      });

      await this.afterUpdate(req, this.result);
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
      const workRejectRead = await this.repo.readRawsByUuids(uuids);
      const workIds = workRejectRead.raws.map((workReject: any) => { return workReject.work_id });
      const workRead = await this.workRepo.readRawByIds(workIds);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
      });

      await sequelize.transaction(async(tran) => { 
        // 📌 실적-부적합 데이터 수정
        const rejectResult = await this.repo.patch(req.body, req.user?.uid as number, tran); 

        // 📌 실적별 부적합 수량만큼 실적 데이터 부적합 수량 수정
        const workBody: any[] = [];
        for await (const id of workIds) {
          const rejectRead = await this.repo.readRawsByWorkId(id, tran);
          let qty: number = 0;

          rejectRead.raws.forEach((reject: any) => { qty += reject.qty; });
          workBody.push({ work_id: id, reject_qty: qty });
        }
        const workResult = await this.workRepo.updateRejectQtyById(workBody, req.user?.uid as number, tran);

        this.result.raws = [{ reject: rejectResult.raws, work: workResult.raws }];
        this.result.count = rejectResult.count + workResult.count;
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      
      // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
      const uuids = req.body.map((data: any) => { return data.uuid });
      const workRejectRead = await this.repo.readRawsByUuids(uuids);
      const workIds = workRejectRead.raws.map((workReject: any) => { return workReject.work_id });
      const workRead = await this.workRepo.readRawByIds(workIds);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
      });

      await sequelize.transaction(async(tran) => { 
        // 📌 실적-부적합 데이터 삭제
        const rejectResult = await this.repo.delete(req.body, req.user?.uid as number, tran); 

        // 📌 실적별 부적합 수량만큼 실적 데이터 부적합 수량 수정
        const workBody: any[] = [];
        for await (const id of workIds) {
          const rejectRead = await this.repo.readRawsByWorkId(id, tran);
          let qty: number = 0;

          rejectRead.raws.forEach((reject: any) => { qty += reject.qty; });
          workBody.push({ work_id: id, reject_qty: qty });
        }
        const workResult = await this.workRepo.updateRejectQtyById(workBody, req.user?.uid as number, tran);

        this.result.raws = [{ reject: rejectResult.raws, work: workResult.raws }];
        this.result.count = rejectResult.count + workResult.count;
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

  // 📒 Fn[beforeRead] (✅ Inheritance): Read DB Tasking 이 실행되기 전 호출되는 Function
  // beforeRead = async(req: express.Request) => {}

  // 📒 Fn[afterRead] (✅ Inheritance): Read DB Tasking 이 실행된 후 호출되는 Function
  // afterRead = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#endregion
}

export default PrdWorkRejectCtl;