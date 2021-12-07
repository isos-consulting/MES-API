import express = require('express');
import InvStoreRepo from '../../repositories/inv/store.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdRejectRepo from '../../repositories/std/reject.repository';
import StdPartnerRepo from '../../repositories/std/partner.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import getTranTypeCd from '../../utils/getTranTypeCd';
import getTranTypeCdByApiParams from '../../utils/getTranTypeCdByApiParams';
import isDateFormat from '../../utils/isDateFormat';
import isUuid from '../../utils/isUuid';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import BaseCtl from '../base.controller';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';
import config from '../../configs/config';

class InvStoreCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  TRepo: InvStoreRepo;

  // ✅ 조회조건 Types
  tranTypes: string[];
  groupedTypes: string[];
  stockTypes: string[];
  priceTypes: string[];

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(InvStoreRepo);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'location',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        uuidName: 'location_uuid'
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'store',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        uuidName: 'store_uuid'
      },
      {
        key: 'reject',
        TRepo: StdRejectRepo,
        idName: 'reject_id',
        uuidName: 'reject_uuid'
      },
			{
        key: 'partner',
        TRepo: StdPartnerRepo,
        idName: 'partner_id',
        uuidName: 'partner_uuid'
      },
    ];

    // ✅ 조회조건 Types Setting
    this.tranTypes = [
      'all', 
      'matIncome', 'matReturn', 'matRelease',
      'prdReturn', 'prdOutput', 'prdInput', 'prdReject',
      'salIncome', 'salRelease', 'salOutgo', 'salReturn',
      'outIncome', 'outRelease',
      'inventory', 'invMove', 'invReject',
      'qmsReceiveInspReject', 'qmsFinalInspIncome', 'qmsFinalInspReject',
      'qmsRework', 'qmsDisposal', 'qmsReturn', 'qmsDisassemble', 'qmsDisassembleIncome', 'qmsDisassembleReturn',
      'etcIncome', 'etcRelease'
    ];
    this.stockTypes = [ 'all', 'available', 'reject', 'return', 'outgo', 'finalInsp' ];
    this.groupedTypes = [ 'all', 'factory', 'store', 'lotNo', 'location' ];   
    this.priceTypes = [ 'all', 'purchase', 'sales' ];
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => {
        // 📌 재고실사 관련 Max 전표번호 생성
        let maxTranId = await repo.getMaxTranId(getTranTypeCd('INVENTORY'), tran);

        for await (const data of req.body) {
          data.tran_id = ++maxTranId;
          data.tran_cd = getTranTypeCd('INVENTORY');

          const params = {
            factory_uuid: data.factory_uuid,
            prod_uuid: data.prod_uuid,
            lot_no: data.lot_no,
            store_uuid: data.store_uuid,
            location_uuid: data.location_uuid,
            reject_uuid: data.reject_uuid,
						partner_uuid: data.partner_uuid,
            reg_date: data.reg_date,
            stock_type: 'all',
            grouped_type: 'all',
            price_type: 'all',
          };

          const [ currentStock ] = (await repo.readStockAccordingToType(params)).raws;
          let currentQty = currentStock?.qty ?? 0;

          // 📌 기존 수량보다 실사 수량이 크면 입고 작으면 출고
          if (data.qty > currentQty) { data.inout_fg = true; }
          else { data.inout_fg = false; }
          data.qty = Math.abs(data.qty - currentQty);
          console.log('data.qty', data.qty)

          if (data.qty == 0) { throw new Error('입력 재고의 실사수량이 0입니다.'); }
        }

        // 📌 재고 실사 내역 생성
        result = await repo.create(req.body, req.user?.uid as number, tran);
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

  // 📒 Fn[readStock]: 유형별 재고 조회
  public readStock = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new InvStoreRepo(req.tenant.uuid);

      const params = Object.assign(req.query, req.params);
      if (!this.stockTypes.includes(params.stock_type)) { throw new Error('잘못된 stock_type(재고조회유형) 입력') }
      if (!this.groupedTypes.includes(params.grouped_type)) { throw new Error('잘못된 grouped_type(재고분류유형) 입력') }
      if (!this.priceTypes.includes(params.price_type)) { throw new Error('잘못된 price_type(단가유형) 입력') }
      if (!isUuid(params.factory_uuid)) { throw new Error('잘못된 factory_uuid(공장UUID) 입력') };
      if (!isDateFormat(params.reg_date)) { throw new Error('잘못된 reg_date(기준일자) 입력') };

      const result = await repo.readStockAccordingToType(params);

      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readReturnStock]: 반출 대기재고(단위 변환 적용) 조회
  public readReturnStock = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new InvStoreRepo(req.tenant.uuid);
      
      const params = Object.assign(req.query, req.params);
      if (!isUuid(params.factory_uuid)) { throw new Error('잘못된 factory_uuid(공장UUID) 입력') };
      if (!isUuid(params.partner_uuid)) { throw new Error('잘못된 partner_uuid(거래처UUID) 입력') };
      if (!isDateFormat(params.reg_date)) { throw new Error('잘못된 reg_date(기준일자) 입력') };

      const result = await repo.readReturnStock(params);

      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readStoreHistoryByTransaction]: 수불유형에 따른 이력 조회
  public readStoreHistoryByTransaction = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new InvStoreRepo(req.tenant.uuid);
      
      const params = Object.assign(req.query, req.params);  
      if (!this.tranTypes.includes(params.tran_type)) { throw new Error('잘못된 tran_type(재고수불유형) 입력') };
      if (!isUuid(params.factory_uuid)) { throw new Error('잘못된 factory_uuid(공장UUID) 입력') };
      if (!isDateFormat(params.start_date)) { throw new Error('잘못된 start_date(기준시작일자) 입력') };
      if (!isDateFormat(params.end_date)) { throw new Error('잘못된 end_date(기준종료일자) 입력') };

      params.tran_type_cd = getTranTypeCdByApiParams(params.tran_type) as string;
      const result = await repo.readStoreHistoryByTransaction(params);

      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readTotalHistory]: 유형별 총괄 수불부 조회
  public readTotalHistory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new InvStoreRepo(req.tenant.uuid);
      
      const params = Object.assign(req.query, req.params);
      if (!this.stockTypes.includes(params.stock_type)) { throw new Error('잘못된 stock_type(재고조회유형) 입력') }
      if (!this.groupedTypes.includes(params.grouped_type)) { throw new Error('잘못된 grouped_type(재고분류유형) 입력') }
      if (!isUuid(params.factory_uuid)) { throw new Error('잘못된 factory_uuid(공장UUID) 입력') };
      if (!isDateFormat(params.start_date)) { throw new Error('잘못된 start_date(기준시작일자) 입력') };
      if (!isDateFormat(params.end_date)) { throw new Error('잘못된 end_date(기준종료일자) 입력') };

      const result = await repo.readTotalHistoryAccordingToType(params);

      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readIndividualHistory]: 유형별 개별 수불부 조회
  public readIndividualHistory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new InvStoreRepo(req.tenant.uuid);
      
      const params = Object.assign(req.query, req.params);
      if (!isUuid(params.factory_uuid)) { throw new Error('잘못된 factory_uuid(공장UUID) 입력') };
      if (!isUuid(params.store_uuid)) { throw new Error('잘못된 store_uuid(창고UUID) 입력') };
      if (!isDateFormat(params.start_date)) { throw new Error('잘못된 start_date(기준시작일자) 입력') };
      if (!isDateFormat(params.end_date)) { throw new Error('잘못된 end_date(기준종료일자) 입력') };

      const result = await repo.readIndividualHistoryAccordingToType(params);

      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readTypeHistory]: 유형별 수불유형별 수불부 조회
  public readTypeHistory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new InvStoreRepo(req.tenant.uuid);
      
      const params = Object.assign(req.query, req.params);
      if (!this.groupedTypes.includes(params.grouped_type)) { throw new Error('잘못된 grouped_type(재고분류유형) 입력') }
      if (!isUuid(params.factory_uuid)) { throw new Error('잘못된 factory_uuid(공장UUID) 입력') };
      if (!isDateFormat(params.start_date)) { throw new Error('잘못된 start_date(기준시작일자) 입력') };
      if (!isDateFormat(params.end_date)) { throw new Error('잘못된 end_date(기준종료일자) 입력') };

      const result = await repo.readTypeHistoryAccordingToType(params);

      const tempResult: any[] = [];
      result.raws.forEach((raw: any) => {
        const equals = tempResult.find(data => 
          data.factory_uuid == raw.factory_uuid &&
          data.prod_uuid == raw.prod_uuid &&
          data.reject_uuid == raw.reject_uuid &&
          data.lot_no == raw.lot_no &&
          data.store_uuid == raw.store_uuid &&
          data.location_uuid == raw.location_uuid
        );
        
        const inoutStr = raw.inout_fg ? 'in' : 'out';

        if (equals) { equals[raw.tran_cd + '_' + inoutStr  + '_qty'] = raw.qty; }
        else { 
          raw[raw.tran_cd + '_' + inoutStr  + '_qty'] = raw.qty;
          delete raw.inout_fg;
          delete raw.tran_cd;
          delete raw.qty;
          tempResult.push(raw);
        }
      });

      result.raws = tempResult;
      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🟡 Update Functions

  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  // public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

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

  //#endregion

  //#endregion

  //#region ✅ Inherited Hooks

  //#region 🔵 Read Hooks

  // 📒 Fn[beforeRead] (✅ Inheritance): Read DB Tasking 이 실행되기 전 호출되는 Function
  beforeRead = async(req: express.Request) => {
    if (isUuid(req.params.uuid)) { return; }

    if (!this.tranTypes.includes(req.query.tran_type as string)) { throw new Error('잘못된 tran_type(재고수불유형) 입력') };
    if (!isDateFormat(req.query.start_date)) { throw new Error('잘못된 start_date(기준시작일자) 입력') };
    if (!isDateFormat(req.query.end_date)) { throw new Error('잘못된 end_date(기준종료일자) 입력') };
  }

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
}

export default InvStoreCtl;