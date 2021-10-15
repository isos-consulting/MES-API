import * as express from 'express';
import { Transaction } from 'sequelize/types';
import ApiResult from '../../interfaces/common/api-result.interface';
import sequelize from '../../models';
import MatOrderDetailRepo from '../../repositories/mat/order-detail.repository';
import MatOrderRepo from '../../repositories/mat/order.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdMoneyUnitRepo from '../../repositories/std/money-unit.repository';
import StdPartnerRepo from '../../repositories/std/partner.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdUnitRepo from '../../repositories/std/unit.repository';
import checkArray from '../../utils/checkArray';
import isDateFormat from '../../utils/isDateFormat';
import isUuid from '../../utils/isUuid';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import unsealArray from '../../utils/unsealArray';
import AdmPatternHistoryCtl from '../adm/pattern-history.controller';
import BaseCtl, { getFkIdInfo } from '../base.controller';

class MatOrderCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  repo: MatOrderRepo;
  detailRepo: MatOrderDetailRepo;

  // ✅ Raws 유형(Header, Details)에 따라 Fk 변환 기준 변경 변수
  headerFkIdInfos: getFkIdInfo[];
  detailsFkIdInfos: getFkIdInfo[];

  // ✅ 조회조건 Types
  completeStates: string[];
  sort_type: string[];

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(new MatOrderRepo());
    this.detailRepo = new MatOrderDetailRepo();

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'order',
        repo: new MatOrderRepo(),
        idName: 'order_id',
        uuidName: 'order_uuid'
      },
      {
        key: 'factory',
        repo: new StdFactoryRepo(),
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'partner',
        repo: new StdPartnerRepo(),
        idName: 'partner_id',
        uuidName: 'partner_uuid'
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
        key: 'moneyUnit',
        repo: new StdMoneyUnitRepo(),
        idName: 'money_unit_id',
        uuidName: 'money_unit_uuid'
      },
    ];

    // ✅ Raws 유형(Header, Details)에 따라 Fk 변환 기준 변경
    this.headerFkIdInfos = [
      ...this.fkIdInfos,
      {
        key: 'uuid',
        repo: new MatOrderRepo(),
        idName: 'order_id',
        uuidName: 'uuid'
      }
    ];
    this.detailsFkIdInfos = [...this.fkIdInfos];

    // ✅ 조회조건 Types Setting
    this.completeStates = [ 'all', 'complete', 'incomplete' ];
    this.sort_type = [ 'partner', 'prod', 'date' ];
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
          let orderId: number;
          let orderUuid: string;
          let maxSeq: number;
          let headerResult: ApiResult<any>;
          const [ header ] = data.header;

          orderUuid = header.uuid;
          if (!orderUuid) {
            // 📌 전표번호가 수기 입력되지 않고 자동발행 Option일 경우 번호 자동발행
            if (!header.stmt_no) { 
              header.stmt_no = await new AdmPatternHistoryCtl().getPattern({
                factory_id: header.factory_id,
                table_nm: 'MAT_ORDER_TB',
                col_nm: 'stmt_no',
                reg_date: header.reg_date,
                partner_uuid: header.partner_uuid,
                uid: req.user?.uid as number,
                tran: tran
              });

              if (!header.stmt_no) { throw new Error('잘못된 전표번호 입력(전표번호 자동발행 확인)') }
            }

            headerResult = await this.repo.create(data.header, req.user?.uid as number, tran);
            orderId = headerResult.raws[0].order_id;
            orderUuid = headerResult.raws[0].uuid;

            maxSeq = 0;
          } else {
            orderId = header.order_id;

            // Max Seq 계산
            maxSeq = await this.detailRepo.getMaxSeq(orderId, tran) as number;
          }

          data.details = data.details.map((detail: any) => {
            detail.order_id = orderId;
            detail.seq = ++maxSeq;
            detail.total_price = detail.qty * detail.price * detail.exchange; 
            return detail;
          });

          const detailResult = await this.detailRepo.create(data.details, req.user?.uid as number, tran);
          headerResult = await this.updateTotals(orderId, orderUuid, req.user?.uid as number, tran);

          this.result.raws.push({ header: headerResult.raws, details: detailResult.raws });
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

  // 📒 Fn[readIncludeDetails]: 발주 데이터의 Header + Detail 함께 조회
  public readIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      params.order_uuid = params.uuid;
      if (!this.completeStates.includes(params.complete_state)) { throw new Error('잘못된 complete_state(완료 여부) 입력') }

      const headerResult = await this.repo.readByUuid(params.order_uuid);
      const detailsResult = await this.detailRepo.read(params);

      this.result.raws = [{ header: unsealArray(headerResult.raws), details: detailsResult.raws }];
      this.result.count = headerResult.count + detailsResult.count;
      
      return response(res, this.result.raws, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readDetails]: 발주 데이터의 Detail 조회
  public readDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      params.order_uuid = params.uuid;
      if (!this.completeStates.includes(params.complete_state)) { throw new Error('잘못된 complete_state(완료 여부) 입력') }

      this.result = await this.detailRepo.read(params);
      
      return response(res, this.result.raws, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readReport]: 발주현황 데이터 조회
  public readReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
			console.log(req.params)
      if (!this.completeStates.includes(params.complete_state)) { throw new Error('잘못된 complete_state(완료 여부) 입력') }
      if (!this.sort_type.includes(params.sort_type)) { throw new Error('잘못된 sort_type(정렬) 입력') }

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
      req.body = await this.getBodyIncludedId(req.body);
      this.result = { raws: [], count: 0 };

      // 📌 Detail Data의 합계금액 계산
      req.body = req.body.map((data: any) => {
        data.details = data.details.map((detail: any) => {
          detail.total_price = detail.qty * detail.price * detail.exchange; 
          return detail;
        });
        return data;
      });

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          await this.repo.patch(data.header, req.user?.uid as number, tran);
          const detailResult = await this.detailRepo.update(data.details, req.user?.uid as number, tran);
          const headerResult = await this.updateTotals(data.header[0].order_id, data.header[0].uuid, req.user?.uid as number, tran);

          this.result.raws.push({ header: headerResult.raws, details: detailResult.raws });
          this.result.count += headerResult.count + detailResult.count;
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

      // 📌 Detail Data의 합계금액 계산
      req.body = req.body.map((data: any) => {
        data.details = data.details.map((detail: any) => {
          detail.total_price = detail.qty * detail.price * detail.exchange; 
          return detail;
        });
        return data;
      });

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          await this.repo.patch(data.header, req.user?.uid as number, tran);
          const detailResult = await this.detailRepo.patch(data.details, req.user?.uid as number, tran);
          const headerResult = await this.updateTotals(data.header[0].order_id, data.header[0].uuid, req.user?.uid as number, tran);

          this.result.raws.push({ header: headerResult.raws, details: detailResult.raws });
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
          const detailResult = await this.detailRepo.delete(data.details, req.user?.uid as number, tran);
          const count = await this.detailRepo.getCount(data.header[0].order_id, tran);

          let headerResult: ApiResult<any> = { raws: [], count: 0 };
          // 📌 발주전표의 상세데이터가 모두 삭제될 경우 전표를 함께 삭제
          if (count == 0) { headerResult = await this.repo.delete(data.header, req.user?.uid as number, tran); } 
          else { headerResult = await this.updateTotals(data.header[0].order_id, data.header[0].uuid, req.user?.uid as number, tran); }

          this.result.raws.push({ header: headerResult.raws, details: detailResult.raws });
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
    if (isUuid(req.params.uuid)) { return; }
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
   * @param body Request Body
   * @returns Uuid => Id 로 Conversion 되어있는 Body
   */
  getBodyIncludedId = async (body: any) => {
    const resultBody: any[] = [];

    for await (const data of checkArray(body)) {
      if (data.header) { data.header = await this.getFkId(data.header, this.headerFkIdInfos); }
      if (data.details) { data.details = await this.getFkId(data.details, this.detailsFkIdInfos); }
      resultBody.push({ header: data.header, details: data.details });
    }

    return resultBody;
  }

  // 📒 Fn[updateTotals]: 전표 합계 금액, 수량 계산
  /**
   * 전표 합계 금액, 수량 계산
   * @param id 발주 전표 Id
   * @param uuid 발주 전표 Uuid
   * @param uid 데이터 수정자 Uid
   * @param tran Transaction
   * @returns 합계 금액, 수량이 계산 된 전표 결과
   */
  updateTotals = async (id: number, uuid: string, uid: number, tran?: Transaction) => {
    const getTotals = await this.detailRepo.getTotals(id, tran);
    if (!getTotals) { throw new Error('전표 합계금액, 수량 값이 잘못되었습니다.'); }

    const totalQty = getTotals.totalQty;
    const totalPrice = getTotals.totalPrice;

    const result = await this.repo.patch(
      [{ 
        total_qty: totalQty,
        total_price: totalPrice,
        uuid: uuid,
      }], 
      uid, tran
    );

    return result;
  }

  //#endregion
}

export default MatOrderCtl;