import AdmBomTypeRepo from '../../repositories/adm/bom-type.repository';
import AdmPrdPlanTypeRepo from '../../repositories/adm/prd-plan-type.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdItemTypeRepo from '../../repositories/std/item-type.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdModelRepo from '../../repositories/std/model.repository';
import StdProdTypeRepo from '../../repositories/std/prod-type.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import StdUnitRepo from '../../repositories/std/unit.repository';
import unsealArray from '../../utils/unsealArray';
import BaseCtl from '../base.controller';

class StdProdCtl extends BaseCtl {
  // ✅ Inherited Functions Variable
  // result: ApiResult<any>;

  // ✅ 부모 Controller (BaseController) 의 repository 변수가 any 로 생성 되어있기 때문에 자식 Controller(this) 에서 Type 지정
  repo: StdProdRepo;

  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(new StdProdRepo());

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'itemType',
        repo: new StdItemTypeRepo(),
        idName: 'item_type_id',
        uuidName: 'item_type_uuid'
      },
      {
        key: 'prodType',
        repo: new StdProdTypeRepo(),
        idName: 'prod_type_id',
        uuidName: 'prod_type_uuid'
      },
      {
        key: 'model',
        repo: new StdModelRepo(),
        idName: 'model_id',
        uuidName: 'model_uuid'
      },
      {
        key: 'unit',
        repo: new StdUnitRepo(),
        idName: 'unit_id',
        uuidName: 'unit_uuid'
      },
      {
        key: 'matUnit',
        repo: new StdUnitRepo(),
        idName: 'unit_id',
        idAlias: 'mat_unit_id',
        uuidName: 'mat_unit_uuid'
      },
      {
        key: 'store',
        repo: new StdStoreRepo(),
        idName: 'store_id',
        idAlias: 'inv_to_store_id',
        uuidName: 'inv_to_store_uuid'
      },
      {
        key: 'location',
        repo: new StdLocationRepo(),
        idName: 'location_id',
        idAlias: 'inv_to_location_id',
        uuidName: 'inv_to_location_uuid'
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
    const factoryRepo = new StdFactoryRepo();
    const itemTypeRepo = new StdItemTypeRepo();
    const prodTypeRepo = new StdProdTypeRepo();
    const modelRepo = new StdModelRepo();
    const unitRepo = new StdUnitRepo();
    const storeRepo = new StdStoreRepo();
    const locationRepo = new StdLocationRepo();
    const bomTypeRepo = new AdmBomTypeRepo();
    const prdPlanTypeRepo = new AdmPrdPlanTypeRepo();

    for await (const raw of body) {
      const factory = await factoryRepo.readRawByUnique({ factory_cd: raw.factory_cd });
      raw.factory_id = unsealArray(factory.raws).factory_id;

      const itemType = await itemTypeRepo.readRawByUnique({ item_type_cd: raw.item_type_cd });
      raw.item_type_id = unsealArray(itemType.raws).item_type_id;

      const prodType = await prodTypeRepo.readRawByUnique({ prod_type_cd: raw.prod_type_cd });
      raw.prod_type_id = unsealArray(prodType.raws).prod_type_id;

      const model = await modelRepo.readRawByUnique({ model_cd: raw.model_cd });
      raw.model_id = unsealArray(model.raws).model_id;

      const unit = await unitRepo.readRawByUnique({ unit_cd: raw.unit_cd });
      raw.unit_id = unsealArray(unit.raws).unit_id;

      const matUnit = await unitRepo.readRawByUnique({ unit_cd: raw.mat_unit_cd });
      raw.mat_unit_id = unsealArray(matUnit.raws).unit_id;

      const store = await storeRepo.readRawByUnique({ factory_id: raw.factory_id, store_cd: raw.inv_to_store_cd });
      raw.inv_to_store_id = unsealArray(store.raws).store_id;

      const location = await locationRepo.readRawByUnique({ factory_id: raw.factory_id, location_cd: raw.inv_to_location_cd });
      raw.inv_to_location_id = unsealArray(location.raws).location_id;

      const bomType = await bomTypeRepo.read({ bom_type_cd: raw.bom_type_cd });
      raw.bom_type_cd = unsealArray(bomType.raws).bom_type_cd;

      const prdPlanType = await prdPlanTypeRepo.read({ prd_plan_type_cd: raw.prd_plan_type_cd });
      raw.prd_plan_type_cd = unsealArray(prdPlanType.raws).prd_plan_type_cd;
    }
    return body;
  }

  // 📒 Fn[afterTranUpload] (✅ Inheritance): Excel Upload 후 Transaction 내에서 로직 처리하기 위한 Function(Hook)
  // public afterTranUpload = async (req: express.Request, _insertedRaws: any[], _updatedRaws: any[], tran: Transaction) => {}

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
  // beforeUpdate = async(req: express.Request) => {}

  // 📒 Fn[beforeTranUpdate] (✅ Inheritance): Update Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranUpdate = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranUpdate] (✅ Inheritance): Update Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  // afterTranUpdate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterUpdate] (✅ Inheritance): Update Transaction 이 실행된 후 호출되는 Function
  // afterUpdate = async(req: express.Request, result: ApiResult<any>) => {}

  //#endregion

  //#region 🟠 Patch Hooks

  // 📒 Fn[beforePatch] (✅ Inheritance): Patch Transaction 이 실행되기 전 호출되는 Function
  // beforePatch = async(req: express.Request) => {}

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

export default StdProdCtl;