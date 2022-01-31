import { Transaction } from "sequelize/types";
import OutReceiveDetailRepo from "../../repositories/out/receive-detail.repository";
import MatOrderDetailRepo from "../../repositories/mat/order-detail.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdLocationRepo from "../../repositories/std/location.repository";
import StdMoneyUnitRepo from "../../repositories/std/money-unit.repository";
import StdProdRepo from "../../repositories/std/prod.repository";
import StdStoreRepo from "../../repositories/std/store.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import InvStoreRepo from "../../repositories/inv/store.repository";
import StdStoreService from "../std/store.service";
import createApiError from "../../utils/createApiError";
import { errorState } from "../../states/common.state";
import OutReceiveRepo from "../../repositories/out/receive.repository";
import StdUnitRepo from "../../repositories/std/unit.repository";
import QmsInspResultRepo from "../../repositories/qms/insp-result.repository";

class OutReceiveDetailService {
  tenant: string;
  stateTag: string;
  repo: OutReceiveDetailRepo;
  storeRepo: InvStoreRepo;
  inspResultRepo: QmsInspResultRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'outReceiveDetail';
    this.repo = new OutReceiveDetailRepo(tenant);
    this.storeRepo = new InvStoreRepo(tenant);
    this.inspResultRepo = new QmsInspResultRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'uuid',
        TRepo: OutReceiveDetailRepo,
        idName: 'receive_detail_id',
        uuidName: 'uuid'
      },
      {
        key: 'receiveDetail',
        TRepo: OutReceiveDetailRepo,
        idName: 'receive_detail_id',
        uuidName: 'receive_detail_uuid'
      },
      {
        key: 'receive',
        TRepo: OutReceiveRepo,
        idName: 'receive_id',
        uuidName: 'receive_uuid'
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
        key: 'orderDetail',
        TRepo: MatOrderDetailRepo,
        idName: 'order_detail_id',
        uuidName: 'order_detail_uuid'
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
   * 외주입하상세 데이터의 입하수량 * 단가 * 환율을 합계금액(total_price)로 추가하여 반환
   * @param datas 외주입하상세 데이터
   * @returns total_price가 추가 된 외주입하상세 데이터
   */
  public calculateTotalPrice = (datas: any[]) => {
    return datas.map((data: any) => {
      data.total_price = data.qty * data.price * data.exchange; 
      return data;
    });
  }

  /**
   * 외주입하상세 데이터의 창고가 유효한 데이터인지 검증  
   * 입고(가용창고)
   * @param datas 외주입하상세 데이터
   * @param tran DB Transaction
   * @returns 검증 성공시 true, 실패시 Error Throw
   */
  public validateStoreType = async (datas: any[], tran: Transaction) => {
    const storeService = new StdStoreService(this.tenant);
    let toStoreIds = new Set<number>();

    datas.forEach(data => { toStoreIds.add(data.to_store_id); });

    await Promise.all([
      // 📌 입고창고가 가용창고가 아닌 경우에 대한 Valdation
      toStoreIds.forEach(async (id) => {
        const validated = await storeService.validateStoreType(id, 'AVAILABLE', tran);
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

  public validateHasInspResultByUuids = async (uuids: string[]) => {
    try {
      const read = await this.inspResultRepo.readOutReceiveByReceiveUuids(uuids);
      if (read.raws.length > 0) {
        throw createApiError(
          400, 
          `입하상세번호 ${read.raws[0].uuid}의 수입검사 이력이 등록되어 수정할 수 없습니다.`,
          this.stateTag, 
          errorState.INVALID_DATA
        );
      }

      return true;
    } catch (error) { throw error; }
  }
}

export default OutReceiveDetailService;