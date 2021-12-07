import express = require('express');
import IInvStore from '../../interfaces/inv/store.interface';
import SalIncomeRepo from '../../repositories/sal/income.repository';
import InvStoreRepo from '../../repositories/inv/store.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import getStoreBody from '../../utils/getStoreBody';
import getTranTypeCd from '../../utils/getTranTypeCd';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import BaseCtl from '../base.controller';
import isDateFormat from '../../utils/isDateFormat';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';
import config from '../../configs/config';

class SalIncomeCtl extends BaseCtl {
  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(SalIncomeRepo);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'uuid',
        TRepo: SalIncomeRepo,
        idName: 'income_id',
        uuidName: 'uuid'
      },
      {
        key: 'income',
        TRepo: SalIncomeRepo,
        idName: 'income_id',
        uuidName: 'income_uuid'
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
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
      {
        key: 'toStore',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        idAlias: 'to_store_id',
        uuidName: 'to_store_uuid'
      },
      {
        key: 'toLocation',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        idAlias: 'to_location_id',
        uuidName: 'to_location_uuid'
      },
    ];
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new SalIncomeRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { raws: [], count: 0 };

      await sequelize.transaction(async(tran) => {
        // 📌 제품 입고 내역 생성
        const incomeResult = await repo.create(req.body, req.user?.uid as number, tran);

        // 📌 출고 창고 수불 내역 생성
        const fromStoreBody: IInvStore[] = getStoreBody(incomeResult.raws, 'FROM', 'income_id', getTranTypeCd('SAL_INCOME'));
        const fromStoreResult = await storeRepo.create(fromStoreBody, req.user?.uid as number, tran);

        // 📌 입고 창고 수불 내역 생성
        const toStoreBody: IInvStore[] = getStoreBody(incomeResult.raws, 'TO', 'income_id', getTranTypeCd('SAL_INCOME'));
        const toStoreResult = await storeRepo.create(toStoreBody, req.user?.uid as number, tran);

        result.raws.push({
          income: incomeResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws
        });
  
        result.count += incomeResult.count + fromStoreResult.count + toStoreResult.count;
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

  // 📒 Fn[readReport]: 입고현황 데이터 조회
  public readReport = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new SalIncomeRepo(req.tenant.uuid);
      let result: ApiResult<any> = { raws: [], count: 0 };

      const params = Object.assign(req.query, req.params);

      const sort_type = params.sort_type as string;
      if (![ 'store', 'prod', 'date' ].includes(sort_type)) { throw new Error('잘못된 sort_type(정렬) 입력') }

      result = await repo.readReport(params);
      
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
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new SalIncomeRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { raws: [], count: 0 };

      await sequelize.transaction(async(tran) => {
        // 📌 제품 입고 내역 수정
        const incomeResult = await repo.update(req.body, req.user?.uid as number, tran);

        // 📌 출고 창고 수불 내역 수정
        const fromStoreBody: IInvStore[] = getStoreBody(incomeResult.raws, 'FROM', 'income_id', getTranTypeCd('SAL_INCOME'));
        const fromStoreResult = await storeRepo.updateToTransaction(fromStoreBody, req.user?.uid as number, tran);

        // 📌 입고 창고 수불 내역 수정
        const toStoreBody: IInvStore[] = getStoreBody(incomeResult.raws, 'TO', 'income_id', getTranTypeCd('SAL_INCOME'));
        const toStoreResult = await storeRepo.updateToTransaction(toStoreBody, req.user?.uid as number, tran);

        result.raws.push({
          income: incomeResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws
        });
  
        result.count += incomeResult.count + fromStoreResult.count + toStoreResult.count;
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
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new SalIncomeRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { raws: [], count: 0 };

      await sequelize.transaction(async(tran) => {
        // 📌 제품 입고 내역 수정
        const incomeResult = await repo.patch(req.body, req.user?.uid as number, tran);

        // 📌 출고 창고 수불 내역 수정
        const fromStoreBody: IInvStore[] = getStoreBody(incomeResult.raws, 'FROM', 'income_id', getTranTypeCd('SAL_INCOME'));
        const fromStoreResult = await storeRepo.updateToTransaction(fromStoreBody, req.user?.uid as number, tran);

        // 📌 입고 창고 수불 내역 수정
        const toStoreBody: IInvStore[] = getStoreBody(incomeResult.raws, 'TO', 'income_id', getTranTypeCd('SAL_INCOME'));
        const toStoreResult = await storeRepo.updateToTransaction(toStoreBody, req.user?.uid as number, tran);

        result.raws.push({
          income: incomeResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws
        });
  
        result.count += incomeResult.count + fromStoreResult.count + toStoreResult.count;
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
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new SalIncomeRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { raws: [], count: 0 };

      const fromStoreBody: IInvStore[] = getStoreBody(req.body, 'FROM', 'income_id', getTranTypeCd('SAL_INCOME'));
      const toStoreBody: IInvStore[] = getStoreBody(req.body, 'TO', 'income_id', getTranTypeCd('SAL_INCOME'));

      await sequelize.transaction(async(tran) => {
        // 📌 출고 창고 수불 내역 삭제
        const fromStoreResult = await storeRepo.deleteToTransaction(fromStoreBody, req.user?.uid as number, tran);

        // 📌 입고 창고 수불 내역 삭제
        const toStoreResult = await storeRepo.deleteToTransaction(toStoreBody, req.user?.uid as number, tran);

        // 📌 제품 입고 내역 삭제
        const incomeResult = await repo.delete(req.body, req.user?.uid as number, tran);

        result.raws.push({
          income: incomeResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws
        });
  
        result.count += incomeResult.count + fromStoreResult.count + toStoreResult.count;
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
}

export default SalIncomeCtl;