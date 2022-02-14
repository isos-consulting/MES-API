import express from 'express';
import bcrypt from 'bcrypt'
import createHttpError from 'http-errors'
import response from '../../utils/response';
import responseNew from '../../utils/response_new';
import AutUserRepo from '../../repositories/aut/user.repository';
import decrypt from '../../utils/decrypt';
import AutUser from '../../models/aut/user.model';
import UserWrapper from '../../wrappers/aut/user.wrapper';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import BaseCtl from '../base.controller';
import AutGroupRepo from '../../repositories/aut/group.repository';
import ApiResult from '../../interfaces/common/api-result.interface';
import { refresh, sign } from '../../utils/jwt-util';
import { userSuccessState } from '../../states/user.state';
import { getSequelize } from '../../utils/getSequelize';
import config from '../../configs/config';
import AutUserCache from '../../caches/aut/user.cache';

class AutUserCtl extends BaseCtl {
  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(AutUserRepo);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'group',
        TRepo: AutGroupRepo,
        idName: 'group_id',
        uuidName: 'group_uuid'
      }
    ];
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  // public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

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
    
  // 📒 Fn[updatePwd]: Password Update Function
  public updatePwd = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new AutUserRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      await sequelize.transaction(async(tran) => { 
        result = await repo.updatePwd(req.body, req.user?.uid as number, tran); 
      });

      const cache = new AutUserCache(req.tenant.uuid);

      let tempResult = [];
      for await (const raw of result.raws) {
        await cache.create(raw);
        tempResult.push(new UserWrapper(raw).toWeb());
      }

      result.raws = tempResult;

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch] (✅ Inheritance): Default Patch Function
  // public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  // public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

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
  afterCreate = async(req: express.Request, result: ApiResult<any>) => {
    result.raws = result.raws.map((raw: any) => { return new UserWrapper(raw).toWeb(); });
  }

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
  afterUpdate = async(req: express.Request, result: ApiResult<any>) => {
    const cache = new AutUserCache(req.tenant.uuid);

    let tempResult = [];
    for await (const raw of result.raws) {
      await cache.create(raw);
      tempResult.push(new UserWrapper(raw).toWeb());
    }
  }

  //#endregion

  //#region 🟠 Patch Hooks

  // 📒 Fn[beforePatch] (✅ Inheritance): Patch Transaction 이 실행되기 전 호출되는 Function
  // beforePatch = async(req: express.Request) => {}

  // 📒 Fn[beforeTranPatch] (✅ Inheritance): Patch Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranPatch = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranPatch] (✅ Inheritance): Patch Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranPatch = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterPatch] (✅ Inheritance): Patch Transaction 이 실행된 후 호출되는 Function
  afterPatch = async(req: express.Request, result: ApiResult<any>) => {
    const cache = new AutUserCache(req.tenant.uuid);
    
    let tempResult = [];
    for await (const raw of result.raws) {
      await cache.create(raw);
      tempResult.push(new UserWrapper(raw).toWeb());
    }
  }

  //#endregion

  //#region 🔴 Delete Hooks

  // 📒 Fn[beforeDelete] (✅ Inheritance): Delete Transaction 이 실행되기 전 호출되는 Function
  // beforeDelete = async(req: express.Request) => {}

  // 📒 Fn[beforeTranDelete] (✅ Inheritance): Delete Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranDelete = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranDelete] (✅ Inheritance): Delete Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranDelete = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterDelete] (✅ Inheritance): Delete Transaction 이 실행된 후 호출되는 Function
  afterDelete = async(req: express.Request, result: ApiResult<any>) => {
    const cache = new AutUserCache(req.tenant.uuid);
    
    let tempResult = [];
    for await (const raw of result.raws) {
      await cache.delete(raw);
      tempResult.push(new UserWrapper(raw).toWeb());
    }
  }

  //#endregion

  //#endregion

  //#region ✅ Optional Functions

  // 📒 Fn[signIn]: 사용자 Login Function
  public signIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new AutUserRepo(req.tenant.uuid);

      const user = await repo.readById(req.body.id) as AutUser;

      // 📌 DB에 bcrypt 단방향 암호화 방식으로 저장되어있는 Password
      const originPwd = user?.pwd;

      // ❗ 아이디가 없는 경우 Interlock
      if (!originPwd) { throw createHttpError(404, '사용자 아이디 또는 비밀번호 불일치'); }

      // 📌 Client에서 양방향 crypto.aes 암호화 방식으로 보낸 Password를 복호화 Key를 통하여 Convert한 Password
      const convertedPwd = decrypt(req.body.pwd, config.crypto.secret);

      // ❗ 비밀번호 불일치 Interlock
      const match = await bcrypt.compare(convertedPwd, originPwd);
      if(!match) { throw createHttpError(404, '사용자 아이디 또는 비밀번호 불일치'); }

      // 로그인 성공시 Cache 에 User 정보 저장
      await new AutUserCache(req.tenant.uuid).create(user);

      // id, pwd Property 삭제 후 Front 로 전달
      let result = new UserWrapper(user).toWeb() as any;

      const accessToken = sign(user);
      const refreshToken = await refresh(user.uuid);
      result = {
        ...result, 
        access_token: accessToken,
        refresh_token: refreshToken
      }

      return responseNew(
        res, 
        { raws: [result], status: 201 },
        { state_tag: 'user', type: 'SUCCESS', state_no: userSuccessState.SIGNIN }
      );
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion
}

export default AutUserCtl;