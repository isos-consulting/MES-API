import express = require('express');
import ApiResult from '../../interfaces/common/api-result.interface';
import IInvStore from '../../interfaces/inv/store.interface';
import InvStoreRepo from '../../repositories/inv/store.repository';
import QmsReworkDisassembleRepo from '../../repositories/qms/rework-disassemble.repository';
import QmsReworkRepo from '../../repositories/qms/rework.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import { getSequelize } from '../../utils/getSequelize';
import getStoreBody from '../../utils/getStoreBody';
import getTranTypeCd from '../../utils/getTranTypeCd';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import BaseCtl from '../base.controller';
import config from '../../configs/config';

class QmsReworkDisassembleCtl extends BaseCtl {
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(QmsReworkDisassembleRepo);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'uuid',
        TRepo: QmsReworkDisassembleRepo,
        idName: 'rework_disassemble_id',
        uuidName: 'rework_disassemble_uuid'
      },
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'rework',
        TRepo: QmsReworkRepo,
        idName: 'rework_id',
        uuidName: 'rework_uuid'
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'incomeStore',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        idAlias: 'income_store_id',
        uuidName: 'income_store_uuid'
      },
      {
        key: 'incomeLocation',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        idAlias: 'income_location_id',
        uuidName: 'income_location_uuid'
      },
      {
        key: 'returnStore',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        idAlias: 'return_store_id',
        uuidName: 'return_store_uuid'
      },
      {
        key: 'returnLocation',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        idAlias: 'return_location_id',
        uuidName: 'return_location_uuid'
      },
    ];
  };

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new QmsReworkDisassembleRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { raws: [], count: 0 };

      await sequelize.transaction(async (tran) => {
        // 📌 재작업 내역 생성
        const reworkDisassembleResult = await repo.create(req.body, req.user?.uid as number, tran);
        let disassembleStoreBody: IInvStore[] = [];

        // 📌 분해 후 입고 창고 수불 내역 생성
        reworkDisassembleResult.raws.forEach((raw: any) => {
          disassembleStoreBody.push(... getStoreBody(raw, 'TO', 'rework_disassemble_id', getTranTypeCd('QMS_DISASSEMBLE_INCOME')));
          disassembleStoreBody.push(... getStoreBody(raw, 'TO', 'rework_disassemble_id', getTranTypeCd('QMS_DISASSEMBLE_RETURN')));
        });

        const disassembleStoreResult = await storeRepo.create(disassembleStoreBody, req.user?.uid as number, tran);

        result.raws.push({
          rework: reworkDisassembleResult.raws,
          disassembleStore: disassembleStoreResult.raws,
        });

        result.count += reworkDisassembleResult.count + disassembleStoreResult.count;
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  //#endregion

  //#region 🔵 Read Functions

  // 📒 Fn[read] (✅ Inheritance): Default Read Function
  // public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

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
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new QmsReworkDisassembleRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { raws: [], count: 0 };

      let disassembleStoreBody: IInvStore[] = [];
      
      req.body.forEach((body: any) => {
        disassembleStoreBody.push(... getStoreBody(body, 'TO', 'rework_disassemble_id', getTranTypeCd('QMS_DISASSEMBLE_INCOME')));
        disassembleStoreBody.push(... getStoreBody(body, 'TO', 'rework_disassemble_id', getTranTypeCd('QMS_DISASSEMBLE_RETURN')));
      });

      await sequelize.transaction(async (tran) => {
        // 📌 분해 후 입고 창고 수불 내역 삭제
        const disassembleStoreResult = await storeRepo.deleteToTransaction(disassembleStoreBody, req.user?.uid as number, tran);

        // 📌 재작업 분해 출고 내역 삭제
        const reworkDisassembleResult = await repo.delete(req.body, req.user?.uid as number, tran);

        result.raws.push({
          reworkDisassemble: reworkDisassembleResult.raws,
          disassembleStore: disassembleStoreResult.raws,
        });

        result.count += reworkDisassembleResult.count + disassembleStoreResult.count;
      });

      return response(res, result.raws, { count: result.count }, '', 200);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  //#endregion

  //#endregion

  //#region ✅ Inherited Hooks

  //#region 🟢 Create Hooks

  // 📒 Fn[beforeCreate] (✅ Inheritance): Create Transaction 이 실행되기 전 호출되는 Function
  // beforeCreate = async(req: express.Request) => {}

  // 📒 Fn[beforeTranCreate] (✅ Inheritance): Create Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranCreate = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranCreate] (✅ Inheritance): Create Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranCreate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterCreate] (✅ Inheritance): Create Transaction 이 실행된 후 호출되는 Function
  // afterCreate = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🔵 Read Hooks

  // 📒 Fn[beforeRead] (✅ Inheritance): Read DB Tasking 이 실행되기 전 호출되는 Function
  // beforeRead = async(req: express.Request) => {}

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

export default QmsReworkDisassembleCtl;