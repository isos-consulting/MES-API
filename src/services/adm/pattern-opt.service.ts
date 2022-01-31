import { Transaction } from "sequelize/types";
import AdmPatternOptRepo from "../../repositories/adm/pattern-opt.repository";

class AdmPatternOptService {
  tenant: string;
  stateTag: string;
  repo: AdmPatternOptRepo;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'admPatternOpt';
    this.repo = new AdmPatternOptRepo(tenant);
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
   * 입력한 모듈의 자동발행번호 옵션 존재여부 조회
   * @param params 
   *  table_nm: 테이블명  
   *  col_nm: 컬럼명  
   *  tran: DB Transaction
   * @returns 옵션 존재여부(boolean)
   */
   public hasAutoOption = async (params: {
    table_nm: string,
    col_nm: string,
    tran: Transaction
  }) => {
    // 📌 Table 및 Column명을 통하여 자동발행 패턴 검색
    const pattern = await this.repo.readPattern(params);

    // 📌 자동발행 패턴이 없을 경우 Return
    if (!pattern) { return false; }

    return true;
  }
}

export default AdmPatternOptService;