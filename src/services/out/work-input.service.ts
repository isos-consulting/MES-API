import { Transaction } from "sequelize/types";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdLocationRepo from "../../repositories/std/location.repository";
import StdProdRepo from "../../repositories/std/prod.repository";
import StdStoreRepo from "../../repositories/std/store.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import InvStoreRepo from "../../repositories/inv/store.repository";
import createApiError from "../../utils/createApiError";
import { errorState } from "../../states/common.state";
import OutWorkInputRepo from "../../repositories/out/work-input.repository";
import OutReceiveDetailRepo from "../../repositories/out/receive-detail.repository";
import StdBomRepo from "../../repositories/std/bom.repository";
import InvStoreService from "../inv/store.service";

class OutWorkInputService {
  tenant: string;
  stateTag: string;
  repo: OutWorkInputRepo;
  stdStoreRepo: StdStoreRepo;
  storeRepo: InvStoreRepo;
  bomRepo: StdBomRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'outIncomeDetail';
    this.repo = new OutWorkInputRepo(tenant);
    this.stdStoreRepo = new StdStoreRepo(tenant);
    this.storeRepo = new InvStoreRepo(tenant);
    this.bomRepo = new StdBomRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'workInput',
        TRepo: OutWorkInputRepo,
        idName: 'work_input_id',
        uuidName: 'work_input_uuid'
      },
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'receiveDetail',
        TRepo: OutReceiveDetailRepo,
        idName: 'receive_detail_id',
        uuidName: 'receive_detail_uuid'
      },
      {
        key: 'fromStore',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        idAlias: 'from_store_id',
        uuidName: 'from_store_uuid'
      },
      {
        key: 'fromLocation',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        idAlias: 'from_location_id',
        uuidName: 'from_location_uuid'
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
      const read = await this.stdStoreRepo.readRawAll(tran);
      const outsourcingStore = read.raws.filter(raw => raw.outsourcing_fg === true);

      const storeId = outsourcingStore[0]?.store_id;

      if (!storeId) {
        throw createApiError(
          400, 
          `외주창고가 존재하지 않습니다.`, 
          this.stateTag, 
          errorState.NO_DATA
        );
      }

      return storeId;
    } 
		catch (error) { throw error; }
  }

  /**
   * 입력 데이터 기반 선입선출 외주투입 데이터 생성
   * @param params 외주투입 생성에 필요한 매개변수
   * @param regDate 기준일자
   * @param partnerId 거래처ID
   * @param allowMinus 마이너스 재고 허용여부
   * @returns 선입선출이 적용된 투입 데이터
   */
  getPullInputBody = async (
    params: { 
      factory_id: number,
      prod_id: number,
      qty: number,
      receive_detail_id: number
    }, 
    regDate: string, 
    partnerId: number, 
    allowMinus: boolean
  ) => {
    const storeService = new InvStoreService(this.tenant);
    const storeId = this.getOutsourcingStoreId();

    // 📌 입고 품목에 대한 하위 BOM 리스트 조회
    const childs = await this.bomRepo.readByParent(params.factory_id, params.prod_id);

    // 📌 BOM 하위 품목에 대한 선입선출 기준 외주투입 데이터 생성 (2차원 배열)
    const resultArray = await Promise.all(
      childs.raws.map(async child => {
        // 📌 투입 품목 기준 선입선출 수불 데이터 생성
        const calculated = await storeService.getCalculatedFifoData(
          {
            factory_id: child.factory_id,
            prod_id: child.prod_id,
            store_id: storeId,
            partner_id: partnerId,
          },
          regDate,
          params.qty * child.c_usage,
          allowMinus
        );

        // 📌 수불 데이터 기준 외주 투입 데이터 생성
        return calculated.map(cal => {
          return {
            factory_id: cal.factory_id,
            receive_detail_id: params.receive_detail_id,
            prod_id: cal.prod_id,
            lot_no: cal.lot_no,
            qty: cal.qty,
            c_usage: child.c_usage,
            from_store_id: storeId
          }
        });
      })
    );

    // 📌 2차원 배열을 1차원 배열 형태로 변환
    //    결과물: 투입데이터를 가지고 있는 배열
    let result: any[] = [];
    resultArray.forEach(data => { result = [...result, ...data]; });

    return result;
  }

  /**
   * 외주입하상세ID를 기준으로 외주투입 데이터 삭제
   * @param ids 외주입하상세ID 리스트
   * @param uid 입력 사용자ID
   * @param tran DB Transaction
   * @returns 외주투입 Result
   */
  public deleteByReceiveDetailIds = async (ids: number[], uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByReceiveDetailIds(ids, uid, tran); }
    catch (error) { throw error; }
  }
}

export default OutWorkInputService;