import { Transaction } from "sequelize/types";
import OutReleaseDetailRepo from "../../repositories/out/release-detail.repository";
import MatOrderDetailRepo from "../../repositories/mat/order-detail.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdLocationRepo from "../../repositories/std/location.repository";
import StdMoneyUnitRepo from "../../repositories/std/money-unit.repository";
import StdProdRepo from "../../repositories/std/prod.repository";
import StdStoreRepo from "../../repositories/std/store.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import InvStoreRepo from "../../repositories/inv/store.repository";
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
}

export default OutReleaseDetailService;