import { Transaction } from 'sequelize/types';
import * as express from 'express';
import MatReceiveRepo from '../../repositories/mat/receive.repository';
import checkArray from '../../utils/checkArray';
import BaseCtl, { getFkIdInfo } from '../base.controller';
import sequelize from '../../models';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import MatReceiveDetailRepo from '../../repositories/mat/receive-detail.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdPartnerRepo from '../../repositories/std/partner.repository';
import StdSupplierRepo from '../../repositories/std/supplier.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdMoneyUnitRepo from '../../repositories/std/money-unit.repository';
import MatOrderRepo from '../../repositories/mat/order.repository';
import MatOrderDetailRepo from '../../repositories/mat/order-detail.repository';
import MatIncomeRepo from '../../repositories/mat/income.repository';
import InvStoreRepo from '../../repositories/inv/store.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import getTranTypeCd from '../../utils/getTranTypeCd';
import getStoreBody from '../../utils/getStoreBody';
import ApiResult from '../../interfaces/common/api-result.interface';
import unsealArray from '../../utils/unsealArray';
import AdmPatternHistoryCtl from '../adm/pattern-history.controller';
import QmsInspResultRepo from '../../repositories/qms/insp-result.repository';
import StdUnitRepo from '../../repositories/std/unit.repository';
import StdUnitConvertRepo from '../../repositories/std/unit-convert.repository';
import isDateFormat from '../../utils/isDateFormat';
import isUuid from '../../utils/isUuid';

class MatReceiveCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  repo: MatReceiveRepo;
  detailRepo: MatReceiveDetailRepo;
  incomeRepo: MatIncomeRepo;
  storeRepo: InvStoreRepo;
  inspResultRepo: QmsInspResultRepo;

  // ✅ Raws 유형(Header, Details)에 따라 Fk 변환 기준 변경 변수
  headerFkIdInfos: getFkIdInfo[];
  detailsFkIdInfos: getFkIdInfo[];

  // ✅ 정렬조건 Types
  sort_type: string[];

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(new MatReceiveRepo());
    this.detailRepo = new MatReceiveDetailRepo();
    this.incomeRepo = new MatIncomeRepo();
    this.storeRepo = new InvStoreRepo();
    this.inspResultRepo = new QmsInspResultRepo();

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        repo: new StdFactoryRepo(),
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'receive',
        repo: new MatReceiveRepo(),
        idName: 'receive_id',
        uuidName: 'receive_uuid'
      },
    ];

    // ✅ Raws 유형(Header, Details)에 따라 Fk 변환 기준 변경
    this.headerFkIdInfos = [
      ...this.fkIdInfos, 
      {
        key: 'uuid',
        repo: new MatReceiveRepo(),
        idName: 'receive_id',
        uuidName: 'uuid'
      },
      {
        key: 'partner',
        repo: new StdPartnerRepo(),
        idName: 'partner_id',
        uuidName: 'partner_uuid'
      },
      {
        key: 'supplier',
        repo: new StdSupplierRepo(),
        idName: 'supplier_id',
        uuidName: 'supplier_uuid'
      },
      {
        key: 'order',
        repo: new MatOrderRepo(),
        idName: 'order_id',
        uuidName: 'order_uuid'
      },
    ];
    this.detailsFkIdInfos = [
      ...this.fkIdInfos,
      {
        key: 'uuid',
        repo: new MatReceiveDetailRepo(),
        idName: 'receive_detail_id',
        uuidName: 'uuid'
      },
      {
        key: 'orderDetail',
        repo: new MatOrderDetailRepo(),
        idName: 'order_detail_id',
        uuidName: 'order_detail_uuid'
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
      {
        key: 'income',
        repo: new MatIncomeRepo(),
        idName: 'income_id',
        uuidName: 'income_uuid'
      }
    ];

    // ✅ 정렬조건 Types Setting
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
          let receiveId: number;
          let receiveUuid: string;
          let maxSeq: number;
          let headerResult: ApiResult<any>;
          const [ header ] = data.header;

          receiveUuid = header.uuid;
          if (!receiveUuid) {
            // 📌 전표번호가 수기 입력되지 않고 자동발행 Option일 경우 번호 자동발행
            if (!header.stmt_no) { 
              header.stmt_no = await new AdmPatternHistoryCtl().getPattern({
                factory_id: header.factory_id,
                table_nm: 'MAT_RECEIVE_TB',
                col_nm: 'stmt_no',
                reg_date: header.reg_date,
                partner_uuid: header.partner_uuid,
                uid: req.user?.uid as number,
                tran: tran
              });
            }

            headerResult = await this.repo.create(data.header, req.user?.uid as number, tran);
            receiveId = headerResult.raws[0].receive_id;
            receiveUuid = headerResult.raws[0].uuid;

            maxSeq = 0;
          } else {
            receiveId = header.receive_id;

            // 📌 Max Seq 계산
            maxSeq = await this.detailRepo.getMaxSeq(receiveId, tran) as number;
          }

          data.details = data.details.map((detail: any) => {
            detail.receive_id = receiveId;
            detail.seq = ++maxSeq;
            detail.total_price = detail.qty * detail.price * detail.exchange; 
            return detail;
          });

          // 📌 자재 입하
          const detailResult = await this.detailRepo.create(data.details, req.user?.uid as number, tran);
          headerResult = await this.updateTotal(receiveId, receiveUuid, req.user?.uid as number, tran);

          // 📌 자재 입고
          const incomeBody = await this.getIncomeBody(detailResult, header.reg_date);
          const incomeResult = await this.incomeRepo.create(incomeBody, req.user?.uid as number, tran);

          // 📌 창고 수불
          const storeBody = getStoreBody(incomeResult.raws, 'TO', 'income_id', getTranTypeCd('MAT_INCOME'));
          const storeResult = await this.storeRepo.create(storeBody, req.user?.uid as number, tran);

          this.result.raws.push({
            receive: {
              header: headerResult.raws,
              details: detailResult.raws,
            },
            income: incomeResult.raws,
            store: storeResult.raws
          });

          this.result.count += headerResult.count + detailResult.count + incomeResult.count + storeResult.count;
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

  // 📒 Fn[readIncludeDetails]: 입하 데이터의 Header + Detail 함께 조회
  public readIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      params.receive_uuid = params.uuid;

      const headerResult = await this.repo.readByUuid(params.receive_uuid);
      const detailsResult = await this.detailRepo.read(params);

      this.result.raws = [{ header: unsealArray(headerResult.raws), details: detailsResult.raws }];
      this.result.count = headerResult.count + detailsResult.count;
      
      return response(res, this.result.raws, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readDetails]: 입하 데이터의 Detail 조회
  public readDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      params.receive_uuid = params.uuid;

      this.result = await this.detailRepo.read(params);
      
      return response(res, this.result.raws, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readReport]: 입하현황 데이터 조회
  public readReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      if (!this.sort_type.includes(params.sort_type)) { throw new Error('잘못된 sort_type(정렬) 입력') }

      this.result = await this.repo.readReport(params);
      
      return response(res, this.result.raws, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

// 📒 Fn[readLotTracking]: 입하기준 lot 추적
  public readLotTracking = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const params = Object.assign(req.query, req.params);
      if (!isUuid(params.factory_uuid)) { throw new Error('잘못된 factory_uuid(공장UUID) 입력') };
			if (!isUuid(params.prod_uuid)) { throw new Error('잘못된 prod_uuid(품번UUID) 입력') };
			if (!params.lot_no) { throw new Error('잘못된 lot_no(LOT NO) 입력') };

      this.result = await this.repo.readLotTrackingToReverse(params);

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
      const receiveDetailUuids: string[] = [];
      req.body = req.body.map((data: any) => {
        data.details = data.details.map((detail: any) => {
          receiveDetailUuids.push(detail.uuid);
          detail.total_price = detail.qty * detail.price * detail.exchange; 
          return detail;
        });
        return data;
      });

      await sequelize.transaction(async(tran) => { 
        // 📌 수입검사 이력이 있을 경우 Interlock
        const receiveInspResult = await this.inspResultRepo.readMatReceiveByReceiveUuids(receiveDetailUuids);
        if (receiveInspResult.raws.length > 0) { throw new Error(`입하상세번호 ${receiveInspResult.raws[0].uuid}의 수입검사 이력이 등록되어 수정할 수 없습니다.`); }

        for await (const data of req.body) {
          // 📌 입하 데이터 수정
          await this.repo.update(data.header, req.user?.uid as number, tran);
          const detailResult = await this.detailRepo.update(data.details, req.user?.uid as number, tran);
          const headerResult = await this.updateTotal(data.header[0].receive_id, data.header[0].uuid, req.user?.uid as number, tran);

          // 📌 입고 데이터 수정
          const incomeBody = await this.getIncomeBody(data.details);
          const incomeResult = await this.incomeRepo.updateToPk(incomeBody, req.user?.uid as number, tran);

          // 📌 수불 데이터 수정
          const storeBody = getStoreBody(incomeResult.raws, 'TO', 'income_id', getTranTypeCd('MAT_INCOME'));
          const storeResult = await this.storeRepo.updateToTransaction(storeBody, req.user?.uid as number, tran);

          this.result.raws.push({
            receive: {
              header: headerResult.raws,
              details: detailResult.raws,
            },
            income: incomeResult.raws,
            store: storeResult.raws
          });

          this.result.count += headerResult.count + detailResult.count + incomeResult.count + storeResult.count;
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
      const receiveDetailUuids: string[] = [];
      req.body = req.body.map((data: any) => {
        data.details = data.details.map((detail: any) => {
          receiveDetailUuids.push(detail.uuid);
          detail.total_price = detail.qty * detail.price * detail.exchange; 
          return detail;
        });
        return data;
      });

      await sequelize.transaction(async(tran) => { 
        // 📌 수입검사 이력이 있을 경우 Interlock
        const receiveInspResult = await this.inspResultRepo.readMatReceiveByReceiveUuids(receiveDetailUuids);
        if (receiveInspResult.raws.length > 0) { throw new Error(`입하상세번호 ${receiveInspResult.raws[0].uuid}의 수입검사 이력이 등록되어 수정할 수 없습니다.`); }

        for await (const data of req.body) {
          // 📌 입하 데이터 수정
          await this.repo.update(data.header, req.user?.uid as number, tran);
          const detailResult = await this.detailRepo.patch(data.details, req.user?.uid as number, tran);
          const headerResult = await this.updateTotal(data.header[0].receive_id, data.header[0].uuid, req.user?.uid as number, tran);

          // 📌 입고 데이터 수정
          const incomeBody = await this.getIncomeBody(data.details);
          const incomeResult = await this.incomeRepo.updateToPk(incomeBody, req.user?.uid as number, tran);

          // 📌 수불 데이터 수정
          const storeBody = getStoreBody(incomeResult.raws, 'TO', 'income_id', getTranTypeCd('MAT_INCOME'));
          const storeResult = await this.storeRepo.updateToTransaction(storeBody, req.user?.uid as number, tran);

          this.result.raws.push({
            receive: {
              header: headerResult.raws,
              details: detailResult.raws,
            },
            income: incomeResult.raws,
            store: storeResult.raws
          });

          this.result.count += headerResult.count + detailResult.count + incomeResult.count + storeResult.count;
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
          const receiveDetailUuids = data.details.map((detail: any) => { return detail.uuid; });

          // 📌 수입검사 이력이 있을 경우 Interlock
          const receiveInspResult = await this.inspResultRepo.readMatReceiveByReceiveUuids(receiveDetailUuids);
          if (receiveInspResult.raws.length > 0) { throw new Error(`입하상세번호 ${receiveInspResult.raws[0].uuid}의 수입검사 이력이 등록되어 삭제할 수 없습니다.`); }

          // 📌 수불 및 입고 내역을 삭제하기 위하여 입하 상세 Uuid => 입고 Id 변환
          const incomeIds = await this.incomeRepo.readIncomeIdsToReceiveDetailUuids(receiveDetailUuids);
          const deleteBody = incomeIds.map((incomeId: number) => {
            return {
              income_id: incomeId,
              tran_id: incomeId,
              inout_fg: true,
              tran_cd: getTranTypeCd('MAT_INCOME'),
            };
          });

          // 📌 수불 내역 삭제
          const storeResult = await this.storeRepo.deleteToTransaction(deleteBody, req.user?.uid as number, tran);
          // 📌 입고 내역 삭제
          const incomeResult = await this.incomeRepo.deleteToPk(deleteBody, req.user?.uid as number, tran);
          // 📌 입하 내역 삭제
          const detailResult = await this.detailRepo.delete(data.details, req.user?.uid as number, tran);
          const count = await this.detailRepo.getCount(data.header[0].receive_id, tran);

          let headerResult: ApiResult<any>;
          if (count == 0) {
            headerResult = await this.repo.delete(data.header, req.user?.uid as number, tran);
          } else {
            headerResult = await this.updateTotal(data.header[0].receive_id, data.header[0].uuid, req.user?.uid as number, tran);
          }

          this.result.raws.push({
            receive: {
              header: headerResult.raws,
              details: detailResult.raws,
            },
            income: incomeResult.raws,
            store: storeResult.raws
          });

          this.result.count += headerResult.count + detailResult.count + incomeResult.count + storeResult.count;
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
              repo: new MatReceiveRepo(),
              idName: 'receive_id',
              uuidName: 'uuid'
            },
            {
              key: 'partner',
              repo: new StdPartnerRepo(),
              idName: 'partner_id',
              uuidName: 'partner_uuid'
            },
            {
              key: 'supplier',
              repo: new StdSupplierRepo(),
              idName: 'supplier_id',
              uuidName: 'supplier_uuid'
            },
            {
              key: 'order',
              repo: new MatOrderRepo(),
              idName: 'order_id',
              uuidName: 'order_uuid'
            },
          ]);
      }
    if (data.details) { 
      data.details = checkArray(data.details); 
      data.details = await this.getFkId(data.details, 
        [...this.fkIdInfos, 
          {
            key: 'uuid',
            repo: new MatReceiveDetailRepo(),
            idName: 'receive_detail_id',
            uuidName: 'uuid'
          },
          {
            key: 'orderDetail',
            repo: new MatOrderDetailRepo(),
            idName: 'order_detail_id',
            uuidName: 'order_detail_uuid'
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
          {
            key: 'income',
            repo: new MatIncomeRepo(),
            idName: 'income_id',
            uuidName: 'income_uuid'
          },
        ]);
      }

      resultBody.push({ header: data.header, details: data.details });
    }

    return resultBody;
  }

  // 📒 Fn[getIncomeBody]: 입하 데이터 기반 입고 데이터 생성
  /**
   * 입하 데이터 기반 입고 데이터 생성
   * @param _body Request Body
   * @param _regDate 
   * @returns 
   */
  getIncomeBody = async (_body: any, _regDate?: string) => {
    const result: any[] = [];
    const prodRepo = new StdProdRepo();
    const unitConvertRepo = new StdUnitConvertRepo();
    const datas = _body.raws ?? _body;
    
    for await (const data of datas) {
      // 수입검사 진행 항목 PASS
      if (data.insp_fg) { continue; }

      const prod = unsealArray((await prodRepo.readRawByPk(data.prod_id)).raws);
      if (data.unit_id != prod.unit_id) {
        const convertValue = await unitConvertRepo.getConvertValueByUnitId(data.unit_id, prod.unit_id, data.prod_id);
        if (!convertValue) { throw new Error('단위 변환에 실패하였습니다.'); }

        data.qty *= convertValue;
      }

      result.push({
        income_id: data.income_id,
        factory_id: data.factory_id,
        prod_id: data.prod_id,
        reg_date: _regDate ? _regDate : data.reg_date,
        lot_no: data.lot_no,
        qty: data.qty,
        receive_detail_id: data.receive_detail_id,
        to_store_id: data.to_store_id,
        to_location_id: data.to_location_id
      })
    }

    return result;
  }

  // 📒 Fn[updateTotal]: 전표 합계 금액, 수량 계산
  /**
   * 전표 합계 금액, 수량 계산
   * @param _id 수주 전표 Id
   * @param _uuid 수주 전표 Uuid
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

export default MatReceiveCtl;