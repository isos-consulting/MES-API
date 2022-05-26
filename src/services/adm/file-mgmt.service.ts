import axios from "axios";
import { Transaction } from "sequelize/types";
import AdmFileMgmtDetailTypeRepo from "../../repositories/adm/file-mgmt-detail-type.repository";
import AdmFileMgmtRepo from "../../repositories/adm/file-mgmt.repository";
import AdmFileMgmt from "../../repositories/adm/file-mgmt.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import _, { isArray } from 'lodash';
import createApiError from '../../utils/createApiError';
import { errorState } from '../../states/common.state';
import config from '../../configs/config';

class AdmFileMgmtService {
  tenant: string;
  stateTag: string;
  repo: AdmFileMgmtRepo;
  fkIdInfos: getFkIdInfo[];
	url: string;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'admfileMgmt';
    this.repo = new AdmFileMgmt(tenant);
		this.url = config.node_env === 'test' ? 'http://localhost:3010' : 'https://was.isos.kr:3010'

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
            url: `${this.url}/temp/file/${uuid}/size/1234`,
            method: 'GET'
          });
        })
      )
    } catch (error) { 	
				throw createApiError(
				400, 
				{
          admin_message: `Temp Storage에 파일존재 여부 확인중 문제가 발생 하였습니다. ${error}`,
          user_message: `파일존재 여부 확인중 문제가 발생 하였습니다.`,
        }, 
				this.stateTag, 
				errorState.EMPTY_FILE_IN_TEMP_STORAGE
			); 
		}
  }

  public isExistInRealStorage = async (uuids: string[]) => {
    try {
      await Promise.all(
        uuids.map(uuid => {
          return axios({
            url: `${this.url}/tenant/${this.tenant}/file/${uuid}`,
            method: 'GET'
          });
        })
      )
    } catch (error) { 	
				throw createApiError(
				400, 
				{
          admin_message: `Real Storage에 파일존재 여부 확인중 문제가 발생 하였습니다. ${error}`, 
          user_message: `파일존재 여부 확인중 문제가 발생 하였습니다.`
        }, 
				this.stateTag, 
				errorState.EMPTY_FILE_IN_REAL_STORAGE
			); 
		}
  }

  public moveToRealStorage = async (uuids: string[]) => {
    try {
      await Promise.all(
        uuids.map(uuid => {
          return axios({
            url: `${this.url}/tenant/${this.tenant}/file/${uuid}`,
            method: 'POST'
          });
        })
      )
    } catch (error) { 	
				throw createApiError(
				400, 
				{
          admin_message: `파일업로드 요청중 문제가 발생하였습니다. ${error}`,
          user_message: `파일업로드 요청중 문제가 발생하였습니다.`,
        }, 
				this.stateTag, 
				errorState.FAILED_UPLOAD_FILE
			); 
		}
  }

  public deleteFromRealStorage = async (uuids: string[]) => {
    try {
      await Promise.all(
        uuids.map(uuid => {
          return axios({
            url: `${this.url}/tenant/${this.tenant}/file/${uuid}`,
            method: 'DELETE'
          });
        })
      )
    } catch (error) { 
			throw createApiError(
				400, 
				{
          admin_message: `파일삭제 요청중 문제가 발생하였습니다. ${error}`,
          user_message: `파일삭제 요청중 문제가 발생하였습니다.`,
        }, 
				this.stateTag, 
				errorState.FAILED_DELETE_FILE
			); 
		}
  }

	//어디서 삭제중 발생한 에러다 .

	public getFileDatasByUnique  = async (datas: any, raws: any[], uniques: string[]) => {
		let fileDatas: any[] = [];
		let referenceUuid: string;
		let isMatched: boolean = false;

		datas
		.filter((data: any) => data.files && isArray(data.files))
		.forEach((data: any) => {
			for (const raw of raws) {
				for (const unique of uniques) {
					if (raw[unique] !== data[unique]) {
						isMatched = false;
						break;
					}
					isMatched = true;
				}

				if (isMatched) { 
					referenceUuid = raw.uuid; 
					break;
				}
			}
			data.files.forEach((file: any) => {
				file.reference_uuid = referenceUuid;
				fileDatas.push(file);
			});
		});
		
		return await this.convertFk(fileDatas);
	}

	public validateFileInTempStorage = async(datas: any) => {
		let fileDatas: any[] = [];
    let fileUuids: string[] = [];

		datas
		.filter((data: any) => data.files && isArray(data.files))
		.forEach((data: any) => {
			fileDatas = [...fileDatas, ...data.files];
			fileUuids = [...fileUuids, ...data.files.map((file: any) => file.uuid)];
		});
		await this.isExistInTempStorage(fileUuids);
		return fileUuids;
	}
}

export default AdmFileMgmtService;