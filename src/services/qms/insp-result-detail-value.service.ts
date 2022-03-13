import { Transaction } from "sequelize/types";
import IQmsInspResultDetailValue from "../../interfaces/qms/insp-result-detail-value.interface";
import QmsInspResultDetailInfoRepo from "../../repositories/qms/insp-result-detail-info.repository";
import QmsInspResultDetailValueRepo from "../../repositories/qms/insp-result-detail-value.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class QmsInspResultDetailValueService {
  tenant: string;
  stateTag: string;
  repo: QmsInspResultDetailValueRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'qmsInspResultDetailValue';
    this.repo = new QmsInspResultDetailValueRepo(tenant);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'inspResultDetailInfo',
        TRepo: QmsInspResultDetailInfoRepo,
        idName: 'insp_result_detail_info_id',
        uuidName: 'insp_result_detail_info_uuid'
      },
      {
        key: 'uuid',
        TRepo: QmsInspResultDetailValueRepo,
        idName: 'insp_result_detail_value_id',
        uuidName: 'uuid'
      },
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IQmsInspResultDetailValue[], uid: number, tran: Transaction) => {
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

  public update = async (datas: IQmsInspResultDetailValue[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IQmsInspResultDetailValue[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public delete = async (datas: IQmsInspResultDetailValue[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public deleteByInfoIds = async (ids: number[], uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByInfoIds(ids, uid, tran); }
		catch (error) { throw error; }
  };
}

export default QmsInspResultDetailValueService;