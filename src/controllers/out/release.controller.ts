import { Transaction } from 'sequelize/types';
import * as express from 'express';
import checkArray from '../../utils/checkArray';
import BaseCtl from '../base.controller';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import OutReleaseRepo from '../../repositories/out/release.repository';
import OutReleaseDetailRepo from '../../repositories/out/release-detail.repository';
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
import MatOrderDetailRepo from '../../repositories/mat/order-detail.repository';
import ApiResult from '../../interfaces/common/api-result.interface';
import unsealArray from '../../utils/unsealArray';
import AdmPatternHistoryCtl from '../adm/pattern-history.controller';
import isDateFormat from '../../utils/isDateFormat';
import { getSequelize } from '../../utils/getSequelize';
import config from '../../configs/config';

class OutReleaseCtl extends BaseCtl {
  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(OutReleaseRepo);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽출하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'release',
        TRepo: OutReleaseRepo,
        idName: 'release_id',
        uuidName: 'release_uuid'
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
      const repo = new OutReleaseRepo(req.tenant.uuid);
      const detailRepo = new OutReleaseDetailRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          let releaseUuid: string;
          let releaseId: number;
          let regDate: string;
          let maxSeq: number;
          let headerResult: ApiResult<any>;
          const header = unsealArray(data.header);

          releaseUuid = header.uuid;

          if (!releaseUuid) {
            // 📌 전표번호가 수기 입력되지 않고 자동발행 Option일 경우 번호 자동발행
            if (!header.stmt_no) { 
              header.stmt_no = await new AdmPatternHistoryCtl().getPattern({
                tenant: req.tenant.uuid,
                factory_id: header.factory_id,
                table_nm: 'OUT_RELEASE_TB',
                col_nm: 'stmt_no',
                reg_date: header.reg_date,
                partner_uuid: header.partner_uuid,
                uid: req.user?.uid as number,
                tran: tran
              });
            }

            headerResult = await repo.create(data.header, req.user?.uid as number, tran);
            releaseId = headerResult.raws[0].release_id;
            regDate = headerResult.raws[0].reg_date;
            releaseUuid = headerResult.raws[0].uuid;

            maxSeq = 0;
          } else {
            releaseId = header.release_id;
            regDate = header.reg_date;

            // 📌 Max Seq 계산
            maxSeq = await detailRepo.getMaxSeq(releaseId, tran) as number;
          }

          data.details = data.details.map((detail: any) => {
            detail.release_id = releaseId;
            detail.seq = ++maxSeq;
            detail.total_price = detail.qty * detail.price * detail.exchange; 
            return detail;
          });

          // 📌 출하 데이터 생성
          const detailResult = await detailRepo.create(data.details, req.user?.uid as number, tran);
          headerResult = await this.updateTotal(req.tenant.uuid, releaseId, releaseUuid, req.user?.uid as number, tran);

          // 📌 수불 데이터 생성
          const storeBody = getStoreBody(detailResult.raws, 'FROM', 'release_detail_id', getTranTypeCd('OUT_RELEASE'), regDate);
          const storeResult = await storeRepo.create(storeBody, req.user?.uid as number, tran);

          result.raws.push({
            release: {
              header: headerResult.raws,
              details: detailResult.raws,
            },
            store: storeResult.raws
          });

          result.count += headerResult.count + detailResult.count + storeResult.count;
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

  // 📒 Fn[readIncludeDetails]: 출고 데이터의 Header + Detail 함께 조회
  public readIncludeDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new OutReleaseRepo(req.tenant.uuid);
      const detailRepo = new OutReleaseDetailRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      const params = Object.assign(req.query, req.params);
      params.release_uuid = params.uuid;

      const headerResult = await repo.readByUuid(params.release_uuid);
      const detailsResult = await detailRepo.read(params);

      result.raws = [{ header: unsealArray(headerResult.raws), details: detailsResult.raws }];
      result.count = headerResult.count + detailsResult.count;
      
      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readDetails]: 출고 데이터의 Detail 조회
  public readDetails = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const detailRepo = new OutReleaseDetailRepo(req.tenant.uuid);

      const params = Object.assign(req.query, req.params);
      params.release_uuid = params.uuid;

      const result = await detailRepo.read(params);
      
      return response(res, result.raws, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[readReport]: 출고현황 데이터 조회
  public readReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new OutReleaseRepo(req.tenant.uuid);

      const params = Object.assign(req.query, req.params);

      const sort_type = params.sort_type as string;
      if (![ 'partner', 'prod', 'date' ].includes(sort_type)) { throw new Error('잘못된 sort_type(정렬) 입력') }

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
      req.body = await this.getBodyIncludedId(req.tenant.uuid, req.body);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new OutReleaseRepo(req.tenant.uuid);
      const detailRepo = new OutReleaseDetailRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          data.details = data.details.map((detail: any) => {
            detail.total_price = detail.qty * detail.price * detail.exchange; 
            return detail;
          });

          // 📌 출하 데이터 수정
          await repo.update(data.header, req.user?.uid as number, tran);
          const detailResult = await detailRepo.update(data.details, req.user?.uid as number, tran);
          const headerResult = await this.updateTotal(req.tenant.uuid, data.header[0].release_id, data.header[0].uuid, req.user?.uid as number, tran);

          // 📌 수불 데이터 수정
          const storeBody = getStoreBody(detailResult.raws, 'FROM', 'release_detail_id', getTranTypeCd('OUT_RELEASE'));
          const storeResult = await storeRepo.updateToTransaction(storeBody, req.user?.uid as number, tran);

          result.raws.push({
            release: {
              header: headerResult.raws,
              details: detailResult.raws,
            },
            store: storeResult.raws
          });

          result.count += headerResult.count + detailResult.count + storeResult.count;
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
      const repo = new OutReleaseRepo(req.tenant.uuid);
      const detailRepo = new OutReleaseDetailRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          data.details = data.details.map((detail: any) => {
            detail.total_price = detail.qty * detail.price * detail.exchange; 
            return detail;
          });

          // 📌 출하 데이터 수정
          await repo.patch(data.header, req.user?.uid as number, tran);
          const detailResult = await detailRepo.patch(data.details, req.user?.uid as number, tran);
          const headerResult = await this.updateTotal(req.tenant.uuid, data.header[0].release_id, data.header[0].uuid, req.user?.uid as number, tran);

          // 📌 수불 데이터 수정
          const storeBody = getStoreBody(detailResult.raws, 'FROM', 'release_detail_id', getTranTypeCd('OUT_RELEASE'));
          const storeResult = await storeRepo.updateToTransaction(storeBody, req.user?.uid as number, tran);

          result.raws.push({
            release: {
              header: headerResult.raws,
              details: detailResult.raws,
            },
            store: storeResult.raws
          });

          result.count += headerResult.count + detailResult.count + storeResult.count;
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
      const repo = new OutReleaseRepo(req.tenant.uuid);
      const detailRepo = new OutReleaseDetailRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          const deleteBody = data.details.map((data: any) => {
            return {
              tran_id: data.release_detail_id,
              inout_fg: false,
              tran_cd: getTranTypeCd('OUT_RELEASE'),
            };
          });      
          // 📌 수불 내역 삭제
          const storeResult = await storeRepo.deleteToTransaction(deleteBody, req.user?.uid as number, tran);
          // 📌 출하 내역 삭제
          const detailResult = await detailRepo.delete(data.details, req.user?.uid as number, tran);
          const count = await detailRepo.getCount(data.header[0].release_id, tran);

          let headerResult: ApiResult<any>;
          if (count == 0) {
            headerResult = await repo.delete(data.header, req.user?.uid as number, tran);
          } else {
            headerResult = await this.updateTotal(req.tenant.uuid, data.header[0].release_id, data.header[0].uuid, req.user?.uid as number, tran);
          }

          result.raws.push({
            release: {
              header: headerResult.raws,
              details: detailResult.raws,
            },
            store: storeResult.raws
          });

          result.count += headerResult.count + detailResult.count + storeResult.count;
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
        data.header = await this.getFkId(tenant, data.header, 
          [...this.fkIdInfos, 
            {
              key: 'uuid',
              TRepo: OutReleaseRepo,
              idName: 'release_id',
              uuidName: 'uuid'
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
          ]);
      }
    if (data.details) { 
      data.details = checkArray(data.details); 
      data.details = await this.getFkId(tenant, data.details, 
        [...this.fkIdInfos, 
          {
            key: 'uuid',
            TRepo: OutReleaseDetailRepo,
            idName: 'release_detail_id',
            uuidName: 'uuid'
          },
          {
            key: 'prod',
            TRepo: StdProdRepo,
            idName: 'prod_id',
            uuidName: 'prod_uuid'
          },
          {
            key: 'moneyUnit',
            TRepo: StdMoneyUnitRepo,
            idName: 'money_unit_id',
            uuidName: 'money_unit_uuid'
          },
          {
            key: 'orderDetail',
            TRepo: MatOrderDetailRepo,
            idName: 'order_detail_id',
            uuidName: 'order_detail_uuid'
          },
          {
            key: 'fromStore',
            TRepo: StdStoreRepo,
            idName: 'store_id',
            idAlias: 'from_store_id',
            uuidName: 'from_store_uuid'
          },
          {
            key: 'fromLocation',
            TRepo: StdLocationRepo,
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
  updateTotal = async (tenant: string, _id: number, _uuid: string, _uid: number, _transaction?: Transaction) => {
    const repo = new OutReleaseRepo(tenant);
    const detailRepo = new OutReleaseDetailRepo(tenant);

    const getTotals = await detailRepo.getTotals(_id, _transaction);
    const totalQty = getTotals?.totalQty;
    const totalPrice = getTotals?.totalPrice;

    const result = await repo.patch(
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

export default OutReleaseCtl;