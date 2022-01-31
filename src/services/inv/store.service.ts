import { Transaction } from "sequelize/types";
import AdmTranTypeRepo from "../../repositories/adm/tran-type.repository";
import InvStoreRepo from '../../repositories/inv/store.repository';
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdLocationRepo from "../../repositories/std/location.repository";
import StdPartnerRepo from "../../repositories/std/partner.repository";
import StdProdRepo from "../../repositories/std/prod.repository";
import StdRejectRepo from "../../repositories/std/reject.repository";
import StdStoreRepo from "../../repositories/std/store.repository";
import { errorState } from "../../states/common.state";
import TTranType from "../../types/tran-type.type";
import createApiError from "../../utils/createApiError";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import getStoreBody from "../../utils/getStoreBody_new";
import AdmTranTypeService from "../adm/tran-type.service";

class InvStoreService {
  tenant: string;
  stateTag: string;
  repo: InvStoreRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'invStore';
    this.repo = new InvStoreRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'tranType',
        TRepo: AdmTranTypeRepo,
        idName: 'tran_type_id',
        uuidName: 'tran_type_uuid'
      },
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'store',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        uuidName: 'store_uuid'
      },
      {
        key: 'location',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        uuidName: 'location_uuid'
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'reject',
        TRepo: StdRejectRepo,
        idName: 'reject_id',
        uuidName: 'reject_uuid'
      },
      {
        key: 'partner',
        TRepo: StdPartnerRepo,
        idName: 'partner_id',
        uuidName: 'partner_uuid'
      }
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
   * 수불관련 데이터(입고, 출고 등)를 통하여 창고에 재고를 입력, 수정, 삭제
   * @param datas 수불관련 데이터(입고, 출고 등)
   * @param type 데이터 저장 유형(생성, 수정, 삭제)
   * @param tranOpt 수불 데이터 생성에 필요한 Option
   * @param uid 입력 사용자ID
   * @param tran DB Transaction
   * @returns 창고수불 Result
   */
   public transactInventory = async (
    datas: any[], 
    type: 'CREATE' | 'UPDATE' | 'DELETE',
    tranOpt: {
      inout: 'FROM' | 'TO',         // FROM: 출고, TO: 입고
      tran_type: TTranType,         // 수불 유형
      reg_date: string,             // 수불 기준일자
      tran_id_alias: string,        // 수불 데이터의 ID Column명
      qty_alias?: string,           // 수불 데이터의 Qty Column명
      store_alias?: string,         // 수불 데이터의 Store(창고) Column명
      location_alias?: string       // 수불 데이터의 Location(위치) Column명
    }, 
    uid: number, 
    tran: Transaction
  ) => {
    // 📌 수불 유형에 해당하는 ID 검색
    const tranTypeService = new AdmTranTypeService(this.tenant);
    const tranTypeId = await tranTypeService.getIdByCd(tranOpt.tran_type);

    // 📌 수불 입력 데이터 생성
    const storeBody = getStoreBody({
      datas,
      tran_type_id: tranTypeId,
      ...tranOpt
    });

    // 📌 수불 유형에 따라 수불 함수 호출
    switch (type) {
      case 'CREATE': return await this.repo.create(storeBody, uid, tran);
      case 'UPDATE': return await this.repo.updateToTransaction(storeBody, uid, tran);
      case 'DELETE': return await this.repo.deleteToTransaction(storeBody, uid, tran);
    }
  }

  /**
   * 입력된 매개변수에 해당하는 재고의 선입선출 리스트 출력
   * @param params 재고조회 기준 조건
   * @param regDate 기준일자
   * @param qty 부모품목의 수량
   * @param allowMinus 마이너스 재고 허용여부
   * @returns 선입선출 수불 데이터 반환 / 마이너스 재고를 허용하지않고 재고수량이 부족하면 Error Throw
   */
  public getCalculatedFifoData = async (params: any, regDate: string, qty: number, allowMinus: boolean) => {
    const stocks = await this.readStocks({
      factory_id: params.factory_id,
      prod_id: params.prod_id,
      store_id: params.store_id,
      location_id: params.location_id,
      lot_no: params.lot_no,
      reject_id: params.reject_id,
      partner_id: params.partner_id,
      reg_date: regDate,
      exclude_zero_lot_fg: false
    });

    // 📌 마이너스 재고를 허용하지 않을경우 재고에 대한 Vaildation 진행
    if (!allowMinus) {
      // 📌 현재 재고의 합 계산
      const remain = stocks.reduce((previous, current) => previous.qty + current.qty);

      // 📌 현 재고수량이 투입 예정 수량보다 적을경우 Error Throw
      if (qty > remain) { 
        throw createApiError(
          400, 
          `현재 투입에 필요한 재고수량이 부족합니다.`, 
          this.stateTag, 
          errorState.NOT_ENOUGH_STOCK
        );
      }
    }

    // 📌 투입 재고에 대한 선입선출
    return this.recursiveFifo(params, stocks, regDate, qty, []);
  }

  /**
   * 재고 리스트에서 수량만큼 선입선출 데이터를 계산
   * @param params 재고조회 기준 조건
   * @param stocks 재고 리스트
   * @param regDate 기준일자
   * @param currentQty 잔여수량
   * @param result 반환 될 선입선출 데이터 리스트
   * @returns 선입선출 수불 데이터 반환
   */
  public recursiveFifo = (params: any[], stocks: any[], regDate: string, currentQty: number, result: any[]) => {
    if (!result) { result = []; }

    // 📌 모든 재고를 투입 하였음에도 투입해야하는 재고수량이 남은경우 0 Lot로 나머지 수량을 채운다.
    if (stocks.length === 0 && currentQty) {
      result.push({
        ...params,
        lot_no: '0',
        reg_date: regDate,
        qty: currentQty
      });
    } else {
      const stock = stocks.pop();

      // 📌 재고투입 데이터 생성
      result.push({
        ...params,
        lot_no: stock.lot_no,
        reg_date: regDate,
        qty: currentQty - stock.qty > 0 ? stock.qty : currentQty
      })

      // 📌 투입에 필요한 수량을 투입한 수량만큼 차감
      currentQty -= stock.qty;

      this.recursiveFifo(params, stocks, regDate, currentQty, result);
    }

    return result;
  }

  /**
   * 입력 매개변수에따라 재고 조회
   * @param params 공장, 품목, 창고, 위치, 부적합, 거래처ID 및 Lot No, 조회 기준일시, 0 Lot 포함여부
   * @returns 재고 및 합계 수량 리스트
   */
  public readStocks = async (
    params: {
      factory_id?: number,
      prod_id?: number,
      store_id?: number,
      location_id?: number,
      lot_no?: string,
      reject_id?: number,
      partner_id?: number,
      reg_date?: string,
      exclude_zero_lot_fg?: boolean
    }
  ) => {
    try {
      const result = await this.repo.readStocks(params);
      return result.raws;
    } catch (error) { throw error; }
  }
}

export default InvStoreService;