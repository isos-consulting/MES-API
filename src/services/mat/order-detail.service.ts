import { Transaction } from "sequelize/types";
import MatOrderDetailRepo from "../../repositories/mat/order-detail.repository";
import MatOrderRepo from "../../repositories/mat/order.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdMoneyUnitRepo from "../../repositories/std/money-unit.repository";
import StdUnitRepo from "../../repositories/std/unit.repository";
import StdProdRepo from "../../repositories/std/prod.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class MatOrderDetailService {
  tenant: string;
  stateTag: string;
  repo: MatOrderDetailRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'matOrderDetail';
    this.repo = new MatOrderDetailRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'uuid',
        TRepo: MatOrderDetailRepo,
        idName: 'order_detail_id',
        uuidName: 'uuid'
      },
      {
        key: 'orderDetail',
        TRepo: MatOrderDetailRepo,
        idName: 'order_detail_id',
        uuidName: 'order_detail_uuid'
      },
      {
        key: 'order',
        TRepo: MatOrderRepo,
        idName: 'order_id',
        uuidName: 'order_uuid'
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

  public readRawById = async (id: number) => {
    try { return await this.repo.readRawById(id); } 
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

	public updateComplete = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.updateComplete(datas, uid, tran); } 
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
   * 자재입하상세 데이터의 입하수량 * 단가 * 환율을 합계금액(total_price)로 입력하여 수정
   * @param datas 자재입하상세 데이터
   * @param uid 입력 사용자ID
   * @param tran DB Transaction
   * @returns total_price가 추가 된 자재입하상세 데이터
   */
  public updateTotalPrice = async (datas: any[], uid: number, tran?: Transaction) => {
    datas = datas.map((data: any) => {
      data.total_price = data.qty * data.price * data.exchange; 
      return data;
    });

    return await this.repo.patch(datas, uid, tran);
  }
}

export default MatOrderDetailService;