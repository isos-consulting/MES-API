import express = require('express');
import StdProdRepo from '../../repositories/std/prod.repository';
import StdUnitConvertRepo from '../../repositories/std/unit-convert.repository';
import StdUnitRepo from '../../repositories/std/unit.repository';
import isNumber from '../../utils/isNumber';
import unsealArray from '../../utils/unsealArray';
import BaseCtl from '../base.controller';

class StdUnitConvertCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  repo: StdUnitConvertRepo;

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(new StdUnitConvertRepo());

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'fromUnit',
        repo: new StdUnitRepo(),
        idName: 'unit_id',
        idAlias: 'from_unit_id',
        uuidName: 'from_unit_uuid'
      },
      {
        key: 'toUnit',
        repo: new StdUnitRepo(),
        idName: 'unit_id',
        idAlias: 'to_unit_id',
        uuidName: 'to_unit_uuid'
      },
      {
        key: 'prod',
        repo: new StdProdRepo(),
        idName: 'prod_id',
        idAlias: 'prod_id',
        uuidName: 'prod_uuid'
      },
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

  //#region ✅ Excel Upload Functions

  // 📒 Fn[upsertBulkDatasFromExcel] (✅ Inheritance): Default Excel Upload Function
  // public upsertBulkDatasFromExcel = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  // 📒 Fn[convertUniqueToFk] (✅ Inheritance): Excel Upload 전 Unique Key => Fk 변환 Function(Hook)
  public convertUniqueToFk = async (body: any[]) => {
    const unitRepo = new StdUnitRepo();
    const prodRepo = new StdProdRepo();

    for await (const raw of body) {
      const fromUnit = await unitRepo.readRawByUnique({ unit_cd: raw.from_unit_cd });
      raw.from_unit_id = unsealArray(fromUnit.raws).unit_id;
      
      const toUnit = await unitRepo.readRawByUnique({ unit_cd: raw.to_unit_cd });
      raw.to_unit_id = unsealArray(toUnit.raws).unit_id;

      const prod = await prodRepo.readRawByUnique({ prod_no: raw.prod_no, rev: raw.rev });
      raw.prod_id = unsealArray(prod.raws).prod_id;
    }
    return body;
  }

  // 📒 Fn[afterTranUpload] (✅ Inheritance): Excel Upload 후 Transaction 내에서 로직 처리하기 위한 Function(Hook)
  // public afterTranUpload = async (req: express.Request, _insertedRaws: any[], _updatedRaws: any[], tran: Transaction) => {}

  //#endregion

  //#region ✅ Inherited Hooks

  //#region 🟢 Create Hooks

  // 📒 Fn[beforeCreate] (✅ Inheritance): Create Transaction 이 실행되기 전 호출되는 Function
  beforeCreate = async(req: express.Request) => {
    req.body = req.body.map((data: any) => { 
      if (!data.from_value || !data.to_value) { throw new Error(`변환 전 후 값이 입력되지 않았거나 0을 입력하였습니다.`); }
      if (!isNumber(data.from_value) || !isNumber(data.to_value)) { throw new Error(`변환 값이 숫자형식으로 입력되지 않았습니다.`); }
      
      data.convert_value = data.to_value / data.from_value;
      return data;
    });
  }

  // 📒 Fn[beforeTranCreate] (✅ Inheritance): Create Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranCreate = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranCreate] (✅ Inheritance): Create Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranCreate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterCreate] (✅ Inheritance): Create Transaction 이 실행된 후 호출되는 Function
  // afterCreate = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🔵 Read Hooks

  // 📒 Fn[beforeRead] (✅ Inheritance): Read DB Tasking 이 실행되기 전 호출되는 Function
  // beforeRead = async(req: express.Request) => {}

  // 📒 Fn[afterRead] (✅ Inheritance): Read DB Tasking 이 실행된 후 호출되는 Function
  // afterRead = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🟡 Update Hooks

  // 📒 Fn[beforeUpdate] (✅ Inheritance): Update Transaction 이 실행되기 전 호출되는 Function
  beforeUpdate = async(req: express.Request) => {
    req.body = req.body.map((data: any) => { 
      if (!data.from_value || !data.to_value) { throw new Error(`변환 전 후 값이 입력되지 않았거나 0을 입력하였습니다.`); }
      if (!isNumber(data.from_value) || !isNumber(data.to_value)) { throw new Error(`변환 값이 숫자형식으로 입력되지 않았습니다.`); }
      
      data.convert_value = data.to_value / data.from_value;
      return data;
    });
  }

  // 📒 Fn[beforeTranUpdate] (✅ Inheritance): Update Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranUpdate = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranUpdate] (✅ Inheritance): Update Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranUpdate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterUpdate] (✅ Inheritance): Update Transaction 이 실행된 후 호출되는 Function
  // afterUpdate = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🟠 Patch Hooks

  // 📒 Fn[beforePatch] (✅ Inheritance): Patch Transaction 이 실행되기 전 호출되는 Function
  beforePatch = async(req: express.Request) => {
    req.body = req.body.map((data: any) => { 
      if (!data.from_value || !data.to_value) { throw new Error(`변환 전 후 값이 입력되지 않았거나 0을 입력하였습니다.`); }
      if (!isNumber(data.from_value) || !isNumber(data.to_value)) { throw new Error(`변환 값이 숫자형식으로 입력되지 않았습니다.`); }
      
      data.convert_value = data.to_value / data.from_value;
      return data;
    });
  }

  // 📒 Fn[beforeTranPatch] (✅ Inheritance): Patch Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranPatch = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranPatch] (✅ Inheritance): Patch Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranPatch = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterPatch] (✅ Inheritance): Patch Transaction 이 실행된 후 호출되는 Function
  // afterPatch = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🔴 Delete Hooks

  // 📒 Fn[beforeDelete] (✅ Inheritance): Delete Transaction 이 실행되기 전 호출되는 Function
  // beforeDelete = async(req: express.Request) => {}

  // 📒 Fn[beforeTranDelete] (✅ Inheritance): Delete Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranDelete = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranDelete] (✅ Inheritance): Delete Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranDelete = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterDelete] (✅ Inheritance): Delete Transaction 이 실행된 후 호출되는 Function
  // afterDelete = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#endregion

}

export default StdUnitConvertCtl;