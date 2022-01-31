import { Transaction } from "sequelize/types";
import AdmPatternOptRepo from "../../repositories/adm/pattern-opt.repository";
import AdmPatternHistoryRepo from "../../repositories/adm/pattern-history.repository";
import StdEquipRepo from "../../repositories/std/equip.repository";
import StdPartnerRepo from "../../repositories/std/partner.repository";
import StdProcRepo from "../../repositories/std/proc.repository";
import StdShiftRepo from "../../repositories/std/shift.repository";
import moment from "moment";
import convertWeekByMonth from "../../utils/convertWeekByMonth";

class AdmPatternHistoryService {
  tenant: string;
  stateTag: string;
  repo: AdmPatternHistoryRepo;
  patternOptRepo: AdmPatternOptRepo;
  shiftRepo: StdShiftRepo;
  equipRepo: StdEquipRepo;
  partnerRepo: StdPartnerRepo;
  procRepo: StdProcRepo;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'admPatternHistory';
    this.repo = new AdmPatternHistoryRepo(tenant);
    this.patternOptRepo = new AdmPatternOptRepo(tenant);
    this.shiftRepo = new StdShiftRepo(tenant);
    this.equipRepo = new StdEquipRepo(tenant);
    this.partnerRepo = new StdPartnerRepo(tenant);
    this.procRepo = new StdProcRepo(tenant);
  }

  public create = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.create(datas, uid, tran); } 
    catch (error) { throw error; }
  }

  public read = async (params: any) => {
    try { return await this.repo.read(params); } 
    catch (error) { throw error; }
  };
  
  public readByUuid = async (uuid: string) => {
    try { return await this.repo.readByUuid(uuid); } 
    catch (error) { throw error; }
  };

  public update = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
    catch (error) { throw error; }
  }

  public patch = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran); } 
    catch (error) { throw error; }
  }

  public delete = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); } 
    catch (error) { throw error; }
  }

  /**
   * ✅ adm_pattern_history_tb 에 기재된 발행 패턴을 통하여 전표번호 등을 자동발행하는 함수
   * @param params 
   * @returns 자동발행 번호
   */
   public getPattern = async (params: {
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
    // 📌 Table 및 Column명을 통하여 자동발행 패턴 검색
    const pattern = await this.patternOptRepo.readPattern({ table_nm: params.table_nm, col_nm: params.col_nm, tran: params.tran });
    // 📌 자동발행 패턴이 없을 경우 Return
    if (!pattern) { return null; }
    
    // 📌 해당 자동발행 패턴의 Max Seq 검색
    const maxSeq = await this.repo.getMaxSeq({
      factory_id: params.factory_id,
      table_nm: params.table_nm,
      col_nm: params.col_nm, 
      pattern: pattern, 
      reg_date: params.reg_date
    }, params.tran);
    const seq = maxSeq + 1;

    if (maxSeq == 0) {
      // 📌 Max Seq가 없을 경우 Seq 새로 입력
      await this.repo.create([{
        factory_id: params.factory_id, 
        table_nm: params.table_nm, 
        col_nm: params.col_nm, 
        pattern: pattern, 
        reg_date: params.reg_date,
        seq: seq
      }], params.uid, params.tran)
    } else {
      // 📌 기존 Max Seq에 사용한 Seq 입력
      await this.repo.updateSeqByGroup({ 
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
    if (result.indexOf('{DN}') >= 0) { result = result.replace('{DN}', (await this.shiftRepo.readRawByUuid(params.shift_uuid as string)).raws[0].shift_nm); }
    if (result.indexOf('{EQ}') >= 0) { result = result.replace('{EQ}', (await this.equipRepo.readRawByUuid(params.equip_uuid as string)).raws[0].equip_cd); }
    if (result.indexOf('{PT}') >= 0) { result = result.replace('{PT}', (await this.partnerRepo.readRawByUuid(params.partner_uuid as string)).raws[0].partner_cd); }
    if (result.indexOf('{PC}') >= 0) { result = result.replace('{PC}', (await this.procRepo.readRawByUuid(params.proc_uuid as string)).raws[0].proc_cd); }

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
}

export default AdmPatternHistoryService;