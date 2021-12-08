import express = require('express');
import ApiResult from '../../interfaces/common/api-result.interface';
import IInvStore from '../../interfaces/inv/store.interface';
import InvStoreRepo from '../../repositories/inv/store.repository';
import QmsReworkDisassembleRepo from '../../repositories/qms/rework-disassemble.repository';
import QmsReworkRepo from '../../repositories/qms/rework.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdRejectRepo from '../../repositories/std/reject.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import checkArray from '../../utils/checkArray';
import { getSequelize } from '../../utils/getSequelize';
import getStoreBody from '../../utils/getStoreBody';
import getTranTypeCd from '../../utils/getTranTypeCd';
import isDateFormat from '../../utils/isDateFormat';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import BaseCtl from '../base.controller';
import config from '../../configs/config';

class QmsReworkCtl extends BaseCtl {
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(QmsReworkRepo);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'uuid',
        TRepo: QmsReworkRepo,
        idName: 'rework_id',
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
        key: 'reject',
        TRepo: StdRejectRepo,
        idName: 'reject_id',
        uuidName: 'reject_uuid'
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

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new QmsReworkRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { raws: [], count: 0 };

      await sequelize.transaction(async (tran) => {
        // 📌 재작업 내역 생성
        const reworkResult = await repo.create(req.body, req.user?.uid as number, tran);
        let fromStoreBody: IInvStore[] = [];
        let toStoreBody: IInvStore[] = [];

        // 📌 입고,출고 창고 수불 내역 생성
        reworkResult.raws.forEach((raw: any) => {
          switch (raw.rework_type_cd) {
            case 'REWORK':
              fromStoreBody.push(... getStoreBody(raw, 'FROM', 'rework_id', getTranTypeCd('QMS_REWORK')));
              toStoreBody.push(... getStoreBody(raw, 'TO', 'rework_id', getTranTypeCd('QMS_REWORK')));
              break;
            case 'DISPOSAL':
              fromStoreBody.push(... getStoreBody(raw, 'FROM', 'rework_id', getTranTypeCd('QMS_DISPOSAL')));
              break;
            case 'RETURN':
              fromStoreBody.push(... getStoreBody(raw, 'FROM', 'rework_id', getTranTypeCd('QMS_RETURN')));
              toStoreBody.push(... getStoreBody(raw, 'TO', 'rework_id', getTranTypeCd('QMS_RETURN')));
              break;
          }
        });

        const fromStoreResult = await storeRepo.create(fromStoreBody, req.user?.uid as number, tran);
        const toStoreResult = await storeRepo.create(toStoreBody, req.user?.uid as number, tran);

        result.raws.push({
          rework: reworkResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws
        });

        result.count += reworkResult.count + fromStoreResult.count + toStoreResult.count;
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  //#endregion

  // 📒 Fn[createDisassemble]: Create Disassemble Function
  public createDisassemble = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getBodyIncludedId(req.body);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new QmsReworkRepo(req.tenant.uuid);
      const detailRepo = new QmsReworkDisassembleRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { raws: [], count: 0 };

      await sequelize.transaction(async(tran) => { 
        for await (const data of req.body) {
          let reworkUuid: string;
          let reworkId: number;
          let regDate: string;
          let headerResult: ApiResult<any> = { count: 0, raws: [] };
          let storeBody: IInvStore[] = [];

          data.header[0].rework_type_cd = 'DISASSEMBLE';
          reworkUuid = data.header[0].uuid;

          if (!reworkUuid) {
            headerResult = await repo.create(data.header, req.user?.uid as number, tran);
            reworkId = headerResult.raws[0].rework_id;
            reworkUuid = headerResult.raws[0].uuid;
            regDate = headerResult.raws[0].reg_date;

            // 📌 창고 수불 셋팅
            storeBody = getStoreBody(headerResult.raws, 'FROM', 'rework_id', getTranTypeCd('QMS_DISASSEMBLE'));
          } else {
            reworkId = data.header[0].rework_id;
            regDate = data.raws[0].reg_date;
          }

          data.details = data.details.map((detail: any) => {
            detail.rework_id = reworkId;
            return detail;
          });
          
          // 📌 창고 수불
          const storeResult = await storeRepo.create(storeBody, req.user?.uid as number, tran);

          // 📌 재작업 분해 상세이력 
          const detailResult = await detailRepo.create(data.details, req.user?.uid as number, tran);
          
          let disassembleStoreBody: IInvStore[] = [];
          // 📌 분해 후 입고 창고 수불 내역 생성
          detailResult.raws.forEach((raw: any) => {
            if (raw.income_qty > 0) disassembleStoreBody.push(... getStoreBody(raw, 'TO', 'rework_disassemble_id', getTranTypeCd('QMS_DISASSEMBLE_INCOME'), regDate));
            if (raw.return_qty > 0) disassembleStoreBody.push(... getStoreBody(raw, 'TO', 'rework_disassemble_id', getTranTypeCd('QMS_DISASSEMBLE_RETURN'), regDate));
          });
          
          const disassembleStoreResult = await storeRepo.create(disassembleStoreBody, req.user?.uid as number, tran);
          
          result.raws.push({
            rework: {
              header: headerResult.raws,
              details: detailResult.raws,
            },
            store: storeResult.raws,
            disassembleStore: disassembleStoreResult.raws
          });

          result.count += headerResult.count + detailResult.count + storeResult.count + disassembleStoreResult.count;
        }
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

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
      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);
      
      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new QmsReworkRepo(req.tenant.uuid);
      const detailRepo = new QmsReworkDisassembleRepo(req.tenant.uuid);
      const storeRepo = new InvStoreRepo(req.tenant.uuid);
      let result: ApiResult<any> = { raws: [], count: 0 };

      let fromStoreBody: IInvStore[] = [];
      let toStoreBody: IInvStore[] = [];

      // 📌 재작업 분해 상세이력 삭제를 위한 변수
      let disassembleStoreBody: IInvStore[] = [];
      let disassembleStoreResult = { raws: {}, count: 0 };
      let disassembleResult = { raws: {}, count: 0 };
      let reworkIds: string[] = [];

      await sequelize.transaction(async (tran) => {
        req.body.forEach((body: any) => {
          switch(body.rework_type_cd) {
            case 'REWORK':
              fromStoreBody.push(... getStoreBody(body, 'FROM', 'rework_id', getTranTypeCd('QMS_REWORK')));
              toStoreBody.push(... getStoreBody(body, 'TO', 'rework_id', getTranTypeCd('QMS_REWORK')));
              break;
            case 'DISPOSAL':
              fromStoreBody.push(... getStoreBody(body, 'FROM', 'rework_id', getTranTypeCd('QMS_DISPOSAL')));
              break;
            case 'RETURN':
              fromStoreBody.push(... getStoreBody(body, 'FROM', 'rework_id', getTranTypeCd('QMS_RETURN')));
              toStoreBody.push(... getStoreBody(body, 'TO', 'rework_id', getTranTypeCd('QMS_RETURN')));
              break;
            case 'DISASSEMBLE':
              fromStoreBody.push(... getStoreBody(body, 'FROM', 'rework_id', getTranTypeCd('QMS_DISASSEMBLE')));
              reworkIds.push(body.rework_id);
              break;
          }
        });

        if (reworkIds.length > 0) {
          const disassembleRaws = await detailRepo.readRawsByReworkIds(reworkIds);

          // 📌 분해 후 입고 창고 수불 내역 및 분해 이력 삭제
          disassembleRaws.raws.forEach((raw: any) => {
            if (raw.income_qty > 0) disassembleStoreBody.push(... getStoreBody(raw, 'TO', 'rework_disassemble_id', getTranTypeCd('QMS_DISASSEMBLE_INCOME')));
            if (raw.return_qty > 0) disassembleStoreBody.push(... getStoreBody(raw, 'TO', 'rework_disassemble_id', getTranTypeCd('QMS_DISASSEMBLE_RETURN')));
          });

          disassembleStoreResult = await storeRepo.deleteToTransaction(disassembleStoreBody, req.user?.uid as number, tran);
          disassembleResult = await detailRepo.deleteByReworkId(disassembleRaws.raws, req.user?.uid as number, reworkIds, tran);
        }

        // 📌 출고 창고 수불 내역 삭제
        const fromStoreResult = await storeRepo.deleteToTransaction(fromStoreBody, req.user?.uid as number, tran);

        // 📌 입고 창고 수불 내역 삭제
        const toStoreResult = await storeRepo.deleteToTransaction(toStoreBody, req.user?.uid as number, tran);

        // 📌 재작업 내역 삭제
        const reworkResult = await repo.delete(req.body, req.user?.uid as number, tran);

        result.raws.push({
          rework: reworkResult.raws,
          fromStore: fromStoreResult.raws,
          toStore: toStoreResult.raws,
          disassemble: disassembleResult.raws,
          disassembleStore: disassembleStoreResult.raws,
        });

        result.count += reworkResult.count + fromStoreResult.count + toStoreResult.count + disassembleResult.count + disassembleStoreResult.count;
      });

      return response(res, result.raws, { count: result.count }, '', 200);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  //#endregion

  //#endregion

  //#region ✅ Inherited Hooks

  //#region 🔵 Read Hooks

  // 📒 Fn[beforeRead] (✅ Inheritance): Read DB Tasking 이 실행되기 전 호출되는 Function
  beforeRead = async(req: express.Request) => {
    if (!isDateFormat(req.query.start_date)) { throw new Error('잘못된 start_date(기준시작일자) 입력') };
    if (!isDateFormat(req.query.end_date)) { throw new Error('잘못된 end_date(기준종료일자) 입력') };
  }

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
          [...this.fkIdInfos ]);
      }
    if (data.details) { 
      data.details = checkArray(data.details); 
      data.details = await this.getFkId(data.details, 
        [
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
        ]);
      }

      resultBody.push({ header: data.header, details: data.details });
    }

    return resultBody;
  }

  //#endregion

}

export default QmsReworkCtl;