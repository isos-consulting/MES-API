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
   * 외주투입 선입선출에서 사용하는 외주창고의 ID 반환
   * @param tran DB Transaction
   * @returns 외주창고가 있을 경우 ID 반환, 없을 경우 Error Throw
   */
   public getOutsourcingStoreId = async (tran?: Transaction) => {
    try { 
      const read = await this.repo.readRawAll(tran);
      const outsourcingStore = read.raws.filter(raw => raw.outsourcing_store_fg === true);

      const storeId = outsourcingStore[0]?.store_id;

      if (!storeId) {
        throw createApiError(
          400, 
          {
            admin_message: `외주창고가 존재하지 않습니다.`,
            user_message: `외주창고가 존재하지 않습니다.`,
          }, 
          this.stateTag, 
          errorState.NO_DATA
        );
      }

      return storeId;
    } 
		catch (error) { throw error; }
  }

  /**
   * 입력한 창고가 해당 창고유형에 속하는지 검증
   * @param storeId 창고ID
   * @param storeType 창고유형
   * @param tran DB Transaction
   * @returns 검증 성공시 true, 실패시 Error Throw
   */
  private validateStoreTypeById = async (storeId: number, storeType: TStoreType, tran?: Transaction) => {
    try { 
      const read = await this.repo.readRawById(storeId, tran);
      if (read.count === 0) {
        throw createApiError(
          400, 
          { 
            admin_message: `일치하는 창고유형이 없습니다. [창고유형: ${storeType}]`, 
            user_message: '창고유형정보가 존재하지 않습니다.'
          }, 
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

  /**
   * 입력한 여러개의 창고가 해당 창고유형에 속하는지 검증
   * @param storeIds 여러개의 창고ID
   * @param tran DB Transaction
   * @returns 검증 성공시 true, 실패시 Error Throw
   */
   public validateStoreTypeByIds = async (storeIds: number[], storeType: TStoreType, tran?: Transaction) => {
    const storeIdSet = new Set(storeIds);

    await Promise.all([
      // 📌 입고창고가 가용창고가 아닌 경우에 대한 Valdation
      storeIdSet.forEach(async (id) => {
        const validated = await this.validateStoreTypeById(id, storeType, tran);
        if (!validated) {
          throw createApiError(
            400, 
            {
              admin_message: `유효하지 않은 창고 유형입니다. [창고유형: ${storeType}]`, 
              user_message: '창고유형코드값이 존재하지 않습니다.'
            }, 
            this.stateTag, 
            errorState.INVALID_DATA
          );
        }
      }),
    ]);

    return true;
  }
}

export default StdStoreService;