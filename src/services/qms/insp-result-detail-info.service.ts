import { Transaction } from "sequelize/types";
import IQmsInspResultDetailInfo from "../../interfaces/qms/insp-detail.interface";
import QmsInspDetailRepo from "../../repositories/qms/insp-detail.repository";
import QmsInspResultDetailInfoRepo from "../../repositories/qms/insp-result-detail-info.repository";
import QmsInspResultRepo from "../../repositories/qms/insp-result.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdProdRepo from "../../repositories/std/prod.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class QmsInspResultDetailInfoService {
  tenant: string;
  stateTag: string;
  repo: QmsInspResultDetailInfoRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'qmsInspResultDetailInfo';
    this.repo = new QmsInspResultDetailInfoRepo(tenant);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'insp_result',
        TRepo: QmsInspResultRepo,
        idName: 'insp_result_id',
        uuidName: 'insp_result_uuid'
      },
      {
        key: 'insp_detail',
        TRepo: QmsInspDetailRepo,
        idName: 'insp_detail_id',
        uuidName: 'insp_detail_uuid'
      },
      {
        key: 'uuid',
        TRepo: QmsInspResultDetailInfoRepo,
        idName: 'insp_result_detail_info_id',
        uuidName: 'uuid'
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      }
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IQmsInspResultDetailInfo[], uid: number, tran: Transaction) => {
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

  public readByResultId = async (id: number) => {
    try { return await this.repo.readByResultId(id); } 
		catch (error) { throw error; }
  };

  public update = async (datas: IQmsInspResultDetailInfo[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IQmsInspResultDetailInfo[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public delete = async (datas: IQmsInspResultDetailInfo[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public deleteByResultIds = async (ids: number[], uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByResultIds(ids, uid, tran); }
		catch (error) { throw error; }
  };
}

export default QmsInspResultDetailInfoService;