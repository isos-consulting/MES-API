import { Transaction } from 'sequelize/types';
import * as express from 'express';
import checkArray from '../../utils/checkArray';
import BaseCtl from '../base.controller';
import sequelize from '../../models';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import SalOutgoRepo from '../../repositories/sal/outgo.repository';
import SalOutgoDetailRepo from '../../repositories/sal/outgo-detail.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdPartnerRepo from '../../repositories/std/partner.repository';
import StdDeliveryRepo from '../../repositories/std/delivery.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdMoneyUnitRepo from '../../repositories/std/money-unit.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import InvStoreRepo from '../../repositories/inv/store.repository';
import getTranTypeCd from '../../utils/getTranTypeCd';
import getStoreBody from '../../utils/getStoreBody';
import SalOrderRepo from '../../repositories/sal/order.repository';
import SalOutgoOrderRepo from '../../repositories/sal/outgo-order.repository';
import SalOrderDetailRepo from '../../repositories/sal/order-detail.repository';
import SalOutgoOrderDetailRepo from '../../repositories/sal/outgo-order-detail.repository';
import convertToReportRaws from '../../utils/convertToReportRaws';
import ApiResult from '../../interfaces/common/api-result.interface';
import unsealArray from '../../utils/unsealArray';
import AdmPatternHistoryCtl from '../adm/pattern-history.controller';
import isDateFormat from '../../utils/isDateFormat';
import isUuid from '../../utils/isUuid';

class SalOutgoCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  repo: SalOutgoRepo;
  detailRepo: SalOutgoDetailRepo;
  storeRepo: InvStoreRepo;

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(new SalOutgoRepo());
    this.detailRepo = new SalOutgoDetailRepo();
    this.storeRepo = new InvStoreRepo();

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽출하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        repo: new StdFactoryRepo(),
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'outgo',
        repo: new SalOutgoRepo(),
        idName: 'outgo_id',
        uuidName: 'outgo_uuid'
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
          let outgoUuid: string;
          let outgoId: number;
          let regDate: string;
          let maxSeq: number;
          let headerResult: ApiResult<any>;
          const header = unsealArray(data.header);

          outgoUuid = header.uuid;

          if (!outgoUuid) {
            // 📌 전표번호가 수기 입력되지 않고 자동발행 Option일 경우 번호 자동발행
            if (!header.stmt_no) { 
              header.stmt_no = await new AdmPatternHistoryCtl().getPattern({
                factory_id: header.factory_id,
                table_nm: 'SAL_OUTGO_TB',
                col_nm: 'stmt_no',
                reg_date: header.reg_date,
                partner_uuid: header.partner_uuid,
                uid: req.user?.uid as number,
                tran: tran
              });
            }

            headerResult = await this.repo.create(data.header, req.user?.uid as number, tran);
            outgoId = headerResult.raws[0].outgo_id;
            regDate = headerResult.raws[0].reg_date;
            outgoUuid = headerResult.raws[0].uuid;

            maxSeq = 0;
          } else {
            outgoId = header.outgo_id;
            regDate = header.reg_date;

            // 📌 Max Seq 계산
            maxSeq = await this.detailRepo.getMaxSeq(outgoId, tran) as number;
          }

          data.details = data.details.map((detail: any) => {
            detail.outgo_id = outgoId;
            detail.seq = ++maxSeq;
            detail.total_price = detail.qty * detail.price * detail.exchange; 
            return detail;
          });

          // 📌 출하 데이터 생성
          const detailResult = await this.detailRepo.create(data.details, req.user?.uid as number, tran);
          headerResult = await this.updateTotal(outgoId, outgoUuid, req.user?.uid as number, tran);

          // 📌 수불 데이터 생성
          const storeBody = getStoreBody(detailResult.raws, 'FROM', 'outgo_detail_id', getTranTypeCd('SAL_OUTGO'), regDate);
          const storeResult = await this.storeRepo.create(storeBody, req.user?.uid as number, tran);

          this.result.raws.push({
            outgo: {
              header: headerResult.raws,
              details: detailResult.raws,
            },
            store: storeResult.raws
          });

          this.result.count += headerResult.count + detailResult.count + storeResult.count;
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

  // 📒 Fn[readIncludeDetails]: 출하 데이터의 Header + Detail 함께 조회
  public readIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      params.outgo_uuid = params.uuid;

      const headerResult = await this.repo.readByUuid(params.outgo_uuid);
      const detailsResult = await this.detailRepo.read(params);

      this.result.raws = [{ header: unsealArray(headerResult.raws), details: detailsResult.raws }];
      this.result.count = headerResult.count + detailsResult.count;
      
      return response(res, this.result.raws, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readDetails]: 출하 데이터의 Detail 조회
  public readDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      params.outgo_uuid = params.uuid;

      this.result = await this.detailRepo.read(params);
      
      return response(res, this.result.raws, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readReport]: 출하현황 데이터 조회
  public readReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);

      const subTotalType = params.sub_total_type as string;
      if (![ 'partner', 'prod', 'date', 'none' ].includes(subTotalType)) { throw new Error('잘못된 sub_total_type(소계 유형) 입력') }

      this.result = await this.repo.readReport(params);
      this.result.raws = convertToReportRaws(this.result.raws);
      
      return response(res, this.result.raws, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readLotTracking]: 출하기준 lot 추적
  public readLotTracking = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
			if (!isUuid(params.factory_uuid)) { throw new Error('잘못된 factory_uuid(공장UUID) 입력') };
			if (!isUuid(params.prod_uuid)) { throw new Error('잘못된 prod_uuid(품번UUID) 입력') };
			if (!params.lot_no) { throw new Error('잘못된 lot_no(LOT NO) 입력') };

      this.result = await this.repo.readLotTrackingToForward(params);

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
          data.details = data.details.map((detail: any) => {
            detail.total_price = detail.qty * detail.price * detail.exchange; 
            return detail;
          });

          // 📌 출하 데이터 수정
          await this.repo.update(data.header, req.user?.uid as number, tran);
          const detailResult = await this.detailRepo.update(data.details, req.user?.uid as number, tran);
          const headerResult = await this.updateTotal(data.header[0].outgo_id, data.header[0].uuid, req.user?.uid as number, tran);

          // 📌 수불 데이터 수정
          const storeBody = getStoreBody(detailResult.raws, 'FROM', 'outgo_detail_id', getTranTypeCd('SAL_OUTGO'));
          const storeResult = await this.storeRepo.updateToTransaction(storeBody, req.user?.uid as number, tran);

          this.result.raws.push({
            outgo: {
              header: headerResult.raws,
              details: detailResult.raws,
            },
            store: storeResult.raws
          });

          this.result.count += headerResult.count + detailResult.count + storeResult.count;
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
      req.body = await this.getBodyIncludedId(req.body);
      this.result = { raws: [], count: 0 };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          data.details = data.details.map((detail: any) => {
            detail.total_price = detail.qty * detail.price * detail.exchange; 
            return detail;
          });

          // 📌 출하 데이터 수정
          await this.repo.patch(data.header, req.user?.uid as number, tran);
          const detailResult = await this.detailRepo.patch(data.details, req.user?.uid as number, tran);
          const headerResult = await this.updateTotal(data.header[0].outgo_id, data.header[0].uuid, req.user?.uid as number, tran);

          // 📌 수불 데이터 수정
          const storeBody = getStoreBody(detailResult.raws, 'FROM', 'outgo_detail_id', getTranTypeCd('SAL_OUTGO'));
          const storeResult = await this.storeRepo.updateToTransaction(storeBody, req.user?.uid as number, tran);

          this.result.raws.push({
            outgo: {
              header: headerResult.raws,
              details: detailResult.raws,
            },
            store: storeResult.raws
          });

          this.result.count += headerResult.count + detailResult.count + storeResult.count;
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
          const deleteBody = data.details.map((data: any) => {
            return {
              tran_id: data.outgo_detail_id,
              inout_fg: false,
              tran_cd: getTranTypeCd('SAL_OUTGO'),
            };
          });      
          // 📌 수불 내역 삭제
          const storeResult = await this.storeRepo.deleteToTransaction(deleteBody, req.user?.uid as number, tran);
          // 📌 출하 내역 삭제
          const detailResult = await this.detailRepo.delete(data.details, req.user?.uid as number, tran);
          const count = await this.detailRepo.getCount(data.header[0].outgo_id, tran);

          let headerResult: ApiResult<any>;
          if (count == 0) {
            headerResult = await this.repo.delete(data.header, req.user?.uid as number, tran);
          } else {
            headerResult = await this.updateTotal(data.header[0].outgo_id, data.header[0].uuid, req.user?.uid as number, tran);
          }

          this.result.raws.push({
            outgo: {
              header: headerResult.raws,
              details: detailResult.raws,
            },
            store: storeResult.raws
          });

          this.result.count += headerResult.count + detailResult.count + storeResult.count;
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

    if (!isDateFormat(req.query.start_date)) { throw new Error('잘못된 start_date(기준시작일자) 입력') };
    if (!isDateFormat(req.query.end_date)) { throw new Error('잘못된 end_date(기준종료일자) 입력') };
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
              repo: new SalOutgoRepo(),
              idName: 'outgo_id',
              uuidName: 'uuid'
            },
            {
              key: 'partner',
              repo: new StdPartnerRepo(),
              idName: 'partner_id',
              uuidName: 'partner_uuid'
            },
            {
              key: 'delivery',
              repo: new StdDeliveryRepo(),
              idName: 'delivery_id',
              uuidName: 'delivery_uuid'
            },
            {
              key: 'order',
              repo: new SalOrderRepo(),
              idName: 'order_id',
              uuidName: 'order_uuid'
            },
            {
              key: 'outgoOrder',
              repo: new SalOutgoOrderRepo(),
              idName: 'outgo_order_id',
              uuidName: 'outgo_order_uuid'
            },
          ]);
      }
    if (data.details) { 
      data.details = checkArray(data.details); 
      data.details = await this.getFkId(data.details, 
        [...this.fkIdInfos, 
          {
            key: 'uuid',
            repo: new SalOutgoDetailRepo(),
            idName: 'outgo_detail_id',
            uuidName: 'uuid'
          },
          {
            key: 'prod',
            repo: new StdProdRepo(),
            idName: 'prod_id',
            uuidName: 'prod_uuid'
          },
          {
            key: 'moneyUnit',
            repo: new StdMoneyUnitRepo(),
            idName: 'money_unit_id',
            uuidName: 'money_unit_uuid'
          },
          {
            key: 'orderDetail',
            repo: new SalOrderDetailRepo(),
            idName: 'order_detail_id',
            uuidName: 'order_detail_uuid'
          },
          {
            key: 'outgoOrderDetail',
            repo: new SalOutgoOrderDetailRepo(),
            idName: 'outgo_order_detail_id',
            uuidName: 'outgo_order_detail_uuid'
          },
          {
            key: 'fromStore',
            repo: new StdStoreRepo(),
            idName: 'store_id',
            idAlias: 'from_store_id',
            uuidName: 'from_store_uuid'
          },
          {
            key: 'fromLocation',
            repo: new StdLocationRepo(),
            idName: 'location_id',
            idAlias: 'from_location_id',
            uuidName: 'from_location_uuid'
          },
        ]);
      }

      resultBody.push({ header: data.header, details: data.details });
    }

    return resultBody;
  }

  // 📒 Fn[updateTotal]: 전표 합계 금액, 수량 계산
  /**
   * 전표 합계 금액, 수량 계산
   * @param _id 출하 전표 Id
   * @param _uuid 출하 전표 Uuid
   * @param _uid 데이터 수정자 Uid
   * @param _transaction Transaction
   * @returns 합계 금액, 수량이 계산 된 전표 결과
   */
  updateTotal = async (_id: number, _uuid: string, _uid: number, _transaction?: Transaction) => {
    const getTotals = await this.detailRepo.getTotals(_id, _transaction);
    const totalQty = getTotals?.totalQty;
    const totalPrice = getTotals?.totalPrice;

    const result = await this.repo.patch(
      [{ 
        total_qty: totalQty,
        total_price: totalPrice,
        uuid: _uuid,
      }], 
      _uid, _transaction
    );

    return result;
  }

  //#endregion
}

export default SalOutgoCtl;