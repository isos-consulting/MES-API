import * as express from 'express';
import response from '../utils/response';
import checkArray from '../utils/checkArray';
import sequelize from '../models'
import testErrorHandlingHelper from '../utils/testErrorHandlingHelper';
import { Transaction } from 'sequelize/types';
import ApiResult from '../interfaces/common/api-result.interface';
import unsealArray from '../utils/unsealArray';
import isUuid from '../utils/isUuid';

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
  repo: any,
}

class BaseCtl {
  result: ApiResult<any>;
  body: any;
  repo: any;
  fkIdInfos: getFkIdInfo[];

  constructor(_repo: any) {
    this.result = { count: 0, raws: [] };
    this.repo = _repo;
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
  getFkId = async(body: any, info?: getFkIdInfo[]) => {
    if (!info) { return body; }

    body = checkArray(body);
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
      helper.read = await helper.info.repo.readRawsByUuids(uuids);
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
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      let index: number = 0;

      // 📌 Excel Upload 전 Unique Key => Fk 변환 Function(Hook)
      req.body = await this.convertUniqueToFk(req.body);

      await sequelize.transaction(async(tran) => { 
        try {
          this.result.raws = [{ insertedResult: [], updatedResult: [] }];
          for await (const raw of req.body) {
            index = raw.index;

            if (raw.uuid) {
              const result = await this.repo.update(checkArray(raw), req.user?.uid as number, tran);
              this.result.raws[0].updatedResult.push(unsealArray(result.raws));
            } else {
              const result = await this.repo.create(checkArray(raw), req.user?.uid as number, tran);
              this.result.raws[0].insertedResult.push(unsealArray(result.raws));
            }
          }
          await this.afterTranUpload(req, this.result.raws[0].insertedResult, this.result.raws[0].updatedResult, tran);
        } catch (error) {
          throw new Error(`${index}행 ${error}`);
        }
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  // 📒 Fn[convertUniqueToFk] (✅ Inheritance): Excel Upload 전 Unique Key => Fk 변환 Function(Hook)
  public convertUniqueToFk = async (body: any[]) => { return body; }

  // 📒 Fn[afterTranUpload] (✅ Inheritance): Excel Upload 후 Transaction 내에서 로직 처리하기 위한 Function(Hook)
  public afterTranUpload = async (req: express.Request, _insertedRaws: any[], _updatedRaws: any[], tran: Transaction) => {}
  //#endregion

  //#region ✅ CRUD Functions
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      await this.beforeCreate(req);

      await sequelize.transaction(async(tran) => { 
        await this.beforeTranCreate(req, tran);
        this.result = await this.repo.create(req.body, req.user?.uid as number, tran); 
        await this.afterTranCreate(req, this.result, tran);
      });

      await this.afterCreate(req, this.result);

      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };
  
  public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let status: number = 200;
      let message: string = '';
      const params = Object.assign(req.query, req.params);
      await this.beforeRead(req);

      if (req.params.uuid) {
        if (!isUuid(req.params.uuid)) { throw new Error('잘못된 UUID를 입력하였습니다.'); }
        this.result = await this.repo.readByUuid(req.params.uuid, params);

        if (!this.result.raws) { 
          message = '조회 정보를 찾을 수 없습니다.'; 
          status = 404; 
        };
      } else {  
        this.result = await this.repo.read(params);
      }
  
      await this.afterRead(req, this.result);
      return response(res, this.result.raws, { count: this.result.count }, message, status);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      await this.beforeUpdate(req);

      await sequelize.transaction(async(tran) => { 
        await this.beforeTranUpdate(req, tran);
        this.result = await this.repo.update(req.body, req.user?.uid as number, tran); 
        await this.afterTranUpdate(req, this.result, tran);
      });

      await this.afterUpdate(req, this.result);
      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };
  
  public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      await this.beforePatch(req);

      await sequelize.transaction(async(tran) => { 
        await this.beforeTranPatch(req, tran);
        this.result = await this.repo.patch(req.body, req.user?.uid as number, tran); 
        await this.afterTranPatch(req, this.result, tran);
      });

      await this.afterPatch(req, this.result);
      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };
  
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);
      await this.beforeDelete(req);

      await sequelize.transaction(async(tran) => { 
        await this.beforeTranDelete(req, tran);
        this.result = await this.repo.delete(req.body, req.user?.uid as number, tran); 
        await this.afterTranDelete(req, this.result, tran);
      });

      await this.afterDelete(req, this.result);      
      return response(res, this.result.raws, { count: this.result.count }, '', 200);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };  
  //#endregion
}

export { getFkIdInfo };
export default BaseCtl;