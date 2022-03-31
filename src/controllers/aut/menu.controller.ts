import express from 'express';
import { matchedData } from 'express-validator';
import config from '../../configs/config';
import AutMenuService from '../../services/aut/menu.service';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import { sequelizes } from '../../utils/getSequelize';
import isServiceResult from '../../utils/isServiceResult';
import response from '../../utils/response_new';
import createApiResult from '../../utils/createApiResult_new';
import { successState } from '../../states/common.state';
import ApiResult from '../../interfaces/common/api-result.interface';
import refreshMaterializedView from '../../utils/refreshMaterializedView';

class AutMenuCtl {
  stateTag: string
	treeViewName: string = 'AUT_MENU_TREE_VW';
  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'autMenu'
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new AutMenuService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.create(datas, req.user?.uid as number, tran)
      });

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

  // 📒 Fn[readMenuWithPermissionByUid]: 사용자 기준 메뉴 및 권한 조회
  public readMenuWithPermissionByUid = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new AutMenuService(req.tenant.uuid);
			
			let menuResult: any[] = [];
			let firstMenu: any = undefined;
			let secondMenu: any = undefined;

      const result_sub = await service.readMenuWithPermissionByUid(req.user?.uid as number);

			result_sub.raws.forEach((raw: any) => {
				switch (raw.lv) {
					case 1:
						if (firstMenu) {
							if (secondMenu) { firstMenu.sub_menu.push(secondMenu); }
							menuResult.push(firstMenu);
						}
						firstMenu = raw;
						firstMenu.sub_menu = [];
						secondMenu = undefined;
						break;
					case 2:
						if (secondMenu) { firstMenu.sub_menu.push(secondMenu); }
						secondMenu = raw;
						secondMenu.sub_menu = [];
						break;
					case 3:
						secondMenu.sub_menu.push(raw);
						break;
				}
			});

			if (firstMenu) {
				if (secondMenu) { firstMenu.sub_menu.push(secondMenu); }
				menuResult.push(firstMenu)
			}
      
			result.count =  result_sub.count
			result.raws = menuResult

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[read] (✅ Inheritance): Default Read Function
  public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new AutMenuService(req.tenant.uuid);
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
      const service = new AutMenuService(req.tenant.uuid);

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
      const service = new AutMenuService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      let datas = await service.convertFk(Object.values(matched));

      // 📌 생성할 데이터 구분
      let createBody: any[] = [];
      datas.forEach((data: any) => { 
        if (data.uuid) return;
        data.parent_id = 0;
        data.sortby = 1;
        createBody = [ ...createBody, data ]; 
      });

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 

				// 📌 데이터 생성
				const createResult = await service.update(createBody, req.user?.uid as number, tran)

				// 📌 입력한 데이터 순서대로 메뉴 정렬
				let firstMenuId = 0;
				let secondMenuId = 0;

				let firstLevelIndex = 1;
				let secondLevelIndex = 1;
				let thirdLevelIndex = 1;
				let currentLevel = 1;

				datas = datas.map((data: any) => {
          if (!data.uuid) {
            const created = createResult.raws.find(x => x.menu_uri == data.menu_uri);
            data.menu_id = created.menu_id;
            data.uuid = created.uuid;
          }

          switch (data.lv) {
            case 1:
              firstMenuId = data.menu_id;
              data.parent_id = 0;

              currentLevel = 1;
              data.sortby = firstLevelIndex++;
              break;
            case 2:
              data.parent_id = firstMenuId;
              secondMenuId = data.menu_id;

              if (currentLevel === 1) { secondLevelIndex = 1; }
              currentLevel = 2;
              data.sortby = secondLevelIndex++;
              break;
            case 3:
              data.parent_id = secondMenuId;

              if (currentLevel !== 3) { thirdLevelIndex = 1; }
              currentLevel = 3;
              data.sortby = thirdLevelIndex++;
              break;
          }
          return data;
        });

				// 📌 데이터 수정
        const updateResult = await service.update(datas, req.user?.uid as number, tran); 

        result.raws = [...createResult.raws, ...updateResult.raws];
        result.count = createResult.count + updateResult.count;

        await refreshMaterializedView(req.tenant.uuid, this.treeViewName, tran);
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
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
      const service = new AutMenuService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.patch(datas, req.user?.uid as number, tran)
      });


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
      const service = new AutMenuService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = Object.values(matched);

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.delete(datas, req.user?.uid as number, tran)
				await refreshMaterializedView(req.tenant.uuid, this.treeViewName, tran);
      });

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
}

export default AutMenuCtl;