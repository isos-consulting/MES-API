import { Transaction } from "sequelize/types";
import EqmInspRepo from "../../repositories/eqm/insp.repository";
import StdEquipRepo from "../../repositories/std/equip.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import { errorState } from "../../states/common.state";
import createApiError from "../../utils/createApiError";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import getSubtractTwoDates from "../../utils/getSubtractTwoDates";

class EqmInspService {
  tenant: string;
  stateTag: string;
  repo: EqmInspRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'eqmInsp';
    this.repo = new EqmInspRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'insp',
        TRepo: EqmInspRepo,
        idName: 'insp_id',
        uuidName: 'uuid'
      },
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'equip',
        TRepo: StdEquipRepo,
        idName: 'equip_id',
        uuidName: 'equip_uuid'
      }
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

  /**
   * 설비점검 기준서의 등록일시와 적용일시 데이터 검증
   * 등록일시(reg_date)가 적용일시(apply_date)보다 늦을경우에 대한 검증
   * @param datas 설비점검 기준서 Data
   * @returns 검증 성공시 true, 실패시 Throw Error
   */
  public validateDateDiff = (data: any) => {
    try {
      if (getSubtractTwoDates(data.reg_date, data.apply_date) < 0) {
        throw createApiError(
          400, 
          { 
            admin_message: `잘못된 등록일시(${data.reg_date}) 및 적용일시(${data.apply_date})가 입력되었습니다.`,
            user_message: `잘못된 등록일시(${data.reg_date}) 및 적용일시(${data.apply_date})가 입력되었습니다.` 
          }, 
          this.stateTag, 
          errorState.INVALID_DIFF_DATE
        );
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 입력한 설비에 해당하는 모든 기준서를 적용해제한다.
   * @param uuid 설비UUID 
   * @param uid 사용자의 UID
   * @param tran DB Transaction
   */
  public cancelApplyByEquip = async (uuid: any, uid: number, tran: Transaction) => {
    try {
      const datas = await this.repo.read({ equip_uuid: uuid });
      if (datas.count === 0) {
        throw createApiError(
          400, 
          {
            admin_message: `설비 기준으로 등록된 기준서가 없습니다. [설비UUID: ${uuid}]`,
            user_message: '기준서 조회결과가 없습니다.'
          }, 
          this.stateTag, 
          errorState.NO_DATA
        );
      }

      const params = datas.raws.map((data: any) => {
        return {
          uuid: data.insp_uuid,
          apply_fg: false,
          apply_date: null
        }
      });

      return await this.repo.updateApply(params, uid, tran);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 입력한 기준서에 해당하는 적용여부를 수정한다.
   * @param param Object  
   *              uuid: 기준서 uuid  
   *              apply_fg: 기준서 적용 여부  
   *              apply_date: 기준서 적용 일시 (입력 안하면 현재시간)
   * @param uid 사용자의 UID
   * @param tran DB Transaction
   */
  public updateApply = async (
    param: { uuid: any, apply_fg: boolean, apply_date: string | null },
    uid: number, 
    tran: Transaction
  ) => {
    try {
      return await this.repo.updateApply([param as any], uid, tran);
    } catch (error) {
      throw error;
    }
  }
}

export default EqmInspService;