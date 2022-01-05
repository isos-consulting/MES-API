import express = require('express');
import ApiResult from '../../interfaces/common/api-result.interface';
import IInvStore from '../../interfaces/inv/store.interface';
import IPrdWorkRouting from '../../interfaces/prd/work-routing.interface';
import InvStoreRepo from '../../repositories/inv/store.repository';
import PrdOrderInputRepo from '../../repositories/prd/order-input.repository';
import PrdOrderRoutingRepo from '../../repositories/prd/order-routing.repository';
import PrdOrderWorkerRepo from '../../repositories/prd/order-worker.repository';
import PrdOrderRepo from '../../repositories/prd/order.repository';
import PrdWorkDowntimeRepo from '../../repositories/prd/work-downtime.repository';
import PrdWorkInputRepo from '../../repositories/prd/work-input.repository';
import PrdWorkRejectRepo from '../../repositories/prd/work-reject.repository';
import PrdWorkRoutingRepo from '../../repositories/prd/work-routing.repository';
import PrdWorkWorkerRepo from '../../repositories/prd/work-worker.repository';
import PrdWorkRepo from '../../repositories/prd/work.repository';
import QmsInspResultDetailInfoRepo from '../../repositories/qms/insp-result-detail-info.repository';
import QmsInspResultDetailValueRepo from '../../repositories/qms/insp-result-detail-value.repository';
import QmsInspResultRepo from '../../repositories/qms/insp-result.repository';
import StdEquipRepo from '../../repositories/std/equip.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdProcRepo from '../../repositories/std/proc.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdShiftRepo from '../../repositories/std/shift.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import StdWorkingsRepo from '../../repositories/std/workings.repository';
import checkArray from '../../utils/checkArray';
import { getSequelize } from '../../utils/getSequelize';
import getStoreBody from '../../utils/getStoreBody';
import getSubtractTwoDates from '../../utils/getSubtractTwoDates';
import getTranTypeCd from '../../utils/getTranTypeCd';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import unsealArray from '../../utils/unsealArray';
import BaseCtl from '../base.controller';
import config from '../../configs/config';
import MldMoldRepo from '../../repositories/mld/mold.repository';

class PrdWorkCtl extends BaseCtl {
  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(PrdWorkRepo);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'uuid',
        TRepo: PrdWorkRepo,
        idName: 'work_id',
        uuidName: 'uuid'
      },
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'order',
        TRepo: PrdOrderRepo,
        idName: 'order_id',
        uuidName: 'order_uuid'
      },
      {
        key: 'proc',
        TRepo: StdProcRepo,
        idName: 'proc_id',
        uuidName: 'proc_uuid'
      },
      {
        key: 'workings',
        TRepo: StdWorkingsRepo,
        idName: 'workings_id',
        uuidName: 'workings_uuid'
      },
      {
        key: 'equip',
        TRepo: StdEquipRepo,
        idName: 'equip_id',
        uuidName: 'equip_uuid'
      },
      {
        key: 'mold',
        TRepo: MldMoldRepo,
        idName: 'mold_id',
        uuidName: 'mold_uuid'
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'shift',
        TRepo: StdShiftRepo,
        idName: 'shift_id',
        uuidName: 'shift_uuid'
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
      }
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
      const repo = new PrdWorkRepo(req.tenant.uuid);
      const workerRepo = new PrdWorkWorkerRepo(req.tenant.uuid);
      const routingRepo = new PrdWorkRoutingRepo(req.tenant.uuid);
      const orderRepo = new PrdOrderRepo(req.tenant.uuid);
      const orderWorkerRepo = new PrdOrderWorkerRepo(req.tenant.uuid);
      const orderRoutingRepo = new PrdOrderRoutingRepo(req.tenant.uuid);
      const moldRepo = new MldMoldRepo(req.tenant.uuid);
      let result: ApiResult<any> = { raws: [], count: 0 };

      // ❗ 작업지시가 마감되어 있는 경우 Interlock
      const orderUuids = req.body.map((data: any) => { return data.order_uuid; });
      const orderRead = await orderRepo.readRawsByUuids(orderUuids);
      orderRead.raws.forEach((order: any) => {
        if (order.complete_fg) { throw new Error(`지시번호 [${order.order_uuid}]가 이미 완료상태입니다.`); }
      });

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          // 📌 작업지시에 등록되어있는 금형정보 초기 값 입력
          const order = await orderRepo.readByUuid(data.order_uuid);
          const moldUuid = order.raws[0].mold_uuid;
          if (moldUuid) {
            const mold = await moldRepo.readRawByUuid(moldUuid);
            data.mold_id = mold.raws[0].mold_id;
            data.mold_cavity = mold.raws[0].cavity;
          }

          // 📌 작업지시 단위 최대 순번 조회
          const maxSeq = await repo.getMaxSeq(data.order_id, tran);
          data.seq = maxSeq + 1;

          // 📌 생산실적 데이터 생성
          const workResult = await repo.create(checkArray(data), req.user?.uid as number, tran);
          result.count += workResult.count;
          const work = unsealArray(workResult.raws);

          // 📌 작업지시 테이블 work_fg(생산진행여부) True로 변경
          const orderResult = await orderRepo.updateWorkFgById(work.order_id, true, req.user?.uid as number, tran);

          // 📌 작업지시의 작업자 투입정보 기준 초기 데이터 생성
          const orderWorkerRead = await orderWorkerRepo.readRawsByOrderId(work.order_id, tran);
          const workerBody = orderWorkerRead.raws.map((orderWorker: any) => {
            return {
              factory_id: orderWorker.factory_id,
              work_id: work.work_id,
              worker_id: orderWorker.worker_id
            };
          });
          const workerResult = await workerRepo.create(workerBody, req.user?.uid as number, tran);
          result.count += workerResult.count;

          // 📌 작업지시의 공정순서 정보 기준 초기 데이터 생성
          const orderRoutingRead = await orderRoutingRepo.readRawsByOrderId(work.order_id, tran);
          const routingBody = orderRoutingRead.raws.map((orderRouting: any) => {
            return {
              factory_id: orderRouting.factory_id,
              work_id: work.work_id,
              proc_id: orderRouting.proc_id,
              proc_no: orderRouting.proc_no,
              workings_id: orderRouting.workings_id,
              equip_id: orderRouting.equip_id
            };
          });
          const routingResult = await routingRepo.create(routingBody, req.user?.uid as number, tran);
          result.count += routingResult.count;

          result.raws.push({
            work: work,
            order: orderResult.raws,
            worker: workerResult.raws,
            routing: routingResult.raws
          });
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

  // 📒 Fn[readReport]: 실적현황 데이터 조회
  public readReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new PrdWorkRepo(req.tenant.uuid);

      const params = Object.assign(req.query, req.params);
      const sort_type = params.sort_type as string;

      if (![ 'proc', 'prod', 'date' ].includes(sort_type)) { throw new Error('잘못된 sort_type(정렬) 입력') }

      const result = await repo.readReport(params);
      
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
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdWorkRepo(req.tenant.uuid);
      const routingRepo = new PrdWorkRoutingRepo(req.tenant.uuid);
      let result: ApiResult<any> = { raws: [], count: 0 };

      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);
      await this.beforeUpdate(req);

      result = { raws: [], count: 0 };
      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          const workResult = await repo.update([data], req.user?.uid as number, tran); 

          //📌 해당 작업의 라우팅 정보 가져오기
          const routingParams = { factory_uuid : data.factory_uuid, work_uuid : data.uuid }
          const workRouting = await routingRepo.read(routingParams);
          
          //📌 라우팅 정보 중 마지막 공정의 uuid 가져오기
          let maxProcNo = 0;
          let workRoutingUuid;
          workRouting.raws.forEach(routing => {
            if (maxProcNo < routing.proc_no) {
              maxProcNo = routing.proc_no;
              workRoutingUuid = routing.work_routing_uuid;
            } 
          });

          //📌 가져온 routing_uuid 기준으로 prd_work_routing update params 셋팅
          const workRoutingBody: IPrdWorkRouting = {
            uuid : workRoutingUuid,
            qty :  data.qty,
            start_date : data.start_date,
            end_date : data.end_date
          };

          //📌 prd_work_routing 업데이트
          const workRoutingResult = await routingRepo.update([workRoutingBody], req.user?.uid as number, tran);
          
          result.raws.push({
            work: workResult.raws,
            work_routing: workRoutingResult.raws,
          });
        }
        
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  // 📒 Fn[updateComplete]: 생산실적 완료처리
  public updateComplete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = checkArray(req.body);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdWorkRepo(req.tenant.uuid);
      const inputRepo = new PrdWorkInputRepo(req.tenant.uuid);
      const rejectRepo = new PrdWorkRejectRepo(req.tenant.uuid);
      const orderRepo = new PrdOrderRepo(req.tenant.uuid);
      const orderInputRepo = new PrdOrderInputRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { raws: [], count: 0 };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          const workRead = await repo.readRawByUuid(data.uuid);
          const work = unsealArray(workRead.raws);

          // ❗ 생산 수량과 투입 수량이 일치하지 않을 경우 Interlock
          let verifyInput: any = {};
          const orderInputRead = await orderInputRepo.readRawsByOrderId(work.order_id, tran);
          orderInputRead.raws.forEach((orderInput: any) => {
            verifyInput[orderInput.prod_id] = { usage: orderInput.c_usage, qty: 0 }
          });

          const inputRead = await inputRepo.readRawsByWorkId(work.work_id, tran);
          inputRead.raws.forEach((input: any) => {
            if (!verifyInput[input.prod_id]) { throw new Error(`작업지시대비 투입품목이 일치하지 않습니다.`); }

            verifyInput[input.prod_id].usage = input.c_usage;
            verifyInput[input.prod_id].qty = Number(input.qty);
          });

          const totalProducedQty = Number(work.qty) + Number(work.reject_qty);
          Object.keys(verifyInput).forEach((prodId: string) => {
            const totalConsumedQty = verifyInput[prodId].usage * verifyInput[prodId].qty;
            if (totalProducedQty != totalConsumedQty) { throw new Error(`투입품목의 투입수량이 일치하지 않습니다.`); }
          });

          // 📌 생산실적 완료 처리
          // 📌 완료일시를 입력하지 않았을 경우 현재일시로 입력
          if (!data.end_date) { data.end_date = new Date(); }
          const workTime = getSubtractTwoDates(data.start_date, data.end_date);
          if (workTime <= 0) { throw new Error('잘못된 시작시간(start_date) 및 종료시간(end_date)이 입력되었습니다.'); }
          const workResult = await repo.updateComplete([{ uuid: data.uuid, work_time: workTime, complete_fg: true, end_date: data.end_date }], req.user?.uid as number, tran);

          // 📌 해당 실적의 작업지시에 진행중인 생산 실적이 없을 경우 작업지시의 생산진행여부(work_fg)를 False로 변경
          const incompleteWorkCount = await repo.getIncompleteCount(work.order_id, tran);
          let orderResult: ApiResult<any> = { raws: [], count: 0 };
          if (incompleteWorkCount == 0) { orderResult = await orderRepo.updateWorkFgById(work.order_id, false, req.user?.uid as number, tran); }

          // 📌 입고 창고 수불 내역 생성
          const toStoreBody: IInvStore[] = getStoreBody(workResult.raws, 'TO', 'work_id', getTranTypeCd('PRD_OUTPUT'), work.reg_date);

          // 📌 부적합 수량에 의한 창고 수불 내역 생성
          const rejectRead = await rejectRepo.readRawsByWorkId(work.work_id, tran);
          const rejectStoreBody: IInvStore[] = getStoreBody(rejectRead.raws, 'TO', 'work_reject_id', getTranTypeCd('PRD_REJECT'), work.reg_date);

          // 📌 창고 수불
          const storeBody = [...toStoreBody, ...rejectStoreBody];
          const storeResult = await storeRepo.create(storeBody, req.user?.uid as number, tran);

          result.raws.push({
            work: workResult.raws,
            order: orderResult.raws,
            store: storeResult.raws,
          });
        }
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  // 📒 Fn[updateCancelComplete]: 완료된 생산실적 취소처리
  public updateCancelComplete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = checkArray(req.body);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdWorkRepo(req.tenant.uuid);
      const rejectRepo = new PrdWorkRejectRepo(req.tenant.uuid);
      const orderRepo = new PrdOrderRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { raws: [], count: 0 };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          const workRead = await repo.readRawByUuid(data.uuid);
          const work = unsealArray(workRead.raws);

          // ❗ 작업지시가 마감되어 있는 경우 Interlock
          const orderRead = await orderRepo.readRawByPk(work.order_id);
          const order = unsealArray(orderRead.raws);
          if (order.complete_fg) { throw new Error(`지시번호 [${order.uuid}]가 완료되어 데이터를 수정할 수 없습니다.`); }

          // 📌 생산실적 완료 취소 처리
          const workResult = await repo.updateComplete([{ uuid: work.uuid, work_time: null, complete_fg: false, end_date: null }], req.user?.uid as number, tran);

          // 📌 해당 실적의 작업지시의 생산진행여부(work_fg)를 True로 변경
          const orderResult = await orderRepo.updateWorkFgById(work.order_id, true, req.user?.uid as number, tran);

          // 📌 창고 수불이력 삭제
          const storeBody = [{ tran_id: work.work_id, inout_fg: true, tran_cd: getTranTypeCd('PRD_OUTPUT') }];
          for await (const work of workResult.raws) {
            const workRejects = await rejectRepo.readRawsByWorkId(work.work_id);
            workRejects.raws.forEach((workReject: any) => { storeBody.push({ tran_id: workReject.work_reject_id, inout_fg: true, tran_cd: getTranTypeCd('PRD_REJECT') }); });
          }
          const storeResult = await storeRepo.deleteToTransaction(storeBody, req.user?.uid as number, tran);

          result.raws.push({
            work: workResult.raws,
            order: orderResult.raws,
            store: storeResult.raws,
          });
        }
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch] (✅ Inheritance): Default Patch Function
  // public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = checkArray(req.body);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new PrdWorkRepo(req.tenant.uuid);
      const inputRepo = new PrdWorkInputRepo(req.tenant.uuid);
      const workerRepo = new PrdWorkWorkerRepo(req.tenant.uuid);
      const rejectRepo = new PrdWorkRejectRepo(req.tenant.uuid);
      const downtimeRepo = new PrdWorkDowntimeRepo(req.tenant.uuid);
      const routingRepo = new PrdWorkRoutingRepo(req.tenant.uuid);
      const orderRepo = new PrdOrderRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      const inspResultRepo = new QmsInspResultRepo(req.tenant.uuid);
      const inspResultDetailInfoRepo = new QmsInspResultDetailInfoRepo(req.tenant.uuid);
      const inspResultDetailValueRepo = new QmsInspResultDetailValueRepo(req.tenant.uuid);
      let result: ApiResult<any> = { raws: [], count: 0 };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          const workRead = await repo.readRawByUuid(data.uuid);
          const work = unsealArray(workRead.raws);

          // ❗ 작업지시가 마감되어 있는 경우 Interlock
          const orderRead = await orderRepo.readRawByPk(work.order_id);
          const order = unsealArray(orderRead.raws);
          if (order.complete_fg) { throw new Error(`지시번호 [${order.uuid}]가 완료되어 데이터를 삭제할 수 없습니다.`); }

          // 📌 창고 수불이력 삭제
          const storeBody = [{ tran_id: work.work_id, inout_fg: true, tran_cd: getTranTypeCd('PRD_OUTPUT') }];
          const workRejects = await rejectRepo.readRawsByWorkId(work.work_id);
          workRejects.raws.forEach((workReject: any) => { storeBody.push({ tran_id: workReject.work_reject_id, inout_fg: true, tran_cd: getTranTypeCd('PRD_REJECT') }); });
          const workInputs = await inputRepo.readRawsByWorkId(work.work_id);
          workInputs.raws.forEach((workInput: any) => { storeBody.push({ tran_id: workInput.work_input_id, inout_fg: false, tran_cd: getTranTypeCd('PRD_INPUT') }); });
          const storeResult = await storeRepo.deleteToTransaction(storeBody, req.user?.uid as number, tran);

          // 📌 생산실적 관련 테이블 삭제
          const inputResult = await inputRepo.deleteByWorkId(work.work_id, req.user?.uid as number, tran);
          const workerResult = await workerRepo.deleteByWorkId(work.work_id, req.user?.uid as number, tran);
          const routingResult = await routingRepo.deleteByWorkId(work.work_id, req.user?.uid as number, tran);
          const rejectResult = await rejectRepo.deleteByWorkId(work.work_id, req.user?.uid as number, tran);
          const downtimeResult = await downtimeRepo.deleteByWorkId(work.work_id, req.user?.uid as number, tran);

          // 📌 공정검사 이력 삭제
          let inspHeaderResult: ApiResult<any> = { raws: [], count: 0 };
          let detailInfosResult: ApiResult<any> = { raws: [], count: 0 };
          let detailValuesResult: ApiResult<any> = { raws: [], count: 0 };

          const inspResultRead = await inspResultRepo.readProcByWorkId(work.work_id);
          for await (const inspResult of inspResultRead.raws) {
            // 📌 검사 성적서 상세 값을 삭제하기 위하여 검사 성적서 상세정보 Id 조회
            const detailInfos = await inspResultDetailInfoRepo.readByResultId(inspResult.insp_result_id);
            const detailInfoIds = detailInfos.raws.map((raw: any) => { return raw.insp_result_detail_info_id });

            // ✅ 검사성적서상세값 삭제
            const tempDetailValuesResult = await inspResultDetailValueRepo.deleteByInfoIds(detailInfoIds, req.user?.uid as number, tran);
            detailValuesResult.raws = [ ...detailValuesResult.raws, ...tempDetailValuesResult.raws ];
            detailValuesResult.count += tempDetailValuesResult.count;

            // ✅ 검사성적서상세정보 삭제
            const tempDetailInfosResult = await inspResultDetailInfoRepo.deleteByResultIds([inspResult.insp_result_id], req.user?.uid as number, tran);
            detailInfosResult.raws = [ ...detailInfosResult.raws, ...tempDetailInfosResult.raws ];
            detailInfosResult.count += tempDetailInfosResult.count;

            // ✅ 검사성적서 삭제
            const tempHeaderResult = await inspResultRepo.delete([inspResult], req.user?.uid as number, tran);
            inspHeaderResult.raws = [ ...inspHeaderResult.raws, ...tempHeaderResult.raws ];
            inspHeaderResult.count += tempHeaderResult.count;
          }

          // 📌 생산실적 이력 삭제
          const workResult = await repo.delete([{ uuid: work.uuid }], req.user?.uid as number, tran);

          result.raws.push({
            work: workResult.raws,
            input: inputResult.raws,
            worker: workerResult.raws,
            routing: routingResult.raws,
            reject: rejectResult.raws,
            downtime: downtimeResult.raws,
            store: storeResult.raws,
            inspResult: inspHeaderResult.raws,
            inspResultDetailInfo: detailInfosResult.raws,
            inspResultDetailValue: detailValuesResult.raws,
          });

          result.count += workResult.count + inputResult.count + workerResult.count + routingResult.count + rejectResult.count + downtimeResult.count;
          result.count += storeResult.count + inspHeaderResult.count + detailInfosResult.count + detailValuesResult.count;
        }
      });

      return response(res, result.raws, { count: result.count }, '', 200);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
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

  //#region 🟡 Update Hooks

  // 📒 Fn[beforeUpdate] (✅ Inheritance): Update Transaction 이 실행되기 전 호출되는 Function
  beforeUpdate = async(req: express.Request) => {
    const repo = new PrdWorkRepo(req.tenant.uuid);

    // 📌 완료되어있는 실적이 있을경우 데이터 수정 불가
    const uuids = req.body.map((data: any) => { return data.uuid });
    const workRead = await repo.readRawsByUuids(uuids);
    workRead.raws.forEach((work: any) => {
      if (work.work_fg) { throw new Error(`실적번호 [${work.uuid}]가 완료되어 데이터를 수정할 수 없습니다.`); }
    });
  }

  // 📒 Fn[beforeTranUpdate] (✅ Inheritance): Update Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranUpdate = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranUpdate] (✅ Inheritance): Update Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranUpdate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterUpdate] (✅ Inheritance): Update Transaction 이 실행된 후 호출되는 Function
  // afterUpdate = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🟠 Patch Hooks

  // 📒 Fn[beforePatch] (✅ Inheritance): Patch Transaction 이 실행되기 전 호출되는 Function
  beforePatch = async(req: express.Request) => {
    const repo = new PrdWorkRepo(req.tenant.uuid);

    // 📌 완료되어있는 실적이 있을경우 데이터 수정 불가
    const uuids = req.body.map((data: any) => { return data.uuid });
    const workRead = await repo.readRawsByUuids(uuids);
    workRead.raws.forEach((work: any) => {
      if (work.work_fg) { throw new Error(`실적번호 [${work.uuid}]가 완료되어 데이터를 수정할 수 없습니다.`); }
    });
  }

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
}

export default PrdWorkCtl;