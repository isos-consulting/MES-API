import express = require('express');
import ApiResult from '../../interfaces/common/api-result.interface';
import PrdWorkRejectRepo from '../../repositories/prd/work-reject.repository';
import PrdWorkRoutingRepo from '../../repositories/prd/work-routing.repository';
import PrdWorkRepo from '../../repositories/prd/work.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdRejectRepo from '../../repositories/std/reject.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import { getSequelize } from '../../utils/getSequelize';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import BaseCtl from '../base.controller';
import config from '../../configs/config';

class PrdWorkRejectCtl extends BaseCtl {
  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(PrdWorkRejectRepo);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'work',
        TRepo: PrdWorkRepo,
        idName: 'work_id',
        uuidName: 'work_uuid'
      },
      {
        key: 'workRouting',
        TRepo: PrdWorkRoutingRepo,
        idName: 'work_routing_id',
        uuidName: 'work_routing_uuid'
      },
      {
        key: 'reject',
        TRepo: StdRejectRepo,
        idName: 'reject_id',
        uuidName: 'reject_uuid'
      },
      {
        key: 'store',
        TRepo: StdStoreRepo,
        idAlias: 'to_store_id',
        idName: 'store_id',
        uuidName: 'to_store_uuid'
      },
      {
        key: 'location',
        TRepo: StdLocationRepo,
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
      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdWorkRejectRepo(req.tenant.uuid);
      const workRepo = new PrdWorkRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      const uuids: string[] = [];
      const ids: number[] = [];
      req.body.forEach((data: any) => { 
        uuids.push(data.work_uuid);  
        ids.push(data.work_id);  
      });

      // ❗ 생산실적이 완료상태일 경우 데이터 생성 불가
      const workRead = await workRepo.readRawsByUuids(uuids);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg == true) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 생성이 불가능합니다.`)} 
      });

      await sequelize.transaction(async(tran) => { 
        // 📌 실적-부적합 데이터 생성
        const rejectResult = await repo.create(req.body, req.user?.uid as number, tran); 

        // 📌 실적별 부적합 수량만큼 실적 데이터 부적합 수량 수정
        const workBody: any[] = [];
        for await (const id of ids) {
          const rejectRead = await repo.readRawsByWorkId(id, tran);
          let qty: number = 0;

          rejectRead.raws.forEach((reject: any) => { qty += Number(reject.qty); });
          workBody.push({ work_id: id, reject_qty: qty });
        }
        const workResult = await workRepo.updateRejectQtyById(workBody, req.user?.uid as number, tran);

        result.raws = [{ reject: rejectResult.raws, work: workResult.raws }];
        result.count = rejectResult.count + workResult.count;
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

  // 📒 Fn[readReport]: 부적합현황 데이터 조회
  public readReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new PrdWorkRejectRepo(req.tenant.uuid);

      const params = Object.assign(req.query, req.params);
      const sort_type = params.sort_type as string;

      if (![ 'proc', 'prod', 'reject' ].includes(sort_type)) { throw new Error('잘못된 sort_type(정렬) 입력') }

      const result = await repo.readReport(params);
      
      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readByWork]: 생산실적 기준 공정별 부적합 List 및 현재 등록되어있는 부적합 조회
  public readByWork = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new PrdWorkRejectRepo(req.tenant.uuid);
      const params = Object.assign(req.query, req.params);

      const result = await repo.readByWork(params);
      
      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🟡 Update Functions

  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdWorkRejectRepo(req.tenant.uuid);
      const workRepo = new PrdWorkRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };
      
      // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
      const uuids = req.body.map((data: any) => { return data.uuid });
      const workRejectRead = await repo.readRawsByUuids(uuids);
      const workIds = workRejectRead.raws.map((workReject: any) => { return workReject.work_id });
      const workRead = await workRepo.readRawByIds(workIds);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
      });

      await sequelize.transaction(async(tran) => { 
        // 📌 실적-부적합 데이터 수정
        const rejectResult = await repo.update(req.body, req.user?.uid as number, tran); 

        // 📌 실적별 부적합 수량만큼 실적 데이터 부적합 수량 수정
        const workBody: any[] = [];
        for await (const id of workIds) {
          const rejectRead = await repo.readRawsByWorkId(id, tran);
          let qty: number = 0;

          rejectRead.raws.forEach((reject: any) => { qty += Number(reject.qty); });
          workBody.push({ work_id: id, reject_qty: qty });
        }
        const workResult = await workRepo.updateRejectQtyById(workBody, req.user?.uid as number, tran);

        result.raws = [{ reject: rejectResult.raws, work: workResult.raws }];
        result.count = rejectResult.count + workResult.count;
      });

      await this.afterUpdate(req, result);
      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch] (✅ Inheritance): Default Patch Function
  public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdWorkRejectRepo(req.tenant.uuid);
      const workRepo = new PrdWorkRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };
      
      // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
      const uuids = req.body.map((data: any) => { return data.uuid });
      const workRejectRead = await repo.readRawsByUuids(uuids);
      const workIds = workRejectRead.raws.map((workReject: any) => { return workReject.work_id });
      const workRead = await workRepo.readRawByIds(workIds);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
      });

      await sequelize.transaction(async(tran) => { 
        // 📌 실적-부적합 데이터 수정
        const rejectResult = await repo.patch(req.body, req.user?.uid as number, tran); 

        // 📌 실적별 부적합 수량만큼 실적 데이터 부적합 수량 수정
        const workBody: any[] = [];
        for await (const id of workIds) {
          const rejectRead = await repo.readRawsByWorkId(id, tran);
          let qty: number = 0;

          rejectRead.raws.forEach((reject: any) => { qty += Number(reject.qty); });
          workBody.push({ work_id: id, reject_qty: qty });
        }
        const workResult = await workRepo.updateRejectQtyById(workBody, req.user?.uid as number, tran);

        result.raws = [{ reject: rejectResult.raws, work: workResult.raws }];
        result.count = rejectResult.count + workResult.count;
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdWorkRejectRepo(req.tenant.uuid);
      const workRepo = new PrdWorkRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };
      
      // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
      const uuids = req.body.map((data: any) => { return data.uuid });
      const workRejectRead = await repo.readRawsByUuids(uuids);
      const workIds = workRejectRead.raws.map((workReject: any) => { return workReject.work_id });
      const workRead = await workRepo.readRawByIds(workIds);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
      });

      await sequelize.transaction(async(tran) => { 
        // 📌 실적-부적합 데이터 삭제
        const rejectResult = await repo.delete(req.body, req.user?.uid as number, tran); 

        // 📌 실적별 부적합 수량만큼 실적 데이터 부적합 수량 수정
        const workBody: any[] = [];
        for await (const id of workIds) {
          const rejectRead = await repo.readRawsByWorkId(id, tran);
          let qty: number = 0;

          rejectRead.raws.forEach((reject: any) => { qty += Number(reject.qty); });
          workBody.push({ work_id: id, reject_qty: qty });
        }
        const workResult = await workRepo.updateRejectQtyById(workBody, req.user?.uid as number, tran);

        result.raws = [{ reject: rejectResult.raws, work: workResult.raws }];
        result.count = rejectResult.count + workResult.count;
      });

      return response(res, result.raws, { count: result.count }, '', 200);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
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