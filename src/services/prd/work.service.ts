import { Transaction } from "sequelize/types";
import IPrdWork from "../../interfaces/prd/work.interface";
import PrdWorkRepo from '../../repositories/prd/work.repository';
import PrdOrderRepo from '../../repositories/prd/order.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdShiftRepo from '../../repositories/std/shift.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import StdWorkingsRepo from '../../repositories/std/workings.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import createApiError from "../../utils/createApiError";
import { errorState } from "../../states/common.state";
import PrdWorkRoutingRepo from "../../repositories/prd/work-routing.repository";
import PrdWorkRejectRepo from "../../repositories/prd/work-reject.repository";
import StdTenantOptService from "../std/tenant-opt.service";
import { PRD_METHOD_REJECT_QTY } from "../../types/tenant-opt.type";
import { BOM_INPUT_TYPE } from "../../types/bom-input-type.type";
import PrdOrderInputService from "./order-input.service";
import PrdWorkInputService from "./work-input.service";
import StdStoreService from "../std/store.service";

class PrdWorkService {
  tenant: string;
  stateTag: string;
  repo: PrdWorkRepo;
  stdStoreRepo: StdStoreRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'prdWork';
    this.repo = new PrdWorkRepo(tenant);
    this.stdStoreRepo = new StdStoreRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'uuid',
        TRepo: PrdWorkRepo,
        idName: 'work_id',
        uuidName: 'uuid'
      },
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'order',
        TRepo: PrdOrderRepo,
        idName: 'order_id',
        uuidName: 'order_uuid'
      },
      {
        key: 'workings',
        TRepo: StdWorkingsRepo,
        idName: 'workings_id',
        uuidName: 'workings_uuid'
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'shift',
        TRepo: StdShiftRepo,
        idName: 'shift_id',
        uuidName: 'shift_uuid'
      },
      {
        key: 'store',
        TRepo: StdStoreRepo,
        idAlias: 'to_store_id',
        idName: 'store_id',
        uuidName: 'to_store_uuid'
      },
      {
        key: 'location',
        TRepo: StdLocationRepo,
        idAlias: 'to_location_id',
        idName: 'location_id',
        uuidName: 'to_location_uuid'
      }
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IPrdWork[], uid: number, tran: Transaction) => {
    try { return await this.repo.create(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public read = async (params: any) => {
    try { 
      const tenantOptService = new StdTenantOptService(this.tenant);
      const isRejectQtyOption = await tenantOptService.getTenantOptValue('PRD_METHOD_REJECT_QTY');
      params.opt_reject_qty = isRejectQtyOption;

      return await this.repo.read(params); 
    }
		catch (error) { throw error; }
  };

  public readReport = async (params: any) => {
    try { return await this.repo.readReport(params); }
		catch (error) { throw error; }
  };
  
  public readByUuid = async (uuid: string) => {
    try { 
      const tenantOptService = new StdTenantOptService(this.tenant);
      const isRejectQtyOption = await tenantOptService.getTenantOptValue('PRD_METHOD_REJECT_QTY');

      return await this.repo.readByUuid(uuid, { opt_reject_qty: isRejectQtyOption }); 
    } 
		catch (error) { throw error; }
  };

  public update = async (datas: IPrdWork[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public updateComplete = async (data: {uuid: string, qty?: number, reject_qty?: number, complete_fg: boolean}, uid: number, tran: Transaction) => {
    try { return await this.repo.updateComplete([data], uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IPrdWork[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  };

  public delete = async (datas: IPrdWork[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public getMaxSeq = async (orderId: number, tran: Transaction) => {
    try { return await this.repo.getMaxSeq(orderId, tran); }
    catch (error) { throw error; }
  };

  public validateWorkStatus = async (ids: number[]) => {
    const set = new Set(ids);
    const workRead = await this.repo.readRawByIds(Array.from(set));
    workRead.raws.forEach((work: any) => { 
      if (work.complete_fg) {
        throw createApiError(
          400, 
          { 
            admin_message: `실적번호 [${work.uuid}]는 완료상태이므로 데이터 저장이 불가능합니다.`,
            user_message: '이미 생산완료된 작업으로 데이터 저장을 할 수 없습니다.'
          }, 
          this.stateTag, 
          errorState.FAILED_SAVE_TO_RELATED_DATA
        );
      }
    });
  }

  public validateInputQty = async (verifyInput: any, totalProducedQty: number) => {
    Object.keys(verifyInput).forEach((prodId: string) => {
      if (verifyInput[prodId].bom_input_type_id == BOM_INPUT_TYPE.PUSH) {
        let totalConsumedQty = verifyInput[prodId].qty / verifyInput[prodId].usage;
				totalConsumedQty = +totalConsumedQty.toFixed(6)
				
        if (totalProducedQty != totalConsumedQty) { 
          throw createApiError(
            400, 
            { 
              admin_message: `투입품목의 투입수량이 일치하지 않습니다.`,
              user_message: `투입품목의 투입수량이 일치하지 않습니다.`
            },
            this.stateTag, 
            errorState.FAILED_SAVE_TO_RELATED_DATA
          );
        }
      }
    }); 
  }

  public validateUpdateComplete = async (data: any, tran: Transaction) => {
    const orderInputService = new PrdOrderInputService(this.tenant);
    const workInputService = new PrdWorkInputService(this.tenant);
    const stdStoreService = new StdStoreService(this.tenant);
    
    const tenantOptService = new StdTenantOptService(this.tenant);
    const workRoutingRepo = new PrdWorkRoutingRepo(this.tenant);
    const workRejectRepo = new PrdWorkRejectRepo(this.tenant);

    const workResult = (await this.repo.readRawsByUuids([data.uuid])).raws[0];

    let verifyInput: any = {};
    // ❗ 지시생성 시 등록했던 투입정보 가져오기
    verifyInput = await orderInputService.getVerifyInput(workResult.order_id, tran);

    // ❗ 생산기준 생산투입정보 검증 및 가져오기
    let workVerifyInput = await workInputService.getVerifyInput(workResult.work_id, verifyInput, tran);

    const qty: number = await workRoutingRepo.getFinalQtyByWork(data.work_id);

    // 📌 부적합수량 처리방법이 합계인지 마지막공정 수량인지 옵션 값 조회
    const isRejectQtyOption = await tenantOptService.getTenantOptValue('PRD_METHOD_REJECT_QTY', tran);

    let rejectQty: number;
    if (Number(isRejectQtyOption) === PRD_METHOD_REJECT_QTY.SUM) {
      rejectQty = await workRejectRepo.getTotalRejectQtyByWork(data.work_id as number, tran) as number;
    } else { rejectQty = await workRejectRepo.getFinalRejectQtyByWork(data.work_id as number, tran) as number; }

    workResult.qty = qty;
    workResult.reject_qty = rejectQty;

    if ((Number(qty) + Number(rejectQty)) == 0) {
      throw createApiError(
        400, 
        {
          admin_message: `실적번호 [${data.uuid}]는 생산수량이 등록되지 않아 저장이 불가능합니다.`,
          user_message: '생산수량이 등록되지 않아 저장할 수 없습니다.'
        }, 
        this.stateTag, 
        errorState.FAILED_SAVE_TO_RELATED_DATA
      );
    }
    
    // ❗ 생산 수량과 투입 수량이 일치하지 않을 경우 Interlock (PUSH 기준)
    const totalProducedQty = Number(workResult.qty) + Number(workResult.reject_qty);
    await this.validateInputQty(workVerifyInput.verifyInput, totalProducedQty);
    
    // ❗ 가용창고 Interlock
    await stdStoreService.validateStoreTypeByIds(data.to_store_id, 'AVAILABLE', tran);
    
    workVerifyInput.work = workResult;
    return workVerifyInput;
  }
}

export default PrdWorkService;