import express = require('express');
import { Transaction } from 'sequelize';
import ApiResult from '../../interfaces/common/api-result.interface';
import AutMenuTypeRepo from '../../repositories/aut/menu-type.repository';
import AutMenuRepo from '../../repositories/aut/menu.repository';
import { getSequelize } from '../../utils/getSequelize';
import refreshMaterializedView from '../../utils/refreshMaterializedView';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import BaseCtl from '../base.controller';
import config from '../../configs/config';

class AutMenuCtl extends BaseCtl {
  treeViewName: string = 'AUT_MENU_TREE_VW';

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(AutMenuRepo);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'menu',
        TRepo: AutMenuRepo,
        idName: 'menu_id',
        uuidName: 'uuid'
      },
      {
        key: 'menuType',
        TRepo: AutMenuTypeRepo,
        idName: 'menu_type_id',
        uuidName: 'menu_type_uuid'
      },
      {
        key: 'parent',
        TRepo: AutMenuRepo,
        idName: 'menu_id',
        idAlias: 'parent_id',
        uuidName: 'parent_uuid'
      }
    ];
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🔵 Read Functions

  // 📒 Fn[read] (✅ Inheritance): Default Read Function
  // public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  // 📒 Fn[readMenuWithPermissionByUid]: 사용자 기준 메뉴 및 권한 조회
  public readMenuWithPermissionByUid = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const repo = new AutMenuRepo(req.tenant.uuid);

      const result = await repo.readMenuWithPermissionByUid(req.user?.uid as number);
      let menuResult: any[] = [];
      let firstMenu: any = undefined;
      let secondMenu: any = undefined;

      result.raws.forEach((raw: any) => {
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
      };
      
      return response(res, menuResult, { count: result.count });
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🟡 Update Functions

  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.tenant.uuid, req.body, this.fkIdInfos);

      const sequelize = getSequelize(req.tenant.uuid);
      const repo = new AutMenuRepo(req.tenant.uuid);
      let result: ApiResult<any> = { count: 0, raws: [] };

      // 📌 생성할 데이터 구분
      let createBody: any[] = [];
      req.body.forEach((data: any) => { 
        if (data.uuid) return;
        data.parent_id = 0;
        data.sortby = 1;
        createBody = [ ...createBody, data ]; 
      });

      await sequelize.transaction(async(tran) => { 
        // 📌 데이터 생성
        const createResult = await repo.create(createBody, req.user?.uid as number, tran);

        // 📌 입력한 데이터 순서대로 메뉴 정렬
        let firstMenuId = 0;
        let secondMenuId = 0;

        let firstLevelIndex = 1;
        let secondLevelIndex = 1;
        let thirdLevelIndex = 1;
        let currentLevel = 1;
        req.body = req.body.map((data: any) => {
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
        const updateResult = await repo.update(req.body, req.user?.uid as number, tran); 

        result.raws = [...createResult.raws, ...updateResult.raws];
        result.count = createResult.count + updateResult.count;

        await refreshMaterializedView(req.tenant.uuid, this.treeViewName, tran);
      });

      return response(res, result.raws, { count: result.count }, '', 201);
    } catch (e) {
      return config.node_env === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  }

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  // public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  //#endregion

  //#endregion

  //#region ✅ Inherited Hooks

  //#region 🔴 Delete Hooks

  // 📒 Fn[beforeDelete] (✅ Inheritance): Delete Transaction 이 실행되기 전 호출되는 Function
  // beforeDelete = async(req: express.Request) => {}

  // 📒 Fn[beforeTranDelete] (✅ Inheritance): Delete Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranDelete = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranDelete] (✅ Inheritance): Delete Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  afterTranDelete = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {
    await refreshMaterializedView(req.tenant.uuid, this.treeViewName, tran);
  }

  // 📒 Fn[afterDelete] (✅ Inheritance): Delete Transaction 이 실행된 후 호출되는 Function
  // afterDelete = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#endregion
}

export default AutMenuCtl;