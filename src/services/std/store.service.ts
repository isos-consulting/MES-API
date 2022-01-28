import { Transaction } from "sequelize/types";
import StdStoreRepo from '../../repositories/std/store.repository';
import StdFactoryRepo from "../../repositories/std/factory.repository";
import { errorState } from "../../states/common.state";
import TStoreType from "../../types/store-type.type";
import createApiError from "../../utils/createApiError";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class StdStoreService {
  tenant: string;
  stateTag: string;
  repo: StdStoreRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'stdStore';
    this.repo = new StdStoreRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
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
    try { return await this.repo.patch(datas, uid, tran); }
		catch (error) { throw error; }
  }

  public delete = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  }

  /**
   * 입력한 창고가 해당 창고유형에 속하는지 검증
   * @param storeId 창고ID
   * @param storeType 창고유형
   * @param tran DB Transaction
   * @returns 
   */
  public validateStoreType = async (storeId: number, storeType: TStoreType, tran?: Transaction) => {
    try { 
      const read = await this.repo.readRawById(storeId, tran);
      if (read.count === 0) {
        throw createApiError(
          400, 
          `일치하는 창고유형이 없습니다. [창고유형: ${storeType}]`, 
          this.stateTag, 
          errorState.NO_DATA
        );
      }
      
      switch (storeType) {
        case 'AVAILABLE': return read.raws[0].available_store_fg;
        case 'RETURN': return read.raws[0].return_store_fg;
        case 'REJECT': return read.raws[0].reject_store_fg;
        case 'FINAL_INSP': return read.raws[0].final_insp_store_fg;
        case 'OUTGO': return read.raws[0].outgo_store_fg;
        case 'OUTSOURCING': return read.raws[0].outsourcing_store_fg;
      }
    } 
		catch (error) { throw error; }
  }
}

export default StdStoreService;