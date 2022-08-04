import { Transaction } from "sequelize/types";
import AutMenuRepo from "../../repositories/aut/menu.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import AdmExcelFormRepo from "../../repositories/adm/excel-form.repository";
import config from "../../configs/config";
import axios from "axios";
import createApiError from "../../utils/createApiError";
import { errorState } from "../../states/common.state";
import AdmMenuFileService from "./menu-file.service";
import ApiResult from "../../interfaces/common/api-result.interface";
import { TFileType } from "../../types/file-type.type";
class AdmExcelFormService {
  tenant: string;
  stateTag: string;
  repo: AdmExcelFormRepo;
  fkIdInfos: getFkIdInfo[];
  url: string;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'admExcelForm';
    this.repo = new AdmExcelFormRepo(tenant);
    this.url = config.node_env === 'test' ? 'http://localhost:3010' : 'https://was.isos.kr:3010';

    this.fkIdInfos = [
      {
        key: 'menu',
        TRepo: AutMenuRepo,
        idName: 'menu_id',
        uuidName: 'menu_uuid'
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

  public readByMenuId = async (menuId: string, tran: Transaction) => {
    try { return await this.repo.readByMenuId(menuId, tran); } 
		catch (error) { throw error; }
  };

	public readByMenu = async () => {
    try { return await this.repo.readByMenu(); } 
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

	public excelFormDownload = async (params: any) => {
    try { 
			return await this.repo.read(params); 
		} 
		catch (error) { throw error; }
  }

  public handleExcelForm = async (result: ApiResult<any>, uid: number, tran: Transaction) => {
    const menuFileService = new AdmMenuFileService(this.tenant);
    
    if (result.count > 0) {
      const resultMenuIds = [...new Set(result.raws.map(value => value.menu_id))];
      for (let menuId of resultMenuIds) {
        try {
          let menuFileUuid = '';
          const menuFileResult = await menuFileService.readByMenuId(menuId, TFileType.EXCEL);

          const menuFileBody = {
            uuid: menuFileResult?.raws[0]?.menu_file_uuid ?? null,
            menu_id: menuId,
            file_type: TFileType.EXCEL,
            file_extension: 'xlsx',
            use_fg: true,
            file_name: menuFileResult?.raws[0]?.file_name ?? result.raws.find(element=> element.menu_id === menuId)?.excel_form_nm,
          };
          
          const excelFormResult = await this.readByMenuId(menuId, tran);
          
          const method = excelFormResult.count === 0 ? menuFileService.delete : menuFileResult.count > 0 ? menuFileService.update : menuFileService.create;
          
          menuFileUuid = await (await method([menuFileBody], uid, tran)).raws[0].uuid;
          
          if (excelFormResult.count > 0) {
            await this.postExcelFormDataToStorage(menuFileUuid, excelFormResult.raws);
          } else {
            await this.deleteExcelFormDataInStorage(menuFileUuid);
          }

        } catch (error) {
          throw error;
        }
      }
    }
  }

  public postExcelFormDataToStorage = async (uuid: string, body: any) => {
    try {
      return await axios({
        url: `${this.url}/tenant/${this.tenant}/excel/${uuid}`,
        method: 'POST',
        data: body,
      });
    } catch (error) { 	
      throw createApiError(
				400, 
				{
          admin_message: `엑셀업로드 요청 중 문제가 발생하였습니다. ${error}`,
          user_message: `엑셀업로드 요청 중 문제가 발생하였습니다.`,
        },
				this.stateTag, 
				errorState.FAILED_UPLOAD_FILE
			); 
    }
  }

  public deleteExcelFormDataInStorage = async (uuid: string) => {
    try {
      return await axios({
        url: `${this.url}/tenant/${this.tenant}/excel/${uuid}`,
        method: 'DELETE'
      });
    } catch (error) {
      throw createApiError(
				400, 
				{
          admin_message: `엑셀 삭제 요청 중 문제가 발생하였습니다. ${error}`,
          user_message: `엑셀 삭제 요청 중 문제가 발생하였습니다.`,
        },
				this.stateTag, 
				errorState.FAILED_UPLOAD_FILE
			); 
    }
  }
}

export default AdmExcelFormService;