import { Transaction } from "sequelize/types";
import SalReturnDetailRepo from "../../repositories/sal/return-detail.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdLocationRepo from "../../repositories/std/location.repository";
import StdMoneyUnitRepo from "../../repositories/std/money-unit.repository";
import StdProdRepo from "../../repositories/std/prod.repository";
import StdStoreRepo from "../../repositories/std/store.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import SalReturnRepo from "../../repositories/sal/return.repository";
import StdUnitRepo from "../../repositories/std/unit.repository";
import SalOutgoDetailRepo from "../../repositories/sal/outgo-detail.repository";
import StdRejectRepo from "../../repositories/std/reject.repository";

class SalReturnDetailService {
  tenant: string;
  stateTag: string;
  repo: SalReturnDetailRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'salReturnDetail';
    this.repo = new SalReturnDetailRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'uuid',
        TRepo: SalReturnDetailRepo,
        idName: 'return_detail_id',
        uuidName: 'uuid'
      },
      {
        key: 'returnDetail',
        TRepo: SalReturnDetailRepo,
        idName: 'return_detail_id',
        uuidName: 'return_detail_uuid'
      },
      {
        key: 'return',
        TRepo: SalReturnRepo,
        idName: 'return_id',
        uuidName: 'return_uuid'
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
        key: 'unit',
        TRepo: StdUnitRepo,
        idName: 'unit_id',
        uuidName: 'unit_uuid'
      },
      {
        key: 'moneyUnit',
        TRepo: StdMoneyUnitRepo,
        idName: 'money_unit_id',
        uuidName: 'money_unit_uuid'
      },
      {
        key: 'reject',
        TRepo: StdRejectRepo,
        idName: 'reject_id',
        uuidName: 'reject_uuid'
      },
      {
        key: 'outgoDetail',
        TRepo: SalOutgoDetailRepo,
        idName: 'outgo_detail_id',
        uuidName: 'outgo_detail_uuid'
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
   * @param id 전표의 ID
   * @param tran DB Transaction
   * @returns 상세전표의 개수
   */
   public getCountInHeader = async (id: number, tran?: Transaction) => {
    try { return await this.repo.getCount(id, tran); } 
    catch (error) { throw error; }
  }

  /**
   * 입력한 전표에 해당하는 상세전표의 Max Sequence 조회
   * @param id 전표의 ID
   * @param tran DB Transaction
   * @returns Sequence
   */
  public getMaxSeq = async (id: number, tran?: Transaction) => {
    try { return await this.repo.getMaxSeq(id, tran); } 
    catch (error) { throw error; }
  }
  
  /**
   * 제품반입상세 데이터의 반출수량 * 단가 * 환율을 합계금액(total_price)로 입력하여 수정
   * @param datas 제품반입상세 데이터
   * @param uid 입력 사용자ID
   * @param tran DB Transaction
   * @returns total_price가 추가 된 제품반입상세 데이터
   */
  public updateTotalPrice = async (datas: any[], uid: number, tran?: Transaction) => {
    datas = datas.map((data: any) => {
      data.total_price = data.qty * data.price * data.exchange; 
      return data;
    });

    return await this.repo.patch(datas, uid, tran);
  }
}

export default SalReturnDetailService;