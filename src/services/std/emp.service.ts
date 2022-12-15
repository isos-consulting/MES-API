import { Transaction } from "sequelize/types";
import StdEmpRepo from '../../repositories/std/emp.repository';
import AutUserRepo from '../../repositories/aut/user.repository';
import StdDeptRepo from '../../repositories/std/dept.repository';
import StdGradeRepo from '../../repositories/std/grade.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class StdEmpService {
  tenant: string;
  stateTag: string;
  repo: StdEmpRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'stdEmp';
    this.repo = new StdEmpRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'user',
        TRepo: AutUserRepo,
        idName: 'uid',
        uuidName: 'user_uuid'
      },
      {
        key: 'dept',
        TRepo: StdDeptRepo,
        idName: 'dept_id',
        uuidName: 'dept_uuid'
      },
      {
        key: 'grade',
        TRepo: StdGradeRepo,
        idName: 'grade_id',
        uuidName: 'grade_uuid'
      },
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
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

	public readRawByUuid = async (uuid: string) => {
    try { return await this.repo.readRawByUuid(uuid); } 
		catch (error) { throw error; }
  };

  public readByWorkings = async (workings_uuid: string) => {
    try { return await this.repo.readByWorkings(workings_uuid); }
    catch (error) { throw error; }
  }

  public update = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  }

  public patch = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  }

  public delete = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  }
}

export default StdEmpService;