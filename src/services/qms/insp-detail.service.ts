import { Transaction } from "sequelize/types";
import IQmsInspDetail from "../../interfaces/qms/insp-detail.interface";
import QmsInspDetailRepo from "../../repositories/qms/insp-detail.repository";
import QmsInspRepo from "../../repositories/qms/insp.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdInspItemRepo from "../../repositories/std/insp-item.repository";
import StdInspMethodRepo from "../../repositories/std/insp-method.repository";
import StdInspToolRepo from "../../repositories/std/insp-tool.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class QmsInspDetailService {
  tenant: string;
  stateTag: string;
  repo: QmsInspDetailRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'qmsInspDetail';
    this.repo = new QmsInspDetailRepo(tenant);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'insp',
        TRepo: QmsInspRepo,
        idName: 'insp_id',
        uuidName: 'insp_uuid'
      },
      {
        key: 'inspItem',
        TRepo: StdInspItemRepo,
        idName: 'insp_item_id',
        uuidName: 'insp_item_uuid'
      },
      {
        key: 'inspMethod',
        TRepo: StdInspMethodRepo,
        idName: 'insp_method_id',
        uuidName: 'insp_method_uuid'
      },
      {
        key: 'inspTool',
        TRepo: StdInspToolRepo,
        idName: 'insp_tool_id',
        uuidName: 'insp_tool_uuid'
      },
      {
        key: 'uuid',
        TRepo: QmsInspDetailRepo,
        idName: 'insp_detail_id',
        uuidName: 'uuid'
      },
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IQmsInspDetail[], uid: number, tran: Transaction) => {
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

  public update = async (datas: IQmsInspDetail[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IQmsInspDetail[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public delete = async (datas: IQmsInspDetail[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

  /**
   * 입력한 전표에 해당하는 상세전표의 Max Sequence 조회
   * @param id 전표의 ID
   * @param tran DB Transaction
   * @returns Sequence
   */
   public getMaxSeq = async (id: number, tran?: Transaction) => {
    try { return await this.repo.getMaxSeq(id, tran); } 
    catch (error) { throw error; }
  }

  /**
   * 기준서단위의 상세기준서 개수 조회
   * @param inspId 기준서 ID
   * @param transaction Transaction
   * @returns 기준서단위의 상세전표 개수
   */
   public getCount = async (id: number, tran?: Transaction) => {
    try { return await this.repo.getCount(id, tran); } 
    catch (error) { throw error; }
  }
}

export default QmsInspDetailService;