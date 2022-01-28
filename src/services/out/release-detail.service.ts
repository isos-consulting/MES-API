import { Transaction } from "sequelize/types";
import OutReleaseDetailRepo from "../../repositories/out/release-detail.repository";
import MatOrderDetailRepo from "../../repositories/mat/order-detail.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdLocationRepo from "../../repositories/std/location.repository";
import StdMoneyUnitRepo from "../../repositories/std/money-unit.repository";
import StdProdRepo from "../../repositories/std/prod.repository";
import StdStoreRepo from "../../repositories/std/store.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import getStoreBody from "../../utils/getStoreBody_new";
import AdmTranTypeService from "../adm/tran-type.service";
import InvStoreRepo from "../../repositories/inv/store.repository";
import ApiResult from "../../interfaces/common/api-result.interface";
import StdStoreService from "../std/store.service";
import createApiError from "../../utils/createApiError";
import { errorState } from "../../states/common.state";
import OutReleaseRepo from "../../repositories/out/release.repository";

class OutReleaseDetailService {
  tenant: string;
  stateTag: string;
  repo: OutReleaseDetailRepo;
  storeRepo: InvStoreRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'outReleaseDetail';
    this.repo = new OutReleaseDetailRepo(tenant);
    this.storeRepo = new InvStoreRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'uuid',
        TRepo: OutReleaseDetailRepo,
        idName: 'release_detail_id',
        uuidName: 'uuid'
      },
      {
        key: 'releaseDetail',
        TRepo: OutReleaseDetailRepo,
        idName: 'release_detail_id',
        uuidName: 'release_detail_uuid'
      },
      {
        key: 'release',
        TRepo: OutReleaseRepo,
        idName: 'release_id',
        uuidName: 'release_uuid'
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
        key: 'moneyUnit',
        TRepo: StdMoneyUnitRepo,
        idName: 'money_unit_id',
        uuidName: 'money_unit_uuid'
      },
      {
        key: 'orderDetail',
        TRepo: MatOrderDetailRepo,
        idName: 'order_detail_id',
        uuidName: 'order_detail_uuid'
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
      {
        key: 'toStore',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        idAlias: 'to_store_id',
        uuidName: 'to_store_uuid'
      },
      {
        key: 'toLocation',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        idAlias: 'to_location_id',
        uuidName: 'to_location_uuid'
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
   * 입력한 전표에 해당하는 상세전표의 개수 조회
   * @param inspId 전표의 ID
   * @param tran DB Transaction
   * @returns 상세전표의 개수
   */
   public getCountInHeader = async (inspId: number, tran?: Transaction) => {
    try { return await this.repo.getCount(inspId, tran); } 
    catch (error) { throw error; }
  }

  /**
   * 입력한 전표에 해당하는 상세전표의 Max Sequence 조회
   * @param inspId 전표의 ID
   * @param tran DB Transaction
   * @returns Sequence
   */
  public getMaxSeq = async (inspId: number, tran?: Transaction) => {
    try { return await this.repo.getMaxSeq(inspId, tran); } 
    catch (error) { throw error; }
  }

  /**
   * 외주출고에 의한 창고수불 데이터 생성 (가용창고 => 외주창고)
   * @param datas 외주출고상세 데이터
   * @param regDate 외주출고전표 기준일자
   * @param uid 입력 사용자ID
   * @param tran DB Transaction
   * @returns 창고수불 Result
   */
  public inputInInventory = async (datas: any[], regDate: string, uid: number, tran: Transaction) => {
    const tranTypeService = new AdmTranTypeService(this.tenant);
    const tranTypeId = await tranTypeService.getIdByCd('OUT_RELEASE');

    const fromStoreBody = getStoreBody({
      datas,
      inout: 'FROM',
      tran_type_id: tranTypeId,
      reg_date: regDate,
      tran_id_alias: 'release_detail_id'
    });

    const toStoreBody = getStoreBody({
      datas,
      inout: 'TO',
      tran_type_id: tranTypeId,
      reg_date: regDate,
      tran_id_alias: 'release_detail_id'
    });

    const fromStoreResult = await this.storeRepo.create(fromStoreBody, uid, tran);
    const toStoreResult = await this.storeRepo.create(toStoreBody, uid, tran);
    const result: ApiResult<any> = {
      raws: [...fromStoreResult.raws, ...toStoreResult.raws],
      count: fromStoreResult.count + toStoreResult.count
    };

    return result;
  }

  /**
   * 외주출고에 의한 창고수불 기존 데이터 수정 (가용창고 => 외주창고)
   * @param datas 외주출고상세 데이터
   * @param regDate 외주출고전표 기준일자
   * @param uid 입력 사용자ID
   * @param tran DB Transaction
   * @returns 창고수불 Result
   */
  public changeInInventory = async (datas: any[], regDate: string, uid: number, tran: Transaction) => {
    const tranTypeService = new AdmTranTypeService(this.tenant);
    const tranTypeId = await tranTypeService.getIdByCd('OUT_RELEASE');

    const fromStoreBody = getStoreBody({
      datas,
      inout: 'FROM',
      tran_type_id: tranTypeId,
      reg_date: regDate,
      tran_id_alias: 'release_detail_id'
    });

    const toStoreBody = getStoreBody({
      datas,
      inout: 'TO',
      tran_type_id: tranTypeId,
      reg_date: regDate,
      tran_id_alias: 'release_detail_id'
    });

    const fromStoreResult = await this.storeRepo.updateToTransaction(fromStoreBody, uid, tran);
    const toStoreResult = await this.storeRepo.updateToTransaction(toStoreBody, uid, tran);
    const result: ApiResult<any> = {
      raws: [...fromStoreResult.raws, ...toStoreResult.raws],
      count: fromStoreResult.count + toStoreResult.count
    };

    return result;
  }

  /**
   * 외주출고에 의한 창고수불 데이터 삭제 (가용창고 => 외주창고)
   * @param datas 외주출고상세 데이터
   * @param uid 입력 사용자ID
   * @param tran DB Transaction
   * @returns 창고수불 Result
   */
  public removeInInventory = async (datas: any[], uid: number, tran: Transaction) => {
    const tranTypeService = new AdmTranTypeService(this.tenant);
    const tranTypeId = await tranTypeService.getIdByCd('OUT_RELEASE');

    const fromStoreBody = getStoreBody({
      datas,
      inout: 'FROM',
      tran_type_id: tranTypeId,
      tran_id_alias: 'release_detail_id'
    });

    const toStoreBody = getStoreBody({
      datas,
      inout: 'TO',
      tran_type_id: tranTypeId,
      tran_id_alias: 'release_detail_id'
    });

    const fromStoreResult = await this.storeRepo.deleteToTransaction(fromStoreBody, uid, tran);
    const toStoreResult = await this.storeRepo.deleteToTransaction(toStoreBody, uid, tran);
    const result: ApiResult<any> = {
      raws: [...fromStoreResult.raws, ...toStoreResult.raws],
      count: fromStoreResult.count + toStoreResult.count
    };

    return result;
  }

  /**
   * 외주출고상세 데이터의 출고수량 * 단가 * 환율을 합계금액(total_price)로 추가하여 반환
   * @param datas 외주출고상세 데이터
   * @returns total_price가 추가 된 외주출고상세 데이터
   */
  public calculateTotalPrice = (datas: any[]) => {
    return datas.map((data: any) => {
      data.total_price = data.qty * data.price * data.exchange; 
      return data;
    });
  }

  /**
   * 외주출고상세 데이터의 창고가 유효한 데이터인지 검증  
   * 출고(가용창고) => 입고(외주창고)
   * @param datas 외주출고상세 데이터
   * @param tran DB Transaction
   * @returns 검증 성공시 true, 실패시 Error Throw
   */
  public validateStoreType = async (datas: any[], tran: Transaction) => {
    const storeService = new StdStoreService(this.tenant);
    let fromStoreIds = new Set<number>();
    let toStoreIds = new Set<number>();

    datas.forEach(data => {
      fromStoreIds.add(data.from_store_id);
      toStoreIds.add(data.to_store_id);
    });

    await Promise.all([
      // 📌 출고창고가 가용창고가 아닌 경우에 대한 Valdation
      fromStoreIds.forEach(async (id) => {
        const validated = await storeService.validateStoreType(id, 'AVAILABLE', tran);
        if (!validated) {
          throw createApiError(
            400, 
            `유효하지 않은 출고창고 유형입니다.`, 
            this.stateTag, 
            errorState.INVALID_DATA
          );
        }
      }),

      // 📌 입고창고가 외주창고가 아닌 경우에 대한 Valdation
      toStoreIds.forEach(async (id) => {
        const validated = await storeService.validateStoreType(id, 'OUTSOURCING', tran);
        if (!validated) {
          throw createApiError(
            400, 
            `유효하지 않은 입고창고 유형입니다.`, 
            this.stateTag, 
            errorState.INVALID_DATA
          );
        }
      }),
    ]);

    return true;
  }
}

export default OutReleaseDetailService;