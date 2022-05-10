import { Transaction } from "sequelize/types";
import IQmsInsp from "../../interfaces/qms/insp.interface";
import AdmInspTypeRepo from "../../repositories/adm/insp-type.repository";
import QmsInspRepo from "../../repositories/qms/insp.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdProdRepo from '../../repositories/std/prod.repository';
import { errorState } from "../../states/common.state";
import createApiError from "../../utils/createApiError";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import AdmInspTypeService from "../adm/insp-type.service";
import PrdWorkService from "../prd/work.service";

class QmsInspService {
  tenant: string;
  stateTag: string;
  repo: QmsInspRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'qmsInsp';
    this.repo = new QmsInspRepo(tenant);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
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
        key: 'inspType',
        TRepo: AdmInspTypeRepo,
        idName: 'insp_type_id',
        uuidName: 'insp_type_uuid'
      },
      {
        key: 'uuid',
        TRepo: QmsInspRepo,
        idName: 'insp_id',
        uuidName: 'uuid'
      },
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IQmsInsp[], uid: number, tran: Transaction) => {
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

  public update = async (datas: IQmsInsp[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public updateApply = async (datas: IQmsInsp[], uid: number, tran: Transaction) => {
    try { return await this.repo.updateApply(datas, uid, tran); } 
    catch (error) { throw error; }
  }

  public patch = async (datas: IQmsInsp[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public delete = async (datas: IQmsInsp[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  // 📌 공정검사 기준서 등록시 해당 품목의 생산이 진행중일 경우 기준서 생성 후 즉시 적용 불가
  public validateWorkingByProd = async (data: any) => {
    const inspTypeService = new AdmInspTypeService(this.tenant);
    const workService = new PrdWorkService(this.tenant);

    const inspTypeId = await inspTypeService.getIdByCd('PROC_INSP');
    if (data.apply_fg && data.insp_type_id == inspTypeId) {
      const params = {
        factory_uuid: data.factory_uuid,
        prod_uuid: data.prod_uuid,
        complete_fg: false
      }
      const workRead = await workService.read(params);
      if(workRead.raws.length > 0) {
        throw createApiError(
          400, 
          {
            admin_message: '등록하려고 하는 기준서의 품번이 현재 생산 진행중이므로 적용이 불가합니다.',
            user_message: '등록하려고 하는 기준서의 품번이 현재 생산 진행중이므로 적용이 불가합니다.',
          },
          this.stateTag, 
          errorState.FAILED_SAVE_TO_RELATED_DATA
        );
      }
    }
  }
}

export default QmsInspService;