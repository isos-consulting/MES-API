import express = require('express');
import { Transaction } from 'sequelize/types';
import ApiResult from '../../interfaces/common/api-result.interface';
import StdMoneyUnitRepo from '../../repositories/std/money-unit.repository';
import StdPartnerRepo from '../../repositories/std/partner.repository';
import StdPriceTypeRepo from '../../repositories/std/price-type.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdUnitRepo from '../../repositories/std/unit.repository';
import StdVendorPriceRepo from '../../repositories/std/vendor-price.repository';
import unsealArray from '../../utils/unsealArray';
import BaseCtl from '../base.controller';

class StdVendorPriceCtl extends BaseCtl {
  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(StdVendorPriceRepo);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'partner',
        TRepo: StdPartnerRepo,
        idName: 'partner_id',
        uuidName: 'partner_uuid'
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'unit',
        TRepo: StdUnitRepo,
        idName: 'unit_id',
        uuidName: 'unit_uuid'
      },
      {
        key: 'moneyUnit',
        TRepo: StdMoneyUnitRepo,
        idName: 'money_unit_id',
        uuidName: 'money_unit_uuid'
      },
      {
        key: 'priceType',
        TRepo: StdPriceTypeRepo,
        idName: 'price_type_id',
        uuidName: 'price_type_uuid'
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
  public convertUniqueToFk = async (body: any[], tenant: string) => {
    const partnerRepo = new StdPartnerRepo(tenant);
    const prodRepo = new StdProdRepo(tenant);
    const unitRepo = new StdUnitRepo(tenant);
    const moneyUnitRepo = new StdMoneyUnitRepo(tenant);
    const priceTypeRepo = new StdPriceTypeRepo(tenant);

    for await (const raw of body) {
      const partner = await partnerRepo.readRawByUnique({ partner_cd: raw.partner_cd });
      raw.partner_id = unsealArray(partner.raws).partner_id;
      
      const prod = await prodRepo.readRawByUnique({ prod_no: raw.prod_no, rev: raw.rev });
      raw.prod_id = unsealArray(prod.raws).prod_id;
      
      const unit = await unitRepo.readRawByUnique({ unit_cd: raw.unit_cd });
      raw.unit_id = unsealArray(unit.raws).unit_id;

      const moneyUnit = await moneyUnitRepo.readRawByUnique({ money_unit_cd: raw.money_unit_cd });
      raw.money_unit_id = unsealArray(moneyUnit.raws).money_unit_id;

      const priceType = await priceTypeRepo.readRawByUnique({ price_type_cd: raw.price_type_cd });
      raw.price_type_id = unsealArray(priceType.raws).price_type_id;
    }
    return body;
  }

  // 📒 Fn[afterTranUpload] (✅ Inheritance): Excel Upload 후 Transaction 내에서 로직 처리하기 위한 Function(Hook)
  public afterTranUpload = async (req: express.Request, _insertedRaws: any[], _updatedRaws: any[], tran: Transaction) => {
    const raws = [..._insertedRaws, ..._updatedRaws];
    await this.rearrangeDate(raws, req.tenant.uuid, tran);
  }

  //#endregion

  //#region ✅ Inherited Hooks

  //#region 🟢 Create Hooks

  // 📒 Fn[beforeCreate] (✅ Inheritance): Create Transaction 이 실행되기 전 호출되는 Function
  // beforeCreate = async(req: express.Request) => {}

  // 📒 Fn[beforeTranCreate] (✅ Inheritance): Create Transaction 내부에서 DB Tasking 이 실행되기 전 호출되는 Function
  // beforeTranCreate = async(req: express.Request, tran: Transaction) => {}

  // 📒 Fn[afterTranCreate] (✅ Inheritance): Create Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  afterTranCreate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {
    await this.rearrangeDate(result.raws, req.tenant.uuid, tran);
  }

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
  afterTranUpdate = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {
    await this.rearrangeDate(result.raws, req.tenant.uuid, tran);
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
    await this.rearrangeDate(result.raws, req.tenant.uuid, tran);
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
  // afterTranDelete = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {}

  // 📒 Fn[afterTranDelete] (✅ Inheritance): Delete Transaction 내부에서 DB Tasking 이 실행된 후 호출되는 Function
  afterTranDelete = async(req: express.Request, result: ApiResult<any>, tran: Transaction) => {
    await this.rearrangeDate(result.raws, req.tenant.uuid, tran);
  }

  //#endregion

  //#endregion
  
  //#region ✅ Optional Functions

  // 📒 Fn[rearrangeDate]: 저장된 단가 데이터의 적용일자와 적용종료일자를 재정렬한다.
  /**
   * 저장된 단가 데이터의 적용일자와 적용종료일자를 재정렬한다.
   * @param _datas 저장 후 Return 된 Data Raws
   * @param tran 트랜잭션
   */
  rearrangeDate = async (_datas: any[], tenant: string, tran: Transaction) => {
    // 저장 된 값 중 partner_id, prod_id 를 추출하여 중복 제거 후
    // 수정 된 거래처, 품목의 적용일자, 적용종료일자를 재정렬한다.
    const partnerProdArr: any[] = [];
    
    for (const data of _datas) {
      if (!data.partner_id || !data.prod_id) { throw new Error("단가 적용일자 재정렬 중 Error 가 발생하였습니다.(Data 입력 형식이 잘못 되었습니다.)"); }

      const equals = partnerProdArr.find(partnerProd => partnerProd.partnerId == data.partner_id && partnerProd.prodId == data.prod_id);

      if (!equals) { partnerProdArr.push({ partnerId: data.partner_id, prodId: data.prod_id }); }
    }

    for await (const data of partnerProdArr) { await new StdVendorPriceRepo(tenant).rearrangeDate(data.partnerId, data.prodId, tran); }
  }
  
  //#endregion
}

export default StdVendorPriceCtl;