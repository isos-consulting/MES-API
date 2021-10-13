import * as express from 'express';
import * as bcrypt from 'bcrypt'
import * as createHttpError from 'http-errors'
import * as jwt from 'jsonwebtoken';
import response from '../../utils/response';
import AutUserRepo from '../../repositories/aut/user.repository';
import encrypt from '../../utils/encrypt';
import decrypt from '../../utils/decrypt';
import AutUserCache from '../../caches/aut/user.cache';
import AutUser from '../../models/aut/user.model';
import UserWrapper from '../../wrappers/aut/user.wrapper';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import BaseCtl from '../base.controller';
import AutGroupRepo from '../../repositories/aut/group.repository';
import ApiResult from '../../interfaces/common/api-result.interface';
import sequelize from '../../models';

class AutUserCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  repo: AutUserRepo;

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(new AutUserRepo());

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'group',
        repo: new AutGroupRepo(),
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
      req.body = await this.getFkId(req.body, this.fkIdInfos);

      await sequelize.transaction(async(tran) => { 
        this.result = await this.repo.updatePwd(req.body, req.user?.uid as number, tran); 
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
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
    this.result.raws = result.raws.map((raw: any) => { return new UserWrapper(raw).toWeb(); });
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
    this.result.raws = result.raws.map((raw: any) => { return new UserWrapper(raw).toWeb(); });
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
    this.result.raws = result.raws.map((raw: any) => { return new UserWrapper(raw).toWeb(); });
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
    this.result.raws = result.raws.map((raw: any) => { return new UserWrapper(raw).toWeb(); });
  }

  //#endregion

  //#endregion

  //#region ✅ Optional Functions

  // 📒 Fn[signIn]: 사용자 Login Function
  public signIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const user = await this.repo.readById(req.body.id) as AutUser;

      // 📌 DB에 bcrypt 단방향 암호화 방식으로 저장되어있는 Password
      const originPwd = user?.pwd;

      // ❗ 아이디가 없는 경우 Interlock
      if (!originPwd) { throw createHttpError(404, '사용자 아이디 또는 비밀번호 불일치'); }
      
      // 📌 개발환경일 경우 postman 에서 비밀번호를 입력하기 위하여 입력된 Password 암호화 진행
      if (process.env.NODE_ENV === 'development') { req.body.pwd = encrypt(req.body.pwd, process.env.CRYPTO_SECRET as string); }

      // 📌 Client에서 양방향 crypto.aes 암호화 방식으로 보낸 Password를 복호화 Key를 통하여 Convert한 Password
      const convertedPwd = decrypt(req.body.pwd, process.env.CRYPTO_SECRET as string);

      // ❗ 비밀번호 불일치 Interlock
      const match = await bcrypt.compare(convertedPwd, originPwd);
      if(!match) { throw createHttpError(404, '사용자 아이디 또는 비밀번호 불일치'); }

      // 로그인 성공시 Cache 에 User 정보 저장
      await new AutUserCache().create(user);

      // id, pwd Property 삭제 후 Front 로 전달
      let result = new UserWrapper(user).toWeb() as any;

      // jwt payload 에 담길 내용
      const payload = result;
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRESIN
      })
    
      result.token = token;
      return response(res, result);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion
}

export default AutUserCtl;