import { Transaction } from "sequelize/types";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdLocationRepo from "../../repositories/std/location.repository";
import StdProdRepo from "../../repositories/std/prod.repository";
import StdStoreRepo from "../../repositories/std/store.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import InvStoreRepo from "../../repositories/inv/store.repository";
import OutIncomeRepo from "../../repositories/out/income.repository";
import OutReceiveDetailRepo from "../../repositories/out/receive-detail.repository";
import StdUnitConvertService from "../std/unit-convert.service";
import IOutIncome from "../../interfaces/out/income.interface";

class OutIncomeService {
  tenant: string;
  stateTag: string;
  repo: OutIncomeRepo;
  storeRepo: InvStoreRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'outIncomeDetail';
    this.repo = new OutIncomeRepo(tenant);
    this.storeRepo = new InvStoreRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'income',
        TRepo: OutIncomeRepo,
        idName: 'income_id',
        uuidName: 'income_uuid'
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

  public create = async (datas: IOutIncome[], uid: number, tran: Transaction) => {
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

  public update = async (datas: IOutIncome[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
    catch (error) { throw error; }
  }

  public patch = async (datas: IOutIncome[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran); } 
    catch (error) { throw error; }
  }

  public delete = async (datas: IOutIncome[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); } 
    catch (error) { throw error; }
  }
  
  /**
   * 입력 데이터 기반 입고 데이터 생성
   * @param datas 입하 및 수입검사 데이터
   * @param regDate 수불일시
   * @returns 입고 데이터
   */
  getIncomeBody = async (datas: any[], regDate: string) => {
    const unitConvertService = new StdUnitConvertService(this.tenant);

    console.log(datas);

    const result = await Promise.all(
      datas.map(async (data: any) => {
        // 📌 품목의 단위와 입고의 단위가 다를 경우 단위변환 진행
        const convertedQty = await unitConvertService.convertQty(data.prod_id, data.unit_id, data.qty);

        return {
          income_id: data.income_id,
          factory_id: data.factory_id,
          prod_id: data.prod_id,
          reg_date: regDate,
          lot_no: data.lot_no,
          qty: convertedQty,
          receive_detail_id: data.receive_detail_id,
          to_store_id: data.to_store_id,
          to_location_id: data.to_location_id
        }
      })
    );

    return result;
  }

  /**
   * 외주입하상세ID를 기준으로 외주입고 데이터 삭제
   * @param ids 외주입하상세ID 리스트
   * @param uid 입력 사용자ID
   * @param tran DB Transaction
   * @returns 외주입고 Result
   */
   public deleteByReceiveDetailIds = async (ids: number[], uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByReceiveDetailIds(ids, uid, tran); }
    catch (error) { throw error; }
  }
}

export default OutIncomeService;