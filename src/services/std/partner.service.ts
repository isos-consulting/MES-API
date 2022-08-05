import { Transaction } from "sequelize/types";
import StdPartnerTypeRepo from '../../repositories/std/partner-type.repository';
import StdPartnerRepo from '../../repositories/std/partner.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import StdPartnerTypeService from "./partner-type.service";

class StdPartnerService {
  tenant: string;
  stateTag: string;
  repo: StdPartnerRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'stdPartner';
    this.repo = new StdPartnerRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'partnerType',
        TRepo: StdPartnerTypeRepo,
        idName: 'partner_type_id',
        uuidName: 'partner_type_uuid'
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
    try { return await this.repo.patch(datas, uid, tran) }
		catch (error) { throw error; }
  }

  public delete = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  }

  public excelValidation = async (datas: any[]) => {
    try {
      const partnerTypeService = new StdPartnerTypeService(this.tenant);
      
      let partnerTypeCds = datas.map(value => value.partner_type_cd);
      partnerTypeCds = [...new Set(partnerTypeCds)];
      
      const partnerTypeDatas = (await partnerTypeService.readByUniques(partnerTypeCds)).raws;

      const partnerCdObject: any = {};

      datas.forEach(data => {
        const errors = [];
        const partnerType = partnerTypeDatas.find(element => element.partner_type_cd === data.partner_type_cd);
        
        if (!partnerType) {
          errors.push('partner_type_cd');
        } else {
          data['partner_type_uuid'] = partnerType.uuid;
          data.partner_type_nm = partnerType.partner_type_nm;
        }

        if (!partnerCdObject[data.partner_cd]) {
          partnerCdObject[data.partner_cd] = true;
        } else {
          errors.push('partner_cd');
        }

        data['error'] = '';
        if (errors.length > 0) {
          data['error'] = `잘못된 데이터입니다 (${[...errors]})`
        }
      });
      
      return {count: datas.length, raws: datas};
    } catch (error) {
      throw error;
    }
  }
}

export default StdPartnerService;