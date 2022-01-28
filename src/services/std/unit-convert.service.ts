import { Transaction } from "sequelize/types";
import StdProdRepo from "../../repositories/std/prod.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import StdUnitConvertRepo from "../../repositories/std/unit-convert.repository";
import StdUnitRepo from "../../repositories/std/unit.repository";
import createApiError from "../../utils/createApiError";
import { errorState } from "../../states/common.state";

class StdUnitConvertService {
  tenant: string;
  stateTag: string;
  repo: StdUnitConvertRepo;
  prodRepo: StdProdRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'stdUnitConvert';
    this.repo = new StdUnitConvertRepo(tenant);
    this.prodRepo = new StdProdRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'unitConvert',
        TRepo: StdUnitConvertRepo,
        idName: 'unit_convert_id',
        uuidName: 'unit_convert_uuid'
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'fromUnit',
        TRepo: StdUnitRepo,
        idName: 'unit_id',
        idAlias: 'from_unit_id',
        uuidName: 'from_unit_uuid'
      },
      {
        key: 'toUnit',
        TRepo: StdUnitRepo,
        idName: 'unit_id',
        idAlias: 'to_unit_id',
        uuidName: 'to_unit_uuid'
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

  /**
   * 품목 테이블의 단위와 입력된 단위를 비교하여 단위 변환 값에 대하여 수량을 변경
   * @param prodId 대상 품목ID
   * @param unitId 대상 단위ID
   * @param qty 수량
   * @returns 변환된 수량(변환 대상이 아닐 경우 동일 값 반환)
   */
  public convertQty = async (prodId: number, unitId: number, qty: number) => {
    const prod = await (await this.prodRepo.readRawByPk(prodId)).raws[0];
    if (!prod) {
      throw createApiError(
        400, 
        `유효하지 않은 품목ID입니다. [${prodId}]`, 
        this.stateTag, 
        errorState.INVALID_DATA
      );
    }

    // 📌 품목 테이블의 단위ID와 입력된 단위ID가 다를 경우 수량에 대한 Convert 진행
    if (unitId != prod.unit_id) {
      const convertValue = await this.repo.getConvertValueByUnitId(unitId, prod.unit_id, prodId);
      
      if (!convertValue) {
        throw createApiError(
          400, 
          `단위변환 데이터가 존재하지 않습니다. [from: ${unitId}, to: ${prod.unit_id}]`, 
          this.stateTag, 
          errorState.INVALID_DATA
        );
      }

      // 📌 변환 값이 존재하는 경우 입력된 수량에 변환 값을 곱한다.
      qty *= convertValue;
    }

    return qty;
  }
}

export default StdUnitConvertService;