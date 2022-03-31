import express from 'express';
import bcrypt from 'bcrypt'
import { matchedData } from 'express-validator';
import config from '../../configs/config';
import AutUserService from '../../services/aut/user.service';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import { sequelizes } from '../../utils/getSequelize';
import isServiceResult from '../../utils/isServiceResult';
import response from '../../utils/response_new';
import createApiResult from '../../utils/createApiResult_new';
import { successState } from '../../states/common.state';
import ApiResult from '../../interfaces/common/api-result.interface';
import decrypt from '../../utils/decrypt';
import UserWrapper from '../../wrappers/aut/user.wrapper';
import { refresh, sign } from '../../utils/jwt-util';
import AutUserCache from '../../caches/aut/user.cache';
import AutUser from '../../models/aut/user.model';
import createHttpError from 'http-errors'
import responseNew from '../../utils/response_new';
import { userSuccessState } from '../../states/user.state';

class AutUserCtl {
  stateTag: string

  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'autUser'
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new AutUserService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.create(datas, req.user?.uid as number, tran)
      });

			result.raws = result.raws.map((raw: any) => { return new UserWrapper(raw).toWeb(); });

      return createApiResult(res, result, 201, '데이터 생성 성공', this.stateTag, successState.CREATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

  //#region 🔵 Read Functions

  // 📒 Fn[read] (✅ Inheritance): Default Read Function
  public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new AutUserService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      result = await service.read(params);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readByUuid] (✅ Inheritance): Default ReadByUuid Function
  public readByUuid = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new AutUserService(req.tenant.uuid);

      result = await service.readByUuid(req.params.uuid);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

  //#region 🟡 Update Functions

  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new AutUserService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.update(datas, req.user?.uid as number, tran)
      });

			const cache = new AutUserCache(req.tenant.uuid);

			let tempResult = [];
			for await (const raw of result.raws) {
				await cache.create(raw);
				tempResult.push(new UserWrapper(raw).toWeb());
			}

			result.raws = tempResult;

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[updatePwd]: Password Update Function
  public updatePwd = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
			let result: ApiResult<any> = { count:0, raws: [] };
      const service = new AutUserService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

			await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.updatePwd(datas, req.user?.uid as number, tran)
      });

      const cache = new AutUserCache(req.tenant.uuid);

      let tempResult = [];
      for await (const raw of result.raws) {
        await cache.create(raw);
        tempResult.push(new UserWrapper(raw).toWeb());
      }

      result.raws = tempResult;

      return createApiResult(res, result, 201, '데이터 수정 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch] (✅ Inheritance): Default Patch Function
  public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new AutUserService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.patch(datas, req.user?.uid as number, tran)
      });

			const cache = new AutUserCache(req.tenant.uuid);

			let tempResult = [];
			for await (const raw of result.raws) {
				await cache.create(raw);
				tempResult.push(new UserWrapper(raw).toWeb());
			}

			result.raws = tempResult;

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.PATCH);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new AutUserService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = Object.values(matched);

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.delete(datas, req.user?.uid as number, tran)
      });

			const cache = new AutUserCache(req.tenant.uuid);

			let tempResult = [];
			for await (const raw of result.raws) {
				await cache.create(raw);
				tempResult.push(new UserWrapper(raw).toWeb());
			}

			result.raws = tempResult;

      return createApiResult(res, result, 200, '데이터 삭제 성공', this.stateTag, successState.DELETE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

  //#endregion

  // 📒 Fn[signIn]: 사용자 Login Function
  public signIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const service = new AutUserService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = Object.values(matched);
			
      const user = await service.readById(datas[0].id) as AutUser;

      // 📌 DB에 bcrypt 단방향 암호화 방식으로 저장되어있는 Password
      const originPwd = user?.pwd;
      // ❗ 아이디가 없는 경우 Interlock
      if (!originPwd) { throw createHttpError(404, '사용자 아이디 또는 비밀번호 불일치'); }

      // 📌 Client에서 양방향 crypto.aes 암호화 방식으로 보낸 Password를 복호화 Key를 통하여 Convert한 Password
      const convertedPwd = decrypt(datas[0].pwd, config.crypto.secret);
			// const convertedPwd = config.node_env !== 'test' ? decrypt(datas[0].pwd, config.crypto.secret) : datas[0].pwd;

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
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

}

export default AutUserCtl;