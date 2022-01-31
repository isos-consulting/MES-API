import { Transaction } from "sequelize/types";
import StdRoutingResourceRepo from "../../repositories/std/routing-resource.repository";
import StdEquipRepo from "../../repositories/std/equip.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import StdRoutingRepo from "../../repositories/std/routing.repository";
import MldMoldRepo from "../../repositories/mld/mold.repository";
import createApiError from "../../utils/createApiError";
import { errorState } from "../../states/common.state";

class StdRoutingResourceService {
  tenant: string;
  stateTag: string;
  repo: StdRoutingResourceRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'stdRoutingResource';
    this.repo = new StdRoutingResourceRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'routing',
        TRepo: StdRoutingRepo,
        idName: 'routing_id',
        uuidName: 'routing_uuid'
      },
      {
        key: 'equip',
        TRepo: StdEquipRepo,
        idName: 'equip_id',
        uuidName: 'equip_uuid'
      },
      {
        key: 'mold',
        TRepo: MldMoldRepo,
        idName: 'mold_id',
        uuidName: 'mold_uuid'
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
    try { 
      switch (params.resource_type) {
        case 'equip': params.resource_type = '설비'; break;
        case 'mold': params.resource_type = '금형'; break;
        case 'emp': params.resource_type = '인원'; break;
        default: params.resource_type = null; break;
      }
      return await this.repo.read(params); 
    } 
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
   * 자원 유형(설비, 금형, 인원)에 따라 필요한 Data의 여부 검증  
   * resource_type: 설비 [equip_id]
   * resource_type: 금형 [mold_id]
   * resource_type: 인원 [emp_cnt]
   * @param datas 생산자원 Data Array
   * @returns 검증 성공시 true, 실패시 Throw Error
   */
   public validateResourceType = (datas: any[]) => {
    try {
      datas.forEach((data: any) => {
        // 📌 설비자원
        if (data.resource_type === '설비' && !data.equip_id) {
          throw createApiError(
            400, 
            `설비자원에 필요한 요소가 입력되지 않았습니다. [equip_uuid]`, 
            this.stateTag, 
            errorState.NO_INPUT_REQUIRED_VALUE
          );
        }
        
        // 📌 금형자원
        if (data.resource_type === '금형' && !data.mold_id) {
          throw createApiError(
            400, 
            `금형자원에 필요한 요소가 입력되지 않았습니다. [mold_uuid]`, 
            this.stateTag, 
            errorState.NO_INPUT_REQUIRED_VALUE
          );
        }

        // 📌 인원자원
        if (data.resource_type === '인원' && !data.emp_cnt) {
          throw createApiError(
            400, 
            `인원자원에 필요한 요소가 입력되지 않았습니다. [emp_cnt]`, 
            this.stateTag, 
            errorState.NO_INPUT_REQUIRED_VALUE
          );
        }
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default StdRoutingResourceService;