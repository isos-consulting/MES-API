import BaseCtl from '../base.controller';
import AdmPatternHistoryRepo from '../../repositories/adm/pattern-history.repository';
import AdmPatternOptRepo from '../../repositories/adm/pattern-opt.repository';
import { Transaction } from 'sequelize/types';
import moment = require('moment');
import StdShiftRepo from '../../repositories/std/shift.repository';
import StdEquipRepo from '../../repositories/std/equip.repository';
import StdPartnerRepo from '../../repositories/std/partner.repository';
import StdProcRepo from '../../repositories/std/proc.repository';
import convertWeekByMonth from '../../utils/convertWeekByMonth';

class AdmPatternHistoryCtl extends BaseCtl {
  //#region ✅ Constructor
  constructor() {
    // ✅ 부모 Controller (Base Controller) 의 CRUD Function 과 상속 받는 자식 Controller(this) 의 Repository 를 연결하기 위하여 생성자에서 Repository 생성
    super(AdmPatternHistoryRepo);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    // fkIdInfos = [
    //   {
    //     key: 'factory',
    //     TRepo: new StdFactoryRepo(),
    //     idName: 'factory_id',
    //     uuidName: 'factory_uuid'
    //   },
    //   {
    //     key: 'receive',
    //     TRepo: new AdmPatternHistoryRepo(),
    //     idName: 'receive_id',
    //     uuidName: 'receive_uuid'
    //   },
    // ];
  };
  //#endregion

  /**
   * ✅ adm_pattern_history_tb 에 기재된 발행 패턴을 통하여 전표번호 등을 자동발행하는 함수
   * @param params 
   * @returns 자동발행 번호
   */
  public getPattern = async (params: {
    tenant: string,
    factory_id: number,
    table_nm: string,
    col_nm: string,
    reg_date: string,
    shift_uuid?: string,
    equip_uuid?: string,
    partner_uuid?: string,
    proc_uuid?: string,
    uid: number,
    tran: Transaction
  }) => {
    const repo = new AdmPatternHistoryRepo(params.tenant);
    const patternOptRepo = new AdmPatternOptRepo(params.tenant);
    const shiftRepo = new StdShiftRepo(params.tenant);
    const equipRepo = new StdEquipRepo(params.tenant);
    const partnerRepo = new StdPartnerRepo(params.tenant);
    const procRepo = new StdProcRepo(params.tenant);
    
    // 📌 Table 및 Column명을 통하여 자동발행 패턴 검색
    const pattern = await patternOptRepo.readPattern({ table_nm: params.table_nm, col_nm: params.col_nm });
    // 📌 자동발행 패턴이 없을 경우 Return
    if (!pattern) { return null; }
    
    // 📌 해당 자동발행 패턴의 Max Seq 검색
    const maxSeq = await repo.getMaxSeq({
      factory_id: params.factory_id,
      table_nm: params.table_nm,
      col_nm: params.col_nm, 
      pattern: pattern, 
      reg_date: params.reg_date
    }, params.tran);
    const seq = maxSeq + 1;

    if (maxSeq == 0) {
      // 📌 Max Seq가 없을 경우 Seq 새로 입력
      await repo.create([{
        factory_id: params.factory_id, 
        table_nm: params.table_nm, 
        col_nm: params.col_nm, 
        pattern: pattern, 
        reg_date: params.reg_date,
        seq: seq
      }], params.uid, params.tran)
    } else {
      // 📌 기존 Max Seq에 사용한 Seq 입력
      await repo.updateSeqByGroup({ 
        factory_id: params.factory_id, 
        table_nm: params.table_nm, 
        col_nm: params.col_nm, 
        pattern: pattern, 
        reg_date: params.reg_date,
        seq: seq
      }, params.uid, params.tran);
    }

    let result = pattern;
    // 📌 자동발행 패턴 중 날짜형식 Replace
    result = result.replace('{YYYY}', moment(params.reg_date).format('YYYY'));
    result = result.replace('{YY}', moment(params.reg_date).format('YY'));
    result = result.replace('{Y}', moment(params.reg_date).format('Y').substr(-1));
    result = result.replace('{MM}', moment(params.reg_date).format('MM'));
    result = result.replace('{DD}', moment(params.reg_date).format('DD'));
    result = result.replace('{DDD}', moment(params.reg_date).format('DDD'));
    result = result.replace('{W}', convertWeekByMonth(params.reg_date).toString());
    result = result.replace('{WW}', moment(params.reg_date).format('WW'));

    // 📌 기준정보와 연결된 패턴 데이터 Replace
    if (result.indexOf('{DN}') >= 0) { result = result.replace('{DN}', (await shiftRepo.readRawByUuid(params.shift_uuid as string)).raws[0].shift_nm); }
    if (result.indexOf('{EQ}') >= 0) { result = result.replace('{EQ}', (await equipRepo.readRawByUuid(params.equip_uuid as string)).raws[0].equip_cd); }
    if (result.indexOf('{PT}') >= 0) { result = result.replace('{PT}', (await partnerRepo.readRawByUuid(params.partner_uuid as string)).raws[0].partner_cd); }
    if (result.indexOf('{PC}') >= 0) { result = result.replace('{PC}', (await procRepo.readRawByUuid(params.proc_uuid as string)).raws[0].proc_cd); }

    // 📌 Seq의 자리수에 따라 데이터 Replace
    const re = new RegExp(/{0*}/);
    const seqStartIndex = result.search(re);
    if (seqStartIndex >= 0) {
      const seqEndIndex = result.indexOf('}', seqStartIndex);
      const countOfZero = seqEndIndex - seqStartIndex - 1;
      const countString = '{' + '0'.repeat(countOfZero) + '}';
      
      result = result.replace(countString, `${seq}`.padStart(countOfZero, '0'));
    }

    return result;
  }

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  // public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // };
  //#endregion

  //#region 🔵 Read Functions

  // 📒 Fn[read] (✅ Inheritance): Default Read Function
  // public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // }

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  // public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // };
  
  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch] (✅ Inheritance): Default Patch Function
  // public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // };
  
  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Delete Create Function
  // public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // };

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

export default AdmPatternHistoryCtl;