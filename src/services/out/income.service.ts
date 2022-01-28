import { Transaction } from "sequelize/types";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdLocationRepo from "../../repositories/std/location.repository";
import StdProdRepo from "../../repositories/std/prod.repository";
import StdStoreRepo from "../../repositories/std/store.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import InvStoreRepo from "../../repositories/inv/store.repository";
import StdStoreService from "../std/store.service";
import createApiError from "../../utils/createApiError";
import { errorState } from "../../states/common.state";
import OutIncomeRepo from "../../repositories/out/income.repository";
import OutReceiveDetailRepo from "../../repositories/out/receive-detail.repository";
import StdUnitConvertService from "../std/unit-convert.service";
import IOutIncome from "../../interfaces/out/income.interface";
import AdmTranTypeService from "../adm/tran-type.service";
import getStoreBody from "../../utils/getStoreBody_new";

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
   * 외주입고에 의한 창고수불 데이터 생성 (=> 가용창고)
   * @param datas 외주입고 데이터
   * @param regDate 외주입고전표 기준일자
   * @param uid 입력 사용자ID
   * @param tran DB Transaction
   * @returns 창고수불 Result
   */
   public inputInInventory = async (datas: any[], regDate: string, uid: number, tran: Transaction) => {
    const tranTypeService = new AdmTranTypeService(this.tenant);
    const tranTypeId = await tranTypeService.getIdByCd('OUT_INCOME');

    const storeBody = getStoreBody({
      datas,
      inout: 'TO',
      tran_type_id: tranTypeId,
      reg_date: regDate,
      tran_id_alias: 'income_id'
    });

    return await this.storeRepo.create(storeBody, uid, tran);
  }

  /**
   * 외주입고에 의한 창고수불 기존 데이터 수정 (가용창고 => 외주창고)
   * @param datas 외주입고상세 데이터
   * @param regDate 외주입고전표 기준일자
   * @param uid 입력 사용자ID
   * @param tran DB Transaction
   * @returns 창고수불 Result
   */
   public changeInInventory = async (datas: any[], regDate: string, uid: number, tran: Transaction) => {
    const tranTypeService = new AdmTranTypeService(this.tenant);
    const tranTypeId = await tranTypeService.getIdByCd('OUT_INCOME');

    const storeBody = getStoreBody({
      datas,
      inout: 'TO',
      tran_type_id: tranTypeId,
      reg_date: regDate,
      tran_id_alias: 'income_id'
    });

    return await this.storeRepo.updateToTransaction(storeBody, uid, tran);
  }

  /**
   * 외주입고에 의한 창고수불 데이터 삭제 (가용창고 => 외주창고)
   * @param datas 외주입고상세 데이터
   * @param uid 입력 사용자ID
   * @param tran DB Transaction
   * @returns 창고수불 Result
   */
  public removeInInventory = async (datas: any[], uid: number, tran: Transaction) => {
    const tranTypeService = new AdmTranTypeService(this.tenant);
    const tranTypeId = await tranTypeService.getIdByCd('OUT_INCOME');

    const storeBody = getStoreBody({
      datas,
      inout: 'TO',
      tran_type_id: tranTypeId,
      tran_id_alias: 'income_id'
    });

    return await this.storeRepo.deleteToTransaction(storeBody, uid, tran);
  }
  
  /**
   * 입력 데이터 기반 입고 데이터 생성
   * @param datas 입하 및 수입검사 데이터
   * @param regDate 수불일시
   * @returns 입고 데이터
   */
   getIncomeBody = async (datas: any[], regDate: string) => {
    const unitConvertService = new StdUnitConvertService(this.tenant);

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
   * 외주입고 데이터의 창고가 유효한 데이터인지 검증  
   * 입고(가용창고)
   * @param datas 외주입고 데이터
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
}

export default OutIncomeService;