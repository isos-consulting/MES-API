import { Transaction } from "sequelize/types";
import IPrdWorkDowntime from "../../interfaces/prd/work-downtime.interface";
import PrdWorkRepo from '../../repositories/prd/work.repository';
import PrdWorkDowntimeRepo from "../../repositories/prd/work-downtime.repository";
import PrdWorkRoutingRepo from '../../repositories/prd/work-routing.repository';
import StdDowntimeRepo from '../../repositories/std/downtime.repository';
import StdEquipRepo from '../../repositories/std/equip.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import getSubtractTwoDates from "../../utils/getSubtractTwoDates";
import createApiError from "../../utils/createApiError";
import { errorState } from "../../states/common.state";
import ApiResult from "../../interfaces/common/api-result.interface";

class PrdWorkDowntimeService {
  tenant: string;
  stateTag: string;
  repo: PrdWorkDowntimeRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'prdWorkDowntime';
    this.repo = new PrdWorkDowntimeRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'work',
        TRepo: PrdWorkRepo,
        idName: 'work_id',
        uuidName: 'work_uuid'
      },
      {
        key: 'workRouting',
        TRepo: PrdWorkRoutingRepo,
        idName: 'work_routing_id',
        uuidName: 'work_routing_uuid'
      },
      {
        key: 'equip',
        TRepo: StdEquipRepo,
        idName: 'equip_id',
        uuidName: 'equip_uuid'
      },
      {
        key: 'downtime',
        TRepo: StdDowntimeRepo,
        idName: 'downtime_id',
        uuidName: 'downtime_uuid'
      }
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IPrdWorkDowntime[], uid: number, tran: Transaction) => {
    try { 
      let result: ApiResult<any> = { count: 0, raws: [] };

      for await (const data of datas) {
        // 📌 Date Duplicated Interlock
        this.validateDuplicatedTime(data, tran);

        const tempResult = await this.repo.create([data], uid, tran); 
        result.raws = [...result.raws, ...tempResult.raws];
        result.count += tempResult.count;
      }

      return result;
    }
		catch (error) { throw error; }
  };

  public read = async (params: any) => {
    try { return await this.repo.read(params); }
		catch (error) { throw error; }
  };
  
  public readByUuid = async (uuid: string) => {
    try { return await this.repo.readByUuid(uuid); } 
		catch (error) { throw error; }
  };

  public readReport = async (params: any) => {
    try { return await this.repo.readReport(params); } 
		catch (error) { throw error; }
  };

  public update = async (datas: IPrdWorkDowntime[], uid: number, tran: Transaction) => {
    try { 
      let result: ApiResult<any> = { count: 0, raws: [] };

      for await (const data of datas) {
        // 📌 Date Duplicated Interlock
        this.validateDuplicatedTime(data, tran);

        const tempResult = await this.repo.update([data], uid, tran); 
        result.raws = [...result.raws, ...tempResult.raws];
        result.count += tempResult.count;
      }

      return result;
    }
		catch (error) { throw error; }
  };

  public patch = async (datas: IPrdWorkDowntime[], uid: number, tran: Transaction) => {
    try { 
      let result: ApiResult<any> = { count: 0, raws: [] };

      for await (const data of datas) {
        // 📌 Date Duplicated Interlock
        this.validateDuplicatedTime(data, tran);

        const tempResult = await this.repo.patch([data], uid, tran); 
        result.raws = [...result.raws, ...tempResult.raws];
        result.count += tempResult.count;
      }

      return result;
    }
		catch (error) { throw error; }
  };

  public delete = async (datas: IPrdWorkDowntime[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public deleteByWorkId = async (workId: number, uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByWorkId(workId, uid, tran); }
    catch (error) { throw error; }
  }

  public validateDateDiff = (datas: any[]) => {
    try {
      const result = datas.map((data: any) => {
        // 📌 발생일시 데이터 검증
        if (data.start_date && data.end_date) {
          const occurTime = getSubtractTwoDates(data.start_date, data.end_date);
          if (occurTime < 0) { 
            throw createApiError(
              400, 
              {
                admin_message: `잘못된 작업시작일시(start_date) 및 작업종료일시(end_date)가 입력되었습니다. [${data.start_date}, ${data.end_date}]`, 
                user_message: `잘못된 작업시작일시(${data.start_date}) 및 작업종료일시(${data.end_date})가 입력되었습니다.`
              },
              this.stateTag, 
              errorState.INVALID_DIFF_DATE
            );
          }
        }
        return data;
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  private validateDuplicatedTime = async (data: IPrdWorkDowntime, tran: Transaction) => {
    const count = await this.repo.getCountDuplicatedTime(data.start_date as string, data.end_date as string, data.equip_id as number, tran);
    if (count > 0) {
      throw createApiError(
        400, 
        { 
          admin_message: `시간내에 이미 등록된 비가동 내역이 존재합니다. [${data.start_date}, ${data.end_date}, ${data.equip_id}]`,
          user_message: `시간내에 이미 등록된 비가동 내역이 존재합니다.`
        }, 
        this.stateTag, 
        errorState.INVALID_DUP_DATA
      );
    }
  }

}

export default PrdWorkDowntimeService;