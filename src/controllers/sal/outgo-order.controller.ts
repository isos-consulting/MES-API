import * as express from 'express';
import { Transaction } from 'sequelize/types';
import ApiResult from '../../interfaces/common/api-result.interface';
import SalOrderDetailRepo from '../../repositories/sal/order-detail.repository';
import SalOrderRepo from '../../repositories/sal/order.repository';
import SalOutgoOrderDetailRepo from '../../repositories/sal/outgo-order-detail.repository';
import SalOutgoOrderRepo from '../../repositories/sal/outgo-order.repository';
import StdDeliveryRepo from '../../repositories/std/delivery.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdPartnerRepo from '../../repositories/std/partner.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import checkArray from '../../utils/checkArray';
import { getSequelize } from '../../utils/getSequelize';
import isDateFormat from '../../utils/isDateFormat';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import unsealArray from '../../utils/unsealArray';
import AdmPatternHistoryCtl from '../adm/pattern-history.controller';
import BaseCtl from '../base.controller';
import config from '../../configs/config';

class SalOutgoOrderCtl extends BaseCtl {
  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(SalOutgoOrderRepo);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'uuid',
        TRepo: SalOutgoOrderRepo,
        idName: 'outgo_order_id',
        uuidName: 'uuid'
      },
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'partner',
        TRepo: StdPartnerRepo,
        idName: 'partner_id',
        uuidName: 'partner_uuid'
      },
      {
        key: 'delivery',
        TRepo: StdDeliveryRepo,
        idName: 'delivery_id',
        uuidName: 'delivery_uuid'
      },
      {
        key: 'order',
        TRepo: SalOrderRepo,
        idName: 'order_id',
        uuidName: 'order_uuid'
      },
    ];
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getBodyIncludedId(req.tenant.uuid, req.body);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new SalOutgoOrderRepo(req.tenant.uuid);
      const detailRepo = new SalOutgoOrderDetailRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          let outgoOrderId: number;
          let maxSeq: number;
          let headerResult: ApiResult<any>;
          const header = unsealArray(data.header);

          if (!header.uuid) {
            // 📌 전표번호가 수기 입력되지 않고 자동발행 Option일 경우 번호 자동발행
            if (!header.stmt_no) { 
              header.stmt_no = await new AdmPatternHistoryCtl().getPattern({
                tenant: req.tenant.uuid,
                factory_id: header.factory_id,
                table_nm: 'SAL_OUTGO_ORDER_TB',
                col_nm: 'stmt_no',
                reg_date: header.reg_date,
                partner_uuid: header.partner_uuid,
                uid: req.user?.uid as number,
                tran: tran
              });
            }

            headerResult = await repo.create(data.header, req.user?.uid as number, tran);
            outgoOrderId = headerResult.raws[0].outgo_order_id;
            header.uuid = headerResult.raws[0].uuid;

            maxSeq = 0;
          } else {
            outgoOrderId = header.outgo_order_id;

            // Max Seq 계산
            maxSeq = await detailRepo.getMaxSeq(outgoOrderId, tran) as number;
          }

          data.details = data.details.map((detail: any) => {
            detail.outgo_order_id = outgoOrderId;
            detail.seq = ++maxSeq;
            return detail;
          });

          const detailResult = await detailRepo.create(data.details, req.user?.uid as number, tran);
          headerResult = await this.updateTotal(req.tenant.uuid, outgoOrderId, header.uuid, req.user?.uid as number, tran);

          result.raws.push({
            header: headerResult.raws,
            details: detailResult.raws,
          });
          result.count += headerResult.count + detailResult.count;
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

  // 📒 Fn[readIncludeDetails]: 출하지시 데이터의 Header + Detail 함께 조회
  public readIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new SalOutgoOrderRepo(req.tenant.uuid);
      const detailRepo = new SalOutgoOrderDetailRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      const params = Object.assign(req.query, req.params);
      params.outgo_order_uuid = params.uuid;

      const completeState = params.complete_state as string;
      if (![ 'all', 'complete', 'incomplete' ].includes(completeState)) { throw new Error('잘못된 complete_state(완료 여부) 입력') }

      const headerResult = await repo.readByUuid(params.outgo_order_uuid);
      const detailsResult = await detailRepo.read(params);

      result.raws = [{ header: unsealArray(headerResult.raws), details: detailsResult.raws }];
      result.count = headerResult.count + detailsResult.count;
      
      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readDetails]: 출하지시 데이터의 Detail 조회
  public readDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const detailRepo = new SalOutgoOrderDetailRepo(req.tenant.uuid);

      const params = Object.assign(req.query, req.params);
      params.outgo_order_uuid = params.uuid;

      const completeState = params.complete_state as string;
      if (![ 'all', 'complete', 'incomplete' ].includes(completeState)) { throw new Error('잘못된 complete_state(완료 여부) 입력') }

      const result = await detailRepo.read(params);
      
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
      req.body = await this.getBodyIncludedId(req.tenant.uuid, req.body);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new SalOutgoOrderRepo(req.tenant.uuid);
      const detailRepo = new SalOutgoOrderDetailRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          await repo.update(data.header, req.user?.uid as number, tran);
          const detailResult = await detailRepo.update(data.details, req.user?.uid as number, tran);
          const headerResult = await this.updateTotal(req.tenant.uuid, data.header[0].outgo_order_id, data.header[0].uuid, req.user?.uid as number, tran);

          result.raws.push({
            header: headerResult.raws,
            details: detailResult.raws,
          });

          result.count += headerResult.count + detailResult.count;
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
  public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getBodyIncludedId(req.tenant.uuid, req.body);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new SalOutgoOrderRepo(req.tenant.uuid);
      const detailRepo = new SalOutgoOrderDetailRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          await repo.patch(data.header, req.user?.uid as number, tran);
          const detailResult = await detailRepo.patch(data.details, req.user?.uid as number, tran);
          const headerResult = await this.updateTotal(req.tenant.uuid, data.header[0].outgo_order_id, data.header[0].uuid, req.user?.uid as number, tran);

          result.raws.push({
            header: headerResult.raws,
            details: detailResult.raws,
          });

          result.count += headerResult.count + detailResult.count;
        }
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };
  
  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Delete Create Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getBodyIncludedId(req.tenant.uuid, req.body);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new SalOutgoOrderRepo(req.tenant.uuid);
      const detailRepo = new SalOutgoOrderDetailRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          const detailResult = await detailRepo.delete(data.details, req.user?.uid as number, tran);
          const count = await detailRepo.getCount(data.header[0].outgo_order_id, tran);

          let headerResult: ApiResult<any>;

          if (count == 0) {
            headerResult = await repo.delete(data.header, req.user?.uid as number, tran);
          } else {
            headerResult = await this.updateTotal(req.tenant.uuid, data.header[0].outgo_order_id, data.header[0].uuid, req.user?.uid as number, tran);
          }

          result.raws.push({
            header: headerResult.raws,
            details: detailResult.raws,
          });

          result.count += headerResult.count + detailResult.count;
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
  getBodyIncludedId = async (tenant: string, _body: any) => {
    const resultBody: any[] = [];
    _body = checkArray(_body);

    for await (const data of _body) {
      if (data.header) { 
        data.header = checkArray(data.header); 
        data.header = await this.getFkId(tenant, data.header, this.fkIdInfos);
      }
      if (data.details) { 
        data.details = checkArray(data.details); 
        data.details = await this.getFkId(tenant, data.details, [
          {
            key: 'outgoOrder',
            TRepo: SalOutgoOrderRepo,
            idName: 'outgo_order_id',
            uuidName: 'outgo_order_uuid'
          },
          {
            key: 'uuid',
            TRepo: SalOutgoOrderDetailRepo,
            idName: 'outgo_order_detail_id',
            uuidName: 'uuid'
          },
          {
            key: 'factory',
            TRepo: StdFactoryRepo,
            idName: 'factory_id',
            uuidName: 'factory_uuid'
          },
          {
            key: 'prod',
            TRepo: StdProdRepo,
            idName: 'prod_id',
            uuidName: 'prod_uuid'
          },
          {
            key: 'orderDetail',
            TRepo: SalOrderDetailRepo,
            idName: 'order_detail_id',
            uuidName: 'order_detail_uuid'
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
   * @param _id 출하지시 전표 Id
   * @param _uuid 출하지시 전표 Uuid
   * @param _uid 데이터 수정자 Uid
   * @param _transaction Transaction
   * @returns 합계 금액, 수량이 계산 된 전표 결과
   */
  updateTotal = async (tenant: string, _id: number, _uuid: string, _uid: number, _transaction?: Transaction) => {
    const repo = new SalOutgoOrderRepo(tenant);
    const detailRepo = new SalOutgoOrderDetailRepo(tenant);

    const totalQty = await detailRepo.getTotalQty(_id, _transaction);

    const result = await repo.patch(
      [{ 
        total_qty: totalQty,
        uuid: _uuid,
      }], 
      _uid, _transaction
    );

    return result;
  }
  //#endregion
}

export default SalOutgoOrderCtl;