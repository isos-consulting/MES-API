import express = require('express');
import sequelize from '../../models';
import PrdWorkDowntimeRepo from '../../repositories/prd/work-downtime.repository';
import PrdWorkRepo from '../../repositories/prd/work.repository';
import StdDowntimeRepo from '../../repositories/std/downtime.repository';
import StdEquipRepo from '../../repositories/std/equip.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdProcRepo from '../../repositories/std/proc.repository';
import checkArray from '../../utils/checkArray';
import getSubtractTwoDates from '../../utils/getSubtractTwoDates';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import BaseCtl from '../base.controller';

class PrdWorkDowntimeCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  repo: PrdWorkDowntimeRepo;
  workRepo: PrdWorkRepo;

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(new PrdWorkDowntimeRepo());
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
        key: 'equip',
        repo: new StdEquipRepo(),
        idName: 'equip_id',
        uuidName: 'equip_uuid'
      },
      {
        key: 'downtime',
        repo: new StdDowntimeRepo(),
        idName: 'downtime_id',
        uuidName: 'downtime_uuid'
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
      this.result = { raws: [], count: 0 };

      // 📌 생산실적이 완료상태일 경우 데이터 생성 불가
      const uuids = req.body.map((data: any) => { return data.work_uuid });
      const workRead = await this.workRepo.readRawsByUuids(uuids);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg == true) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 생성이 불가능합니다.`)} 
      });

      // 📌 시작, 종료시간이 같거나 시작시간이 더 늦을 경우 데이터 생성 불가
      req.body.forEach((data: any) => {
        if (data.start_date && data.end_date) {
          data.downtime = getSubtractTwoDates(data.start_date, data.end_date);
          if (data.downtime <= 0) { throw new Error('잘못된 시작시간(start_date) 및 종료시간(end_date)이 입력되었습니다.'); }
        }
      });

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 비가동 시간이 겹칠 수 없도록 Interlock
          if (data.equip_id && data.start_date && data.end_date) {
            const count = await this.repo.getCountDuplicatedTime(data.start_date, data.end_date, data.equip_id, tran);
            if (count > 0) { throw new Error('시간내에 이미 등록된 비가동 내역이 있습니다.'); }
          }

          const result = await this.repo.create(checkArray(data), req.user?.uid as number, tran); 
          this.result.raws = this.result.raws.concat(result.raws);
          this.result.count += result.count;
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

  // 📒 Fn[readReport]: 실적현황 데이터 조회
  public readReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);

      const sort_type = params.sort_type as string;
      if (![ 'proc', 'equip', 'downtime' ].includes(sort_type)) { throw new Error('잘못된 sort_type(정렬) 입력') }

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
      this.result = { raws: [], count: 0 };

      // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
      const uuids = req.body.map((data: any) => { return data.uuid });
      const workDowntimeRead = await this.repo.readRawsByUuids(uuids);
      const workIds = workDowntimeRead.raws.map((workDowntime: any) => { return workDowntime.work_id });
      const workRead = await this.workRepo.readRawByIds(workIds);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
      });

      // 📌 시작, 종료시간이 같거나 시작시간이 더 늦을 경우 데이터 수정 불가
      req.body.forEach((data: any) => {
        if (data.start_date && data.end_date) {
          data.downtime = getSubtractTwoDates(data.start_date, data.end_date);
          if (data.downtime <= 0) { throw new Error('잘못된 시작시간(start_date) 및 종료시간(end_date)이 입력되었습니다.'); }
        }
      });

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 비가동 시간이 겹칠 수 없도록 Interlock
          if (data.equip_id && data.start_date && data.end_date) {
            const count = await this.repo.getCountDuplicatedTime(data.start_date, data.end_date, data.equip_id, tran);
            if (count > 0) { throw new Error('시간내에 이미 등록된 비가동 내역이 있습니다.'); }
          }

          const result = await this.repo.update(checkArray(data), req.user?.uid as number, tran); 
          this.result.raws = this.result.raws.concat(result.raws);
          this.result.count += result.count;
        }
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
      this.result = { raws: [], count: 0 };

      // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
      const uuids = req.body.map((data: any) => { return data.uuid });
      const workDowntimeRead = await this.repo.readRawsByUuids(uuids);
      const workIds = workDowntimeRead.raws.map((workDowntime: any) => { return workDowntime.work_id });
      const workRead = await this.workRepo.readRawByIds(workIds);
      workRead.raws.forEach((work: any) => { 
        if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
      });

      // 📌 시작, 종료시간이 같거나 시작시간이 더 늦을 경우 데이터 수정 불가
      req.body.forEach((data: any) => {
        if (data.start_date && data.end_date) {
          data.downtime = getSubtractTwoDates(data.start_date, data.end_date);
          if (data.downtime <= 0) { throw new Error('잘못된 시작시간(start_date) 및 종료시간(end_date)이 입력되었습니다.'); }
        }
      });

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 비가동 시간이 겹칠 수 없도록 Interlock
          if (data.equip_id && data.start_date && data.end_date) {
            const count = await this.repo.getCountDuplicatedTime(data.start_date, data.end_date, data.equip_id, tran);
            if (count > 0) { throw new Error('시간내에 이미 등록된 비가동 내역이 있습니다.'); }
          }

          const result = await this.repo.patch(checkArray(data), req.user?.uid as number, tran); 
          this.result.raws = this.result.raws.concat(result.raws);
          this.result.count += result.count;
        }
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  // public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  //#endregion

  //#endregion

  //#region ✅ Inherited Hooks

  //#region 🔵 Read Hooks

  // 📒 Fn[beforeRead] (✅ Inheritance): Read DB Tasking 이 실행되기 전 호출되는 Function
  // beforeRead = async(req: express.Request) => {}

  // 📒 Fn[afterRead] (✅ Inheritance): Read DB Tasking 이 실행된 후 호출되는 Function
  // afterRead = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🔴 Delete Hooks

  // 📒 Fn[beforeDelete] (✅ Inheritance): Delete Transaction 이 실행되기 전 호출되는 Function
  beforeDelete = async(req: express.Request) => {
    // 📌 생산실적이 완료상태일 경우 데이터 삭제 불가
    const uuids = req.body.map((data: any) => { return data.uuid });
    const workDowntimeRead = await this.repo.readRawsByUuids(uuids);
    const workIds = workDowntimeRead.raws.map((workDowntime: any) => { return workDowntime.work_id });
    const workRead = await this.workRepo.readRawByIds(workIds);
    workRead.raws.forEach((work: any) => { 
      if (work.complete_fg) { throw new Error(`실적번호 [${work.uuid}]는 완료상태이므로 데이터 삭제가 불가능합니다.`)} 
    });
  }

  // 📒 Fn[beforeTranDelete] (✅ Inheritance): Delete Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranDelete = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranDelete] (✅ Inheritance): Delete Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranDelete = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterDelete] (✅ Inheritance): Delete Transaction 이 실행된 후 호출되는 Function
  // afterDelete = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#endregion
}

export default PrdWorkDowntimeCtl;