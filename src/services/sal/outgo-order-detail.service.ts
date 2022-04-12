import { Transaction } from "sequelize/types";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import SalOutgoOrderDetailRepo from '../../repositories/sal/outgo-order-detail.repository';
import SalOutgoOrderRepo from '../../repositories/sal/outgo-order.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import SalOrderDetailRepo from '../../repositories/sal/order-detail.repository';

class SalOutgoOrderDetailService {
  tenant: string;
  stateTag: string;
  repo: SalOutgoOrderDetailRepo;
  detailRepo: SalOutgoOrderDetailRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'salOutgoOrderDetail';
    this.repo = new SalOutgoOrderDetailRepo(tenant);
    this.detailRepo = new SalOutgoOrderDetailRepo(tenant);

    this.fkIdInfos = [
			{
				key: 'outgoOrder',
				TRepo: SalOutgoOrderRepo,
				idName: 'outgo_order_id',
				uuidName: 'outgo_order_uuid'
			},
			{
				key: 'uuid',
				TRepo: SalOutgoOrderDetailRepo,
				idName: 'outgo_order_detail_id',
				uuidName: 'uuid'
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
				key: 'orderDetail',
				TRepo: SalOrderDetailRepo,
				idName: 'order_detail_id',
				uuidName: 'order_detail_uuid'
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

	public updateComplete = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.updateComplete(datas, uid, tran); } 
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
   * 입력한 전표에 해당하는 상세전표의 개수 조회
   * @param id 전표의 ID
   * @param tran DB Transaction
   * @returns 상세전표의 개수
   */
	public getCountInHeader = async (id: number, tran?: Transaction) => {
		try { return await this.repo.getCount(id, tran); } 
		catch (error) { throw error; }
	}
}

export default SalOutgoOrderDetailService;