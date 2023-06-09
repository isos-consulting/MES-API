import moment from "moment";
import { Transaction } from "sequelize/types";
import StdWorkTypeRepo from "../../repositories/std/work-type.repository";
import StdWorktimeTypeRepo from "../../repositories/std/worktime-type.repository";
import StdWorktimeRepo from "../../repositories/std/worktime.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class StdWorktimeService {
  tenant: string;
  stateTag: string;
  repo: StdWorktimeRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'stdWorktime';
    this.repo = new StdWorktimeRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'workType',
        TRepo: StdWorkTypeRepo,
        idName: 'work_type_id',
        uuidName: 'work_type_uuid'
      },
      {
        key: 'worktimeType',
        TRepo: StdWorktimeTypeRepo,
        idName: 'worktime_type_id',
        uuidName: 'worktime_type_uuid'
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

  public workHours = async (params: any) => {
    try {
      params['use_fg'] = true;
      const result = await this.read(params);
      
      if (result.count === 0) {
        return result;
      }

      let workMinutes = 0;
      result.raws.forEach(value => {
          const startTime = moment(value.start_time, 'HH:mm');
          const endTime = moment(value.end_time, 'HH:mm');

          const diffMinutes = moment.duration(endTime.diff(startTime)).asMinutes();

          if (value.break_time_fg) {
            workMinutes -= diffMinutes;
          } else {
            workMinutes += diffMinutes;
          }
        }
      );

      const workHours = Math.round(workMinutes / 60 * 100) / 100;

      return {
        count: 1,
        raws: [ { work_hours: workHours } ]
      };

    } catch (error) { throw error; }
  }

}

export default StdWorktimeService;