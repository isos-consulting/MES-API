import express = require('express');
import { Transaction } from 'sequelize';
import ApiResult from '../../interfaces/common/api-result.interface';
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

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  // public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  //#endregion

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
  afterTranCreate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {
    await refreshMaterializedView(this.treeViewName, tran);
  }

  // 📒 Fn[afterCreate] (✅ Inheritance): Create Transaction 이 실행된 후 호출되는 Function
  // afterCreate = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🟡 Update Hooks

  // 📒 Fn[beforeUpdate] (✅ Inheritance): Update Transaction 이 실행되기 전 호출되는 Function
  // beforeUpdate = async(req: express.Request) => {}

  // 📒 Fn[beforeTranUpdate] (✅ Inheritance): Update Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranUpdate = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranUpdate] (✅ Inheritance): Update Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  afterTranUpdate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {
    await refreshMaterializedView(this.treeViewName, tran);
  }

  // 📒 Fn[afterUpdate] (✅ Inheritance): Update Transaction 이 실행된 후 호출되는 Function
  // afterUpdate = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🟠 Patch Hooks

  // 📒 Fn[beforePatch] (✅ Inheritance): Patch Transaction 이 실행되기 전 호출되는 Function
  // beforePatch = async(req: express.Request) => {}

  // 📒 Fn[beforeTranPatch] (✅ Inheritance): Patch Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranPatch = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranPatch] (✅ Inheritance): Patch Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  afterTranPatch = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {
    await refreshMaterializedView(this.treeViewName, tran);
  }

  // 📒 Fn[afterPatch] (✅ Inheritance): Patch Transaction 이 실행된 후 호출되는 Function
  // afterPatch = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

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