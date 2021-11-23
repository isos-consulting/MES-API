import express = require('express');
import { Transaction } from 'sequelize';
import ApiResult from '../../interfaces/common/api-result.interface';
import sequelize from '../../models';
import AutMenuTypeRepo from '../../repositories/aut/menu-type.repository';
import AutMenuRepo from '../../repositories/aut/menu.repository';
import refreshMaterializedView from '../../utils/refreshMaterializedView';
import response from '../../utils/response';
import testErrorHandlingHelper from '../../utils/testErrorHandlingHelper';
import BaseCtl from '../base.controller';

class AutMenuCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  repo: AutMenuRepo;
  treeViewName: string = 'AUT_MENU_TREE_VW';

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(new AutMenuRepo());

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'menuType',
        repo: new AutMenuTypeRepo(),
        idName: 'menu_type_id',
        uuidName: 'menu_type_uuid'
      },
      {
        key: 'parent',
        repo: new AutMenuRepo(),
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
      this.result = await this.repo.readMenuWithPermissionByUid(req.user?.uid as number);
      let menuResult: any[] = [];
      let firstMenu: any = undefined;
      let secondMenu: any = undefined;

      this.result.raws.forEach((raw: any) => {
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
      
      return response(res, menuResult, { count: this.result.count });
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
    }
  };

  //#endregion

  //#region 🟡 Update Functions

  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      req.body = await this.getFkId(req.body, this.fkIdInfos);

      // 📌 입력한 데이터 순서대로 메뉴 정렬
      let firstMenuId = 0;
      let secondMenuId = 0;

      let firstLevelIndex = 1;
      let secondLevelIndex = 1;
      let thirdLevelIndex = 1;
      let currentLevel = 1;
      req.body = req.body.map((data: any) => {
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

      // 📌 신규 데이터, 수정 할 데이터 구분
      const createBody: any[] = [];
      const updateBody: any[] = [];
      req.body.forEach((data: any) => {
        if (data.uuid) { updateBody.push(data); }
        else { createBody.push(data); }
      });

      await sequelize.transaction(async(tran) => { 
        // 📌 데이터 생성 및 수정
        const createResult = await this.repo.create(createBody, req.user?.uid as number, tran); 
        const updateResult = await this.repo.update(updateBody, req.user?.uid as number, tran); 

        this.result.raws = [...createResult.raws, ...updateResult.raws];
        this.result.count = createResult.count + updateResult.count;

        await refreshMaterializedView(this.treeViewName, tran);
      });

      return response(res, this.result.raws, { count: this.result.count }, '', 201);
    } catch (e) {
      return process.env.NODE_ENV === 'test' ? testErrorHandlingHelper(e, res) : next(e);
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
    await refreshMaterializedView(this.treeViewName, tran);
  }

  // 📒 Fn[afterDelete] (✅ Inheritance): Delete Transaction 이 실행된 후 호출되는 Function
  // afterDelete = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#endregion
}

export default AutMenuCtl;