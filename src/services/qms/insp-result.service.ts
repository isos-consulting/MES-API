import { Transaction } from "sequelize/types";
import IQmsInspResult from "../../interfaces/qms/insp-result.interface";
import QmsInspResultRepo from "../../repositories/qms/insp-result.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdEmpRepo from '../../repositories/std/emp.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import StdRejectRepo from '../../repositories/std/reject.repository';
import StdUnitRepo from '../../repositories/std/unit.repository';
import QmsInspRepo from '../../repositories/qms/insp.repository';
import AdmInspDetailTypeService from "../adm/insp-detail-type.service";
import MatReceiveDetailRepo from "../../repositories/mat/receive-detail.repository";
import OutReceiveDetailRepo from "../../repositories/out/receive-detail.repository";
import AdmInspTypeRepo from "../../repositories/adm/insp-type.repository";
import AdmInspDetailTypeRepo from "../../repositories/adm/insp-detail-type.repository";
import AdmInspHandlingTypeRepo from "../../repositories/adm/insp-handling-type.repository";
import StdUnitConvertService from "../std/unit-convert.service";
import PrdWorkRepo from "../../repositories/prd/work.repository";

class QmsInspResultService {
  tenant: string;
  stateTag: string;
  repo: QmsInspResultRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'qmsInspResult';
    this.repo = new QmsInspResultRepo(tenant);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'uuid',
        TRepo: QmsInspResultRepo,
        idName: 'insp_result_id',
        uuidName: 'uuid'
      },
      {
        key: 'inspType',
        TRepo: AdmInspTypeRepo,
        idName: 'insp_type_id',
        uuidName: 'insp_type_uuid'
      },
      {
        key: 'inspDetailType',
        TRepo: AdmInspDetailTypeRepo,
        idName: 'insp_detail_type_id',
        uuidName: 'insp_detail_type_uuid'
      },
      {
        key: 'inspHandlingType',
        TRepo: AdmInspHandlingTypeRepo,
        idName: 'insp_handling_type_id',
        uuidName: 'insp_handling_type_uuid'
      },
      {
        key: 'insp',
        TRepo: QmsInspRepo,
        idName: 'insp_id',
        uuidName: 'insp_uuid'
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
        key: 'emp',
        TRepo: StdEmpRepo,
        idName: 'emp_id',
        uuidName: 'emp_uuid'
      },
      {
        key: 'reject',
        TRepo: StdRejectRepo,
        idName: 'reject_id',
        uuidName: 'reject_uuid'
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
      {
        key: 'rejectStore',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        idAlias: 'reject_store_id',
        uuidName: 'reject_store_uuid'
      },
      {
        key: 'rejectLocation',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        idAlias: 'reject_location_id',
        uuidName: 'reject_location_uuid'
      },
      {
        key: 'work',
        TRepo: PrdWorkRepo,
        idName: 'work_id',
        idAlias: 'insp_reference_id',
        uuidName: 'work_uuid'
      }
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    const inspDetailTypeService = new AdmInspDetailTypeService(this.tenant);
    const inspDetailTypeUuid: string = datas.insp_detail_type_uuid ?? datas['0'].insp_detail_type_uuid;
    const inspDetailType = await inspDetailTypeService.readByUuid(inspDetailTypeUuid);

    switch (inspDetailType.raws[0].insp_detail_type_cd) {
      case 'MAT_RECEIVE':
        this.fkIdInfos.push({
          key: 'receiveDetail',
          TRepo: MatReceiveDetailRepo,
          idName: 'receive_detail_id',
          idAlias: 'insp_reference_id',
          uuidName: 'receive_detail_uuid'
        });
        break;
      case 'OUT_RECEIVE':
        this.fkIdInfos.push({
          key: 'receiveDetail',
          TRepo: OutReceiveDetailRepo,
          idName: 'receive_detail_id',
          idAlias: 'insp_reference_id',
          uuidName: 'receive_detail_uuid'
        });
        break;
      // default: throw new Error('잘못된 insp_detail_type_cd(세부검사유형) 입력');
    }

    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IQmsInspResult[], uid: number, tran: Transaction) => {
    try { return await this.repo.create(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public readRawByUuid = async (uuid: string) => {
    try { return await this.repo.readRawByUuid(uuid); }
		catch (error) { throw error; }
  };

  // 📒 Fn[readWaitingReceive]: 수입검사 성적서 대기 List Read Function
  public readWaitingReceive = async (params: any) => {
    try { 
      const admInspDetailType = new AdmInspDetailTypeService(this.tenant);

      if (!params.insp_detail_type_uuid) {
        params.insp_detail_type = undefined;
      } else {
        const inspDetailTypeRead = await admInspDetailType.readByUuid(params.insp_detail_type_uuid);
        params.insp_detail_type = inspDetailTypeRead.raws[0].insp_detail_type_cd;
      }

      return await this.repo.readWaitingReceive(params); 
    }
		catch (error) { throw error; }
  };

  // 📒 Fn[readMatReceive]: 수입검사(자재입하기준) Read Function
  public readMatReceive = async (params: any) => {
    try { return await this.repo.readMatReceive(params); }
		catch (error) { throw error; }
  };

  // 📒 Fn[readMatReceiveByUuid]: 수입검사(자재입하기준) Read With Uuid Function
  public readMatReceiveByUuid = async (uuid: string) => {
    try { return await this.repo.readMatReceiveByUuid(uuid); }
		catch (error) { throw error; }
  };

  // 📒 Fn[readMatReceiveByReceiveUuids]: 자재입하상세 UUID에 해당하는 수입검사 데이터 조회
  public readMatReceiveByReceiveUuids = async (uuids: string[]) => {
    try { return await this.repo.readMatReceiveByReceiveUuids(uuids); }
		catch (error) { throw error; }
  };

  // 📒 Fn[readOutReceive]: 수입검사(외주입하기준) Read Function
  public readOutReceive = async (params: any) => {
    try { return await this.repo.readOutReceive(params); }
		catch (error) { throw error; }
  };

  // 📒 Fn[readOutReceiveByUuid]: 수입검사(외주입하기준) Read With Uuid Function
  public readOutReceiveByUuid = async (uuid: string) => {
    try { return await this.repo.readOutReceiveByUuid(uuid); }
		catch (error) { throw error; }
  };

  // 📒 Fn[readOutReceiveByReceiveUuids]: 외주입하상세 UUID에 해당하는 수입검사 데이터 조회
  public readOutReceiveByReceiveUuids = async (uuids: string[]) => {
    try { return await this.repo.readOutReceiveByReceiveUuids(uuids); }
		catch (error) { throw error; }
  };

  // 📒 Fn[readProc]: 공정검사 Read Function
  public readProc = async (params: any) => {
    try { return await this.repo.readProc(params); }
		catch (error) { throw error; }
  };

  // 📒 Fn[readProcByUuid]: 공정검사 Read With Uuid Function
  public readProcByUuid = async (uuid: string) => {
    try { return await this.repo.readProcByUuid(uuid); }
		catch (error) { throw error; }
  };

  // 📒 Fn[readProcByWorkId]: 생산실적 UUID에 해당하는 공정검사 데이터 조회
  public readProcByWorkId = async (workId: number) => {
    try { return await this.repo.readProcByWorkId(workId); }
		catch (error) { throw error; }
  };

  // 📒 Fn[readFinal]: 최종검사 Read Function
  public readFinal = async (params: any) => {
    try { return await this.repo.readFinal(params); }
		catch (error) { throw error; }
  };

  // 📒 Fn[readFinalByUuid]: 최종검사 Read With Uuid Function
  public readFinalByUuid = async (uuid: string) => {
    try { return await this.repo.readFinalByUuid(uuid); }
		catch (error) { throw error; }
  };

  public update = async (datas: IQmsInspResult[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IQmsInspResult[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public delete = async (datas: IQmsInspResult[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  /**
   * 성적서의 Max Sequence 조회
   * @param inspTypeId 검사유형 ID
   * @param inspDetailTypeId 세부검사유형 ID
   * @param inspReferenceId 전표 ID
   * @param transaction Transaction
   * @returns Max Sequence
   */
   getMaxSeq = async(inspTypeId: number, inspDetailTypeId: number, inspReferenceId: number, tran?: Transaction) => {
    try { return await this.repo.getMaxSeq(inspTypeId, inspDetailTypeId, inspReferenceId, tran); } 
    catch (error) { throw error; }
  }

  /**
   * 입력 데이터 기반 부적합 재고 데이터 생성
   * @param datas 검사 데이터
   * @param regDate 수불일시
   * @returns 검사 데이터
   */
   getStoreBody = async (datas: any[], regDate: string) => {
    const unitConvertService = new StdUnitConvertService(this.tenant);

    const result = await Promise.all(
      datas.map(async (data: any) => {
        // 📌 품목의 단위와 입고의 단위가 다를 경우 단위변환 진행
        const convertedQty = await unitConvertService.convertQty(data.prod_id, data.unit_id, data.qty);

        return {
          insp_result_id: data.insp_result_id,
          factory_id: data.factory_id,
          prod_id: data.prod_id,
          reg_date: regDate,
          lot_no: data.lot_no,
          qty: convertedQty,
          to_store_id: data.to_store_id,
          to_location_id: data.to_location_id
        }
      })
    );

    return result;
  }
}

export default QmsInspResultService;