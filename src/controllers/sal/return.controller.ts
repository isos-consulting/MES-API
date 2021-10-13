import express = require('express');
import { Transaction } from 'sequelize/types';
import sequelize from '../../models';
import InvStoreRepo from '../../repositories/inv/store.repository';
import SalOutgoDetailRepo from '../../repositories/sal/outgo-detail.repository';
import SalOutgoRepo from '../../repositories/sal/outgo.repository';
import SalReturnDetailRepo from '../../repositories/sal/return-detail.repository';
import SalReturnRepo from '../../repositories/sal/return.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdMoneyUnitRepo from '../../repositories/std/money-unit.repository';
import StdPartnerRepo from '../../repositories/std/partner.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import StdDeliveryRepo from '../../repositories/std/delivery.repository';
import checkArray from '../../utils/checkArray';
import getStoreBody from '../../utils/getStoreBody';
import getTranTypeCd from '../../utils/getTranTypeCd';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import BaseCtl from '../base.controller';
import StdRejectRepo from '../../repositories/std/reject.repository';
import convertToReportRaws from '../../utils/convertToReportRaws';
import ApiResult from '../../interfaces/common/api-result.interface';
import unsealArray from '../../utils/unsealArray';
import AdmPatternHistoryCtl from '../adm/pattern-history.controller';
import isDateFormat from '../../utils/isDateFormat';

class SalReturnCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  repo: SalReturnRepo;
  detailRepo: SalReturnDetailRepo;
  storeRepo: InvStoreRepo;

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(new SalReturnRepo());
    this.detailRepo = new SalReturnDetailRepo();
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
        key: 'return',
        repo: new SalReturnRepo(),
        idName: 'return_id',
        uuidName: 'return_uuid'
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
          let returnUuid: string;
          let returnId: number;
          let maxSeq: number;
          let headerResult: ApiResult<any>;
          const header = unsealArray(data.header);

          returnUuid = header.uuid;

          if (!returnUuid) {
            // 📌 전표번호가 수기 입력되지 않고 자동발행 Option일 경우 번호 자동발행
            if (!header.stmt_no) { 
              header.stmt_no = await new AdmPatternHistoryCtl().getPattern({
                factory_id: header.factory_id,
                table_nm: 'SAL_RETURN_TB',
                col_nm: 'stmt_no',
                reg_date: header.reg_date,
                partner_uuid: header.partner_uuid,
                uid: req.user?.uid as number,
                tran: tran
              });
            }

            headerResult = await this.repo.create(data.header, req.user?.uid as number, tran);
            returnId = headerResult.raws[0].return_id;
            returnUuid = headerResult.raws[0].uuid;

            maxSeq = 0;
          } else {
            returnId = header.return_id;

            // 📌 Max Seq 계산
            maxSeq = await this.detailRepo.getMaxSeq(returnId, tran) as number;
          }

          data.details = data.details.map((detail: any) => {
            detail.return_id = returnId;
            detail.seq = ++maxSeq;
            detail.total_price = detail.qty * detail.price * detail.exchange; 
            return detail;
          });

          // 📌 제품 반입
          const detailResult = await this.detailRepo.create(data.details, req.user?.uid as number, tran);
          headerResult = await this.updateTotal(returnId, returnUuid, req.user?.uid as number, tran);

          // 📌 창고 수불
          const storeBody = getStoreBody(detailResult.raws, 'TO', 'return_detail_id', getTranTypeCd('SAL_RETURN'), headerResult.raws[0].reg_date);
          const storeResult = await this.storeRepo.create(storeBody, req.user?.uid as number, tran);

          this.result.raws.push({
            return: {
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

  // 📒 Fn[readIncludeDetails]: 반입 데이터의 Header + Detail 함께 조회
  public readIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      params.return_uuid = params.uuid;

      const headerResult = await this.repo.readByUuid(params.return_uuid);
      const detailsResult = await this.detailRepo.read(params);

      this.result.raws = [{ header: unsealArray(headerResult.raws), details: detailsResult.raws }];
      this.result.count = headerResult.count + detailsResult.count;
      
      return response(res, this.result.raws, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readDetails]: 반입 데이터의 Detail 조회
  public readDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      params.return_uuid = params.uuid;

      this.result = await this.detailRepo.read(params);
      
      return response(res, this.result.raws, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readReport]: 반입현황 데이터 조회
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

          // 📌 반입 데이터 수정
          await this.repo.update(data.header, req.user?.uid as number, tran);
          const detailResult = await this.detailRepo.update(data.details, req.user?.uid as number, tran);
          const headerResult = await this.updateTotal(data.header[0].return_id, data.header[0].uuid, req.user?.uid as number, tran);

          // 📌 수불 데이터 수정
          const storeBody = getStoreBody(detailResult.raws, 'TO', 'return_detail_id', getTranTypeCd('SAL_RETURN'));
          const storeResult = await this.storeRepo.updateToTransaction(storeBody, req.user?.uid as number, tran);

          this.result.raws.push({
            return: {
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

          // 📌 반입 데이터 수정
          await this.repo.patch(data.header, req.user?.uid as number, tran);
          const detailResult = await this.detailRepo.patch(data.details, req.user?.uid as number, tran);
          const headerResult = await this.updateTotal(data.header[0].return_id, data.header[0].uuid, req.user?.uid as number, tran);

          // 📌 수불 데이터 수정
          const storeBody = getStoreBody(detailResult.raws, 'TO', 'return_detail_id', getTranTypeCd('SAL_RETURN'));
          const storeResult = await this.storeRepo.updateToTransaction(storeBody, req.user?.uid as number, tran);

          this.result.raws.push({
            return: {
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
              tran_id: data.return_detail_id,
              inout_fg: true,
              tran_cd: getTranTypeCd('SAL_RETURN'),
            };
          });

          // 📌 수불 내역 삭제
          const storeResult = await this.storeRepo.deleteToTransaction(deleteBody, req.user?.uid as number, tran);

          // 📌 반입 내역 삭제
          const detailResult = await this.detailRepo.delete(data.details, req.user?.uid as number, tran);
          const count = await this.detailRepo.getCount(data.header[0].return_id, tran);

          let headerResult: ApiResult<any>;
          if (count == 0) {
            headerResult = await this.repo.delete(data.header, req.user?.uid as number, tran);
          } else {
            headerResult = await this.updateTotal(data.header[0].return_id, data.header[0].uuid, req.user?.uid as number, tran);
          }

          console.log(4);

          this.result.raws.push({
            return: {
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
              repo: new SalReturnRepo(),
              idName: 'return_id',
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
              key: 'outgo',
              repo: new SalOutgoRepo(),
              idName: 'outgo_id',
              uuidName: 'outgo_uuid'
            },
            {
              key: 'reject',
              repo: new StdRejectRepo(),
              idName: 'reject_id',
              uuidName: 'reject_uuid'
            },
          ]);
      }
    if (data.details) { 
      data.details = checkArray(data.details); 
      data.details = await this.getFkId(data.details, 
        [...this.fkIdInfos, 
          {
            key: 'uuid',
            repo: new SalReturnDetailRepo(),
            idName: 'return_detail_id',
            uuidName: 'uuid'
          },
          {
            key: 'returnDetail',
            repo: new SalReturnDetailRepo(),
            idName: 'return_detail_id',
            uuidName: 'return_detail_uuid'
          },
          {
            key: 'outgoDetail',
            repo: new SalOutgoDetailRepo(),
            idName: 'outgo_detail_id',
            uuidName: 'outgo_detail_uuid'
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
            key: 'toStore',
            repo: new StdStoreRepo(),
            idName: 'store_id',
            idAlias: 'to_store_id',
            uuidName: 'to_store_uuid'
          },
          {
            key: 'toLocation',
            repo: new StdLocationRepo(),
            idName: 'location_id',
            idAlias: 'to_location_id',
            uuidName: 'to_location_uuid'
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
   * @param _id 반입 전표 Id
   * @param _uuid 반입 전표 Uuid
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

export default SalReturnCtl;