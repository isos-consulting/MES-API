import * as express from 'express';
import response from '../utils/response';
import checkArray from '../utils/checkArray';
import testErrorHandlingHelper from '../utils/testErrorHandlingHelper';
import { Sequelize, Transaction } from 'sequelize/types';
import ApiResult from '../interfaces/common/api-result.interface';
import unsealArray from '../utils/unsealArray';
import isUuid from '../utils/isUuid';
import { sequelizes } from '../utils/getSequelize';
import config from '../configs/config';

type getFkIdHelper = {
  info: getFkIdInfo,
  set: Set<string>,
  read: ApiResult<any>,
  map: Map<string, number>
}

type getFkIdInfo = {
  key: string,
  uuidName: string,
  idName: string,
  idAlias?: string,
  TRepo: any,
}

class BaseCtl {
  fkIdInfos: getFkIdInfo[];
  TRepo?: any

  constructor(TRepo: any) {
    this.TRepo = TRepo;
  }

  //#region ⚫ Hooks
  /**
   * 🟢 Create Hooks
   * 🔵 Read Hooks
   * 🟡 Update Hooks
   * 🟠 Patch Hooks
   * 🔴 Delete Hooks
   */

  /**
    * 🟢 Create Transaction 이 실행되기 전 호출되는 Function
    * @param req Request
    */
  beforeCreate = async(req: express.Request) => {}

  /**
    * 🟢 Create Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
    * @param req Request 
    * @param tran Transaction
    */
  beforeTranCreate = async(req: express.Request, tran: Transaction) => {}

  /**
    * 🟢 Create Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
    * @param req Request 
    * @param result Response Result
    * @param tran Transaction
    */
  afterTranCreate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  /**
    * 🟢 Create Transaction 이 실행된 후 호출되는 Function
    * @param req Request 
    * @param result Response Result
    */
  afterCreate = async(req: express.Request, result: ApiResult<any>) => {}
  
  /**
    * 🔵 Read DB Tasking 이 실행되기 전 호출되는 Function
    * @param req Request
    */
  beforeRead = async(req: express.Request) => {}

  /**
    * 🔵 Read DB Tasking 이 실행된 후 호출되는 Function
    * @param req Request 
    * @param result Response Result
    */
  afterRead = async(req: express.Request, result: ApiResult<any>) => {}

  /**
    * 🟡 Update Transaction 이 실행되기 전 호출되는 Function
    * @param req Request
    */
  beforeUpdate = async(req: express.Request) => {}

  /**
    * 🟡 Update Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
    * @param req Request 
    * @param tran Transaction
    */
  beforeTranUpdate = async(req: express.Request, tran: Transaction) => {}

  /**
    * 🟡 Update Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
    * @param req Request 
    * @param result Response Result
    * @param tran Transaction
    */
  afterTranUpdate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  /**
    * 🟡 Update Transaction 이 실행된 후 호출되는 Function
    * @param req Request 
    * @param result Response Result
    */
  afterUpdate = async(req: express.Request, result: ApiResult<any>) => {}

  /**
    * 🟠 Patch Transaction 이 실행되기 전 호출되는 Function
    * @param req Request
    */
  beforePatch = async(req: express.Request) => {}

  /**
    * 🟠 Patch Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
    * @param req Request 
    * @param tran Transaction
    */
  beforeTranPatch = async(req: express.Request, tran: Transaction) => {}

  /**
    * 🟠 Patch Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
    * @param req Request 
    * @param result Response Result
    * @param tran Transaction
    */
  afterTranPatch = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  /**
    * 🟠 Patch Transaction 이 실행된 후 호출되는 Function
    * @param req Request 
    * @param result Response Result
    */
  afterPatch = async(req: express.Request, result: ApiResult<any>) => {}

  /**
    * 🔴 Delete Transaction 이 실행되기 전 호출되는 Function
    * @param req Request
    */
  beforeDelete = async(req: express.Request) => {}

  /**
    * 🔴 Delete Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
    * @param req Request 
    * @param tran Transaction
    */
  beforeTranDelete = async(req: express.Request, tran: Transaction) => {}

  /**
    * 🔴 Delete Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
    * @param req Request 
    * @param result Response Result
    * @param tran Transaction
    */
  afterTranDelete = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  /**
    * 🔴 Delete Transaction 이 실행된 후 호출되는 Function
    * @param req Request 
    * @param result Response Result
    */
  afterDelete = async(req: express.Request, result: ApiResult<any>) => {}
  //#endregion

  /**
    * 🟣 CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입
    * @param body Request Body
    */
  getFkId = async(tenant: string, body: any, info?: getFkIdInfo[]) => {
    body = checkArray(body);
    if (!info) { return body; }

    const helpers: Map<string, getFkIdHelper> = new Map<string, getFkIdHelper>();

    // 📌 fk uuid => id 로 변환하기 위한 정보 초기값 Setting
    info.forEach((info) => {
      helpers.set(info.key, {
        info: info,
        set: new Set<string>(),
        map: new Map<string, number>(),
        read: { count: 0, raws: [] }
      })
    })

    // 📌 정보에 Setting 된 uuidName 기준으로 Set 을 이용하여 중복제거
    body.forEach((data: any) => {
      helpers.forEach((helper) => {
        if (data[helper.info.uuidName]) { helper.set.add(data[helper.info.uuidName]); }
      })
    })

    for await (const key of helpers.keys()) {
      const helper = helpers.get(key) as getFkIdHelper;
      const uuids: string[] = [];

      // 📌 uuid set 을 uuid string[] 으로 변환
      helper.set.forEach((uuid) => { uuids.push(uuid) } );

      // 📌 uuid 에 매칭되는 id 조회 및 Map 에 Data Setting
      helper.read = await new helper.info.TRepo(tenant).readRawsByUuids(uuids);
      helper.read?.raws.forEach((raw: any) => { helper.map.set(raw['uuid'], raw[helper.info.idName]) });
    }

    // 📌 req.body uuid 에 매칭 되는 id Setting
    body = body.map((data: any) => {
      helpers.forEach((helper) => {
        if (data[helper.info.uuidName]) { data[helper.info.idAlias ? helper.info.idAlias : helper.info.idName] = helper.map.get(data[helper.info.uuidName]) }
      })

      return data;
    })

    return body;
  }

  //#region ✅ Excel Upload Functions
  // 📒 Fn[upsertBulkDatasFromExcel] (✅ Inheritance): Default Excel Upload Function
  public upsertBulkDatasFromExcel = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const sequelize = sequelizes[req.tenant.uuid] as Sequelize;
      const repo = new this.TRepo(req.tenant.uuid);

      let result: ApiResult<any> = { count: 0, raws: [] };
      let index: number = 0;

      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);

      // 📌 Excel Upload 전 Unique Key => Fk 변환 Function(Hook)
      req.body = await this.convertUniqueToFk(req.body, req.tenant.uuid);

      await sequelize.transaction(async(tran) => { 
        try {
          result.raws = [{ insertedResult: [], updatedResult: [] }];
          for await (const raw of req.body) {
            index = raw.index;

            if (raw.uuid) {
              const result = await repo.update(checkArray(raw), req.user?.uid as number, tran);
              result.raws[0].updatedResult.push(unsealArray(result.raws));
            } else {
              const result = await repo.create(checkArray(raw), req.user?.uid as number, tran);
              result.raws[0].insertedResult.push(unsealArray(result.raws));
            }
          }
          await this.afterTranUpload(req, result.raws[0].insertedResult, result.raws[0].updatedResult, tran);
        } catch (error) {
          throw new Error(`${index}행 ${error}`);
        }
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[convertUniqueToFk] (✅ Inheritance): Excel Upload 전 Unique Key => Fk 변환 Function(Hook)
  public convertUniqueToFk = async (body: any[], tenant: string) => { return body; }

  // 📒 Fn[afterTranUpload] (✅ Inheritance): Excel Upload 후 Transaction 내에서 로직 처리하기 위한 Function(Hook)
  public afterTranUpload = async (req: express.Request, _insertedRaws: any[], _updatedRaws: any[], tran: Transaction) => {}
  //#endregion

  //#region ✅ CRUD Functions
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const sequelize = sequelizes[req.tenant.uuid] as Sequelize;
      const repo = new this.TRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);
      await this.beforeCreate(req);

      await sequelize.transaction(async(tran) => { 
        await this.beforeTranCreate(req, tran);
        result = await repo.create(req.body, req.user?.uid as number, tran); 
        await this.afterTranCreate(req, result, tran);
      });

      await this.afterCreate(req, result);

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };
  
  public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new this.TRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };
      let status: number = 200;
      let message: string = '';

      const params = { ...req.query, ...req.params };
      await this.beforeRead(req);

      if (req.params.uuid) {
        if (!isUuid(req.params.uuid)) { throw new Error('잘못된 UUID를 입력하였습니다.'); }
        result = await repo.readByUuid(req.params.uuid, params);

        if (!result.raws) { 
          message = '조회 정보를 찾을 수 없습니다.'; 
          status = 404; 
        };
      } else {
        result = await repo.read(params);
      }
  
      await this.afterRead(req, result);
      return response(res, result.raws, { count: result.count }, message, status);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const sequelize = sequelizes[req.tenant.uuid] as Sequelize;
      const repo = new this.TRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);
      await this.beforeUpdate(req);

      await sequelize.transaction(async(tran) => { 
        await this.beforeTranUpdate(req, tran);
        result = await repo.update(req.body, req.user?.uid as number, tran); 
        await this.afterTranUpdate(req, result, tran);
      });

      await this.afterUpdate(req, result);
      return response(res, result.raws, { count: result.count }, '', 200);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };
  
  public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const sequelize = sequelizes[req.tenant.uuid] as Sequelize;
      const repo = new this.TRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);
      await this.beforePatch(req);

      await sequelize.transaction(async(tran) => { 
        await this.beforeTranPatch(req, tran);
        result = await repo.patch(req.body, req.user?.uid as number, tran); 
        await this.afterTranPatch(req, result, tran);
      });

      await this.afterPatch(req, result);
      return response(res, result.raws, { count: result.count }, '', 200);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };
  
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const sequelize = sequelizes[req.tenant.uuid] as Sequelize;
      const repo = new this.TRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);
      await this.beforeDelete(req);

      await sequelize.transaction(async(tran) => { 
        await this.beforeTranDelete(req, tran);
        result = await repo.delete(req.body, req.user?.uid as number, tran); 
        await this.afterTranDelete(req, result, tran);
      });

      await this.afterDelete(req, result);      
      return response(res, result.raws, { count: result.count }, '', 200);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };  
  //#endregion
}

export { getFkIdInfo };
export default BaseCtl;