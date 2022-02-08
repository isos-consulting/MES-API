import { Transaction } from "sequelize/types";
import IPrdWorkInput from "../../interfaces/prd/work-input.interface";
import PrdWorkRepo from '../../repositories/prd/work.repository';
import PrdWorkInputRepo from "../../repositories/prd/work-input.repository";
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import StdUnitRepo from '../../repositories/std/unit.repository';
import AdmBomInputTypeRepo from '../../repositories/adm/bom-input-type.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import { errorState } from "../../states/common.state";
import createApiError from "../../utils/createApiError";
import { BOM_INPUT_TYPE } from "../../types/bom-input-type.type";
import InvStoreRepo from "../../repositories/inv/store.repository";
import StdBomRepo from "../../repositories/std/bom.repository";
import InvStoreService from "../inv/store.service";

class PrdWorkInputService {
  tenant: string;
  stateTag: string;
  repo: PrdWorkInputRepo;
  stdStoreRepo: StdStoreRepo;
  storeRepo: InvStoreRepo;
  bomRepo: StdBomRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'prdWorkInput';
    this.repo = new PrdWorkInputRepo(tenant);
    this.stdStoreRepo = new StdStoreRepo(tenant);
    this.storeRepo = new InvStoreRepo(tenant);
    this.bomRepo = new StdBomRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'work',
        TRepo: PrdWorkRepo,
        idName: 'work_id',
        uuidName: 'work_uuid'
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
        key: 'bom_input_type',
        TRepo: AdmBomInputTypeRepo,
        idName: 'bom_input_type_id',
        uuidName: 'bom_input_type_uuid'
      },
      {
        key: 'store',
        TRepo: StdStoreRepo,
        idAlias: 'from_store_id',
        idName: 'store_id',
        uuidName: 'from_store_uuid'
      },
      {
        key: 'location',
        TRepo: StdLocationRepo,
        idAlias: 'from_location_id',
        idName: 'location_id',
        uuidName: 'from_location_uuid'
      }
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IPrdWorkInput[], uid: number, tran: Transaction) => {
    try { return await this.repo.create(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public read = async (params: any) => {
    try { return await this.repo.read(params); }
		catch (error) { throw error; }
  };
  
  public readByUuid = async (uuid: string) => {
    try { return await this.repo.readByUuid(uuid); } 
		catch (error) { throw error; }
  };

  // 📒 Fn[readOngoing]: 진행중인 생산실적의 자재 투입데이터 Read Function
  public readOngoing = async (params: any) => {
    try { return await this.repo.readOngoing(params); }
		catch (error) { throw error; }
  };

  // 📒 Fn[readOngoingGroup]: 진행중인 생산실적의 자재 투입데이터 Read Function
  public readOngoingGroup = async (params: any) => {
    try { return await this.repo.readOngoing(params); }
		catch (error) { throw error; }
  };

  public update = async (datas: IPrdWorkInput[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IPrdWorkInput[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  };

  public delete = async (datas: IPrdWorkInput[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public deleteByWorkId = async (workId: number, uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByWorkId(workId, uid, tran); }
    catch (error) { throw error; }
  }

  public deleteByWorkIds = async (workId: number[], uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByWorkIds(workId, uid, tran); }
    catch (error) { throw error; }
  }

  /**
   * 생산입고, 생산투입에서 사용하는 가용창고의 ID 반환
   * @param tran DB Transaction
   * @returns 가용창고가 있을 경우 ID 반환, 없을 경우 Error Throw
   */
   public getAvailableStoreId = async (tran?: Transaction) => {
    try { 
      const read = await this.stdStoreRepo.readRawAll(tran);
      const availableStore = read.raws.filter(raw => raw.available_store_fg === true);

      const storeId = availableStore[0]?.store_id;

      if (!storeId) {
        throw createApiError(
          400, 
          `가용창고가 존재하지 않습니다.`, 
          this.stateTag, 
          errorState.NO_DATA
        );
      }

      return storeId;
    } 
		catch (error) { throw error; }
  }

  /**
   * @param datas 작업실적 데이터
   * @param regDate 수불일시
   * @returns 작업실적 데이터
   */
  getWorkInputBody = async (data: any, regDate: string, isPullOption: boolean) => {
    const workInputRead = await this.repo.readRawsByWorkId(data.work_id);
    const result = await Promise.all(
      workInputRead.raws.map(async (workInput: IPrdWorkInput) => {
        // PUSH(수동입력)
        if (workInput.bom_input_type_id == BOM_INPUT_TYPE.PUSH) {
          return {
            work_input_id: workInput.work_input_id,
            factory_id: workInput.factory_id,
            prod_id: workInput.prod_id,
            reg_date: regDate,
            lot_no: workInput.lot_no,
            qty: workInput.qty,
            from_store_id: workInput.from_store_id,
            from_location_id: workInput.from_location_id
          }

        // PULL(선입선출)
        } else if (workInput.bom_input_type_id == BOM_INPUT_TYPE.PULL) {
          return await this.getPullInputBody(workInput, regDate, isPullOption);
          
        } else {
          throw createApiError(
            400, 
            `투입품목[${workInput.uuid}}]의 투입방법이 잘못 되었습니다.`,
            this.stateTag, 
            errorState.FAILED_SAVE_TO_RELATED_DATA
          );
        }
      })
    );

    return result;
  }

  /**
   * 입력 데이터 기반 선입선출 생산투입 데이터 생성
   * @param params 생산투입 생성에 필요한 매개변수(Work-Input DATA)
   * @param regDate 기준일자
   * @param allowMinus 마이너스 재고 허용여부
   * @returns 선입선출이 적용된 투입 데이터
   */
   getPullInputBody = async (param: IPrdWorkInput, regDate: string, allowMinus: boolean) => {
    const storeService = new InvStoreService(this.tenant);
    const calculated = await storeService.getCalculatedFifoData(
      {
        factory_id: param.factory_id,
        prod_id: param.prod_id,
        store_id: param.from_store_id,
        location_id: param.from_location_id,
      },
      regDate,
      param.qty as number,
      allowMinus
    );

    let result: any[] = [];
    calculated.forEach(cal => {
      result.push({
        work_input_id: param.work_input_id,
        factory_id: cal.factory_id,
        prod_id: cal.prod_id,
        reg_date: regDate,
        lot_no: cal.lot_no,
        qty: cal.qty,
        from_store_id: cal.store_id,
        from_location_id: cal.location_id
      })
    });

    return result;
  }

  public getVerifyInput = async (workId: number, tran: Transaction) => {
    let verifyInput: any = {};
    const inputRead = await this.repo.readRawsByWorkId(workId, tran);
    inputRead.raws.forEach((input: any) => {
      if (!verifyInput[input.prod_id]) { 
        throw createApiError(
          400, 
          `작업지시대비 투입품목이 일치하지 않습니다.`,
          this.stateTag, 
          errorState.FAILED_SAVE_TO_RELATED_DATA
        ); 
      }
      verifyInput[input.prod_id].usage = input.c_usage;
      verifyInput[input.prod_id].qty = Number(input.qty);
      verifyInput[input.prod_id].bom_input_type_id = input.bom_input_type_id

      if (!Object.values(BOM_INPUT_TYPE).includes(input.bom_input_type_id)) {
        throw createApiError(
          400, 
          `투입품목[${input.uuid}}]의 투입방법이 잘못 되었습니다.`,
          this.stateTag, 
          errorState.FAILED_SAVE_TO_RELATED_DATA
        );
      }
    });

    return verifyInput;
  }
}

export default PrdWorkInputService;