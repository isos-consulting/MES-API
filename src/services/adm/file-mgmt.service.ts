import axios from "axios";
import { Transaction } from "sequelize/types";
import AdmFileMgmtDetailTypeRepo from "../../repositories/adm/file-mgmt-detail-type.repository";
import AdmFileMgmtRepo from "../../repositories/adm/file-mgmt.repository";
import AdmFileMgmt from "../../repositories/adm/file-mgmt.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class AdmFileMgmtService {
  tenant: string;
  stateTag: string;
  repo: AdmFileMgmtRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'admfileMgmt';
    this.repo = new AdmFileMgmt(tenant);

    this.fkIdInfos = [
      {
        key: 'fileMgmtDetailType',
        TRepo: AdmFileMgmtDetailTypeRepo,
        idName: 'file_mgmt_detail_type_id',
        uuidName: 'file_mgmt_detail_type_uuid'
      },
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

  public deleteByReferenceUuids = async (uuids: string[], uid: number, tran: Transaction) => {
    try { return await this.repo.deleteByReferenceUuids(uuids, uid, tran); } 
		catch (error) { throw error; }
  }

  public isExistInTempStorage = async (uuids: string[]) => {
    try {
      await Promise.all(
        uuids.map(uuid => {
          return axios({
            url: `http://localhost:3000/temp/file/${uuid}/size/1234`,
            method: 'GET'
          });
        })
      )
    } catch (error) { throw error; }
  }

  public isExistInRealStorage = async (uuids: string[]) => {
    try {
      await Promise.all(
        uuids.map(uuid => {
          return axios({
            url: `http://localhost:3000/tenant/${this.tenant}/file/${uuid}`,
            method: 'GET'
          });
        })
      )
    } catch (error) { throw error; }
  }

  public moveToRealStorage = async (uuids: string[]) => {
    try {
      await Promise.all(
        uuids.map(uuid => {
          return axios({
            url: `http://localhost:3000/tenant/${this.tenant}/file/${uuid}`,
            method: 'POST'
          });
        })
      )
    } catch (error) { throw error; }
  }

  public deleteFromRealStorage = async (uuids: string[]) => {
    try {
      await Promise.all(
        uuids.map(uuid => {
          return axios({
            url: `http://localhost:3000/tenant/${this.tenant}/file/${uuid}`,
            method: 'DELETE'
          });
        })
      )
    } catch (error) { throw error; }
  }
}

export default AdmFileMgmtService;