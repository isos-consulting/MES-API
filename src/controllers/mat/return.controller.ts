import express = require('express');
import { Transaction } from 'sequelize/types';
import ApiResult from '../../interfaces/common/api-result.interface';
import sequelize from '../../models';
import InvStoreRepo from '../../repositories/inv/store.repository';
import MatReceiveDetailRepo from '../../repositories/mat/receive-detail.repository';
import MatReceiveRepo from '../../repositories/mat/receive.repository';
import MatReturnDetailRepo from '../../repositories/mat/return-detail.repository';
import MatReturnRepo from '../../repositories/mat/return.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdMoneyUnitRepo from '../../repositories/std/money-unit.repository';
import StdPartnerRepo from '../../repositories/std/partner.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import StdSupplierRepo from '../../repositories/std/supplier.repository';
import StdUnitRepo from '../../repositories/std/unit.repository';
import checkArray from '../../utils/checkArray';
import convertToReportRaws from '../../utils/convertToReportRaws';
import getStoreBody from '../../utils/getStoreBody';
import getTranTypeCd from '../../utils/getTranTypeCd';
import isDateFormat from '../../utils/isDateFormat';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import unsealArray from '../../utils/unsealArray';
import AdmPatternHistoryCtl from '../adm/pattern-history.controller';
import BaseCtl from '../base.controller';

class MatReturnCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  repo: MatReturnRepo;
  detailRepo: MatReturnDetailRepo;
  storeRepo: InvStoreRepo;

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(new MatReturnRepo());
    this.detailRepo = new MatReturnDetailRepo();
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
        repo: new MatReturnRepo(),
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

      // create 할 때는 store 확인하면 되는데
      // update 할 때는 추가로 더 있는지를 확인해야 하는데..
      // 그게 아니라 아예 삭제를 했다가 다시 넣어야 하나?
      // 어차피 창고는 못바꾸니까 위치도 그러면 수정할거랑 차이 구해서 그만큼이 있는지를 확인해야 하는거지
      // 마찬가지로 트랜잭션 밖에서 할 수 있긴함
      // 근데 수량 관련한거는 트랜잭션 안에서 해야 될 것 같은데
      // 인터락 걸린 상태에서 통과 했는데 그 사이에 누가 넣으면???
      // 근데 창고에 데이터 들어갈 때 그냥 조건 걸어버리면?
      // group by 해서 관리 범위까지 해서 훅을 걸어버리면?
      // 관리 범위가 그럼 어디까진지 어떻게 알지? 관리범위가 무조건 같나?
      // 어쩔때는 lot 안 볼 수도 있는데
      // 그럼 창고에서 거는거는 무리수 인가?
      // 그럼 그냥 트랜잭션 안에서 걸자 그게 맞는것 같다. (건바이건으로)

      // factory, prod, qty, lot, store, location  를 넣어서 하는 걸로
      // update 에서 사용할 때 수량을 줄일 때는 타지 말고
      // 수량을 늘릴 때만 수량의 차이만큼만 있는지 검사하면 된다.

      // 1. Interlock 형태의 데이터로 만들어 주는거
      // 2. Interlock Function

      // 수불할 데이터 중 같은 데이터가 있으면 GroupBy 도 해야하고..
      // 여러개면 거기서 차감하는 방식으로 해서 0 이 되면 막아야 되는 느낌이라..
      // 제일 좋은거는 수불 하면서 0 을 파악하는건데
      // 화면마다 관리범위가 다를 경우는 어떻게하지?

      // ✅ 현재로서는 이게 제일 좋은 방안 같음
      // ✅ 뷰 만들어서 관리해야 하나?? 트랜잭션별로 관리범위를 어디까지 가져갈지??
      // ✅ 그냥 수불 시켜버리고 관리범위 안에서 - 재고 있으면 인터락 걸까..

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          let returnUuid: string;
          let returnId: number;
          let maxSeq: number;
          let headerResult: ApiResult<any>;
          const header = data.header[0];

          returnUuid = header.uuid;

          if (!returnUuid) {
            // 📌 전표번호가 수기 입력되지 않고 자동발행 Option일 경우 번호 자동발행
            if (!header.stmt_no) { 
              header.stmt_no = await new AdmPatternHistoryCtl().getPattern({
                factory_id: header.factory_id,
                table_nm: 'MAT_RETURN_TB',
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

          // convert_value와 반출수량을 곱한 것이 수불 되야 하는 qty
          // ❗ 잔여 재고 수량 Interlock
          // const interlockBody = data.details.map((detail: any) => {
          //   return {
          //     factory_uuid: detail.factory_uuid,
          //     prod_uuid: detail.prod_uuid,
          //     qty: detail.qty,
          //     lot_no: detail.lot_no,
          //     store_uuid: detail.from_store_uuid,
          //     location_uuid: detail.from_location_uuid
          //   }
          // });

          // for await (const data of interlockBody) {
          //   if (data.lot_no && data.store_id && data.location_id) {
          //     const abc = await this.storeRepo.readGroupedAll(data, 'return');
          //   }
          // }

          // 📌 자재 반출
          const detailResult = await this.detailRepo.create(data.details, req.user?.uid as number, tran);
          headerResult = await this.updateTotal(returnId, returnUuid, req.user?.uid as number, tran);

          // 📌 자재 반출 수량에 단위 변환 값(협력사 단가 단위 -> 품목 재고 단위) 적용
          detailResult.raws.map((detail: any) => { 
            detail.qty *= detail.convert_value;
            return detail;
          });

          // 📌 창고 수불
          const storeBody = getStoreBody(detailResult.raws, 'FROM', 'return_detail_id', getTranTypeCd('MAT_RETURN'), headerResult.raws[0].reg_date);
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

  // 📒 Fn[readIncludeDetails]: 반출 데이터의 Header + Detail 함께 조회
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

  // 📒 Fn[readDetails]: 반출 데이터의 Detail 조회
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

  // 📒 Fn[readReport]: 반출현황 데이터 조회
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

          // 📌 반출 데이터 수정
          await this.repo.update(data.header, req.user?.uid as number, tran);
          const detailResult = await this.detailRepo.update(data.details, req.user?.uid as number, tran);
          const headerResult = await this.updateTotal(data.header[0].return_id, data.header[0].uuid, req.user?.uid as number, tran);

          // 📌 자재 반출 수량에 단위 변환 값(협력사 단가 단위 -> 품목 재고 단위) 적용
          detailResult.raws.map((detail: any) => { 
            detail.qty *= detail.convert_value;
            return detail;
          });

          // 📌 수불 데이터 수정
          const storeBody = getStoreBody(detailResult.raws, 'FROM', 'return_detail_id', getTranTypeCd('MAT_RETURN'));
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

          // 📌 반출 데이터 수정
          await this.repo.patch(data.header, req.user?.uid as number, tran);
          const detailResult = await this.detailRepo.patch(data.details, req.user?.uid as number, tran);
          const headerResult = await this.updateTotal(data.header[0].return_id, data.header[0].uuid, req.user?.uid as number, tran);

          // 📌 자재 반출 수량에 단위 변환 값(협력사 단가 단위 -> 품목 재고 단위) 적용
          detailResult.raws.map((detail: any) => { 
            detail.qty *= detail.convert_value;
            return detail;
          });

          // 📌 수불 데이터 수정
          const storeBody = getStoreBody(detailResult.raws, 'FROM', 'return_detail_id', getTranTypeCd('MAT_RETURN'));
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
              inout_fg: false,
              tran_cd: getTranTypeCd('MAT_RETURN'),
            };
          });

          // 📌 수불 내역 삭제
          const storeResult = await this.storeRepo.deleteToTransaction(deleteBody, req.user?.uid as number, tran);

          // 📌 반출 내역 삭제
          const detailResult = await this.detailRepo.delete(data.details, req.user?.uid as number, tran);
          const count = await this.detailRepo.getCount(data.header[0].return_id, tran);

          let headerResult: ApiResult<any>;
          if (count == 0) {
            headerResult = await this.repo.delete(data.header, req.user?.uid as number, tran);
          } else {
            headerResult = await this.updateTotal(data.header[0].return_id, data.header[0].uuid, req.user?.uid as number, tran);
          }

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
              repo: new MatReturnRepo(),
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
              key: 'supplier',
              repo: new StdSupplierRepo(),
              idName: 'supplier_id',
              uuidName: 'supplier_uuid'
            },
            {
              key: 'receive',
              repo: new MatReceiveRepo(),
              idName: 'receive_id',
              uuidName: 'receive_uuid'
            },
          ]);
      }
    if (data.details) { 
      data.details = checkArray(data.details); 
      data.details = await this.getFkId(data.details, 
        [...this.fkIdInfos, 
          {
            key: 'uuid',
            repo: new MatReturnDetailRepo(),
            idName: 'return_detail_id',
            uuidName: 'uuid'
          },
          {
            key: 'returnDetail',
            repo: new MatReturnDetailRepo(),
            idName: 'return_detail_id',
            uuidName: 'return_detail_uuid'
          },
          {
            key: 'receiveDetail',
            repo: new MatReceiveDetailRepo(),
            idName: 'receive_detail_id',
            uuidName: 'receive_detail_uuid'
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
   * @param _id 반출 전표 Id
   * @param _uuid 반출 전표 Uuid
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

export default MatReturnCtl;