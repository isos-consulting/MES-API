import express = require('express');
import ApiResult from '../../interfaces/common/api-result.interface';
import InvMoveRepo from '../../repositories/inv/move.repository';
import InvStoreRepo from '../../repositories/inv/store.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import { getSequelize } from '../../utils/getSequelize';
import getStoreBody from '../../utils/getStoreBody';
import getTranTypeCd from '../../utils/getTranTypeCd';
import isDateFormat from '../../utils/isDateFormat';
import isUuid from '../../utils/isUuid';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import BaseCtl from '../base.controller';
import config from '../../configs/config';

class InvMoveCtl extends BaseCtl {
  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(InvMoveRepo);

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
        TRepo: InvMoveRepo,
        idName: 'move_id',
        uuidName: 'uuid'
      },
      {
        key: 'move',
        TRepo: InvMoveRepo,
        idName: 'move_id',
        uuidName: 'move_uuid'
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
      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new InvMoveRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      let moveResult: ApiResult<any> = { count: 0, raws: [] };
      let storeResult: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => {
        // 📌 재고 이동 내역 생성
        moveResult = await repo.create(req.body, req.user?.uid as number, tran);

        // 📌 입출고 창고 수불 내역 생성
        const fromStoreBody = getStoreBody(moveResult.raws, 'FROM', 'move_id', getTranTypeCd('INV_MOVE'));
        const toStoreBody = getStoreBody(moveResult.raws, 'TO', 'move_id', getTranTypeCd('INV_MOVE'));
        const storeBody = [...fromStoreBody, ...toStoreBody];
        storeResult = await storeRepo.create(storeBody, req.user?.uid as number, tran);
      });

      result.raws.push({ move: moveResult.raws, store: storeResult.raws });
      result.count += moveResult.count + storeResult.count;
      
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

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new InvMoveRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      let moveResult: ApiResult<any> = { raws: [], count: 0 };
      let storeResult: ApiResult<any> = { raws: [], count: 0 };

      await sequelize.transaction(async(tran) => {
        // 📌 재고 이동 내역 수정
        moveResult = await repo.update(req.body, req.user?.uid as number, tran);

        // 📌 입출고 창고 수불 내역 수정
        const fromStoreBody = getStoreBody(moveResult.raws, 'FROM', 'move_id', getTranTypeCd('INV_MOVE'));
        const toStoreBody = getStoreBody(moveResult.raws, 'TO', 'move_id', getTranTypeCd('INV_MOVE'));
        const storeBody = [...fromStoreBody, ...toStoreBody];
        storeResult = await storeRepo.updateToTransaction(storeBody, req.user?.uid as number, tran);
      });

      result.raws.push({ move: moveResult.raws, store: storeResult.raws });
      result.count += moveResult.count + storeResult.count;
      
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
      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new InvMoveRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      let moveResult: ApiResult<any> = { raws: [], count: 0 };
      let storeResult: ApiResult<any> = { raws: [], count: 0 };

      await sequelize.transaction(async(tran) => {
        // 📌 재고 이동 내역 수정
        moveResult = await repo.patch(req.body, req.user?.uid as number, tran);

        // 📌 입출고 창고 수불 내역 수정
        const fromStoreBody = getStoreBody(moveResult.raws, 'FROM', 'move_id', getTranTypeCd('INV_MOVE'));
        const toStoreBody = getStoreBody(moveResult.raws, 'TO', 'move_id', getTranTypeCd('INV_MOVE'));
        const storeBody = [...fromStoreBody, ...toStoreBody];
        storeResult = await storeRepo.updateToTransaction(storeBody, req.user?.uid as number, tran);
      });

      result.raws.push({ move: moveResult.raws, store: storeResult.raws });
      result.count += moveResult.count + storeResult.count;
      
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
      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new InvMoveRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      let moveResult: ApiResult<any> = { raws: [], count: 0 };
      let storeResult: ApiResult<any> = { raws: [], count: 0 };

      const fromStoreBody = getStoreBody(req.body, 'FROM', 'move_id', getTranTypeCd('INV_MOVE'));
      const toStoreBody = getStoreBody(req.body, 'TO', 'move_id', getTranTypeCd('INV_MOVE'));
      const storeBody = [...fromStoreBody, ...toStoreBody];

      await sequelize.transaction(async(tran) => {
        // 📌 입출고 창고 수불 내역 삭제
        storeResult = await storeRepo.deleteToTransaction(storeBody, req.user?.uid as number, tran);

        // 📌 재고 이동 내역 삭제
        moveResult = await repo.delete(req.body, req.user?.uid as number, tran);
      });

      result.raws.push({ move: moveResult.raws, store: storeResult.raws });
      result.count += moveResult.count + storeResult.count;
      
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
    if (isUuid(req.params.uuid)) { return; }

    if (!isDateFormat(req.query.start_date)) { throw new Error('잘못된 start_date(기준시작일자) 입력') };
    if (!isDateFormat(req.query.end_date)) { throw new Error('잘못된 end_date(기준종료일자) 입력') };
  }

  // 📒 Fn[afterRead]: Read DB Tasking 이 실행된 후 호출되는 Function
  // afterRead = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#endregion
}

export default InvMoveCtl;