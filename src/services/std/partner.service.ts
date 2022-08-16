import { Transaction } from "sequelize/types";
import StdPartnerTypeRepo from '../../repositories/std/partner-type.repository';
import StdPartnerRepo from '../../repositories/std/partner.repository';
import { TDateType } from "../../types/date-type.type";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import getFkUuidByCd, { getFkUuidInfo } from "../../utils/getFkUuidByCd";
import convertToUniqueOrFk from "../../utils/convertToUniqueOrFk";
import isBoolean from "../../utils/isBoolean";
import { isDate } from "../../utils/isDateFormat";
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
        uuidName: 'partner_type_uuid',
      },
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  }

	public convertFkUuidByCd = async (datas: any) => {
		const fkUuidInfos: getFkUuidInfo[] =[
			{
        key: 'partnerType',
        TRepo: StdPartnerTypeRepo,
        cdName: 'partner_type_cd',
        uuidName: 'partner_type_uuid',
      },
		];

    return await getFkUuidByCd(this.tenant, datas,fkUuidInfos );
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

	public readUniqueOrFkColumn = async () => {
    try { 
			const attributes = (await this.repo.readRawAttributes()).raws[0]; 
			const result = convertToUniqueOrFk(attributes);

			return result; 
		} 
		catch (error) { throw error; }
  };

  public excelValidation = async (datas: any[], columns: any[], uniqueColumns: string[]) => {
    try {
      const partnerTypeService = new StdPartnerTypeService(this.tenant);
      
      let partnerTypeCds = datas.map(value => value.partner_type_cd);
      partnerTypeCds = [...new Set(partnerTypeCds)];
      
      const partnerTypeDatas = (await partnerTypeService.readByUniques(partnerTypeCds)).raws;

      // popup(참조) 컬럼 참조 객체
      /**
       * {
       *   unique 컬럼(예> ..._cd 등): {
       *     uuidColumnName: UUID 컬럼 명,
       *     uuidDatas: unique 컬럼 데이터로 조회한 data
       *   }
       * }
       */
      const uuidObj = {
        partner_type_cd: {
          uuidColumnName: 'partner_type_uuid',
          uuidDatas: partnerTypeDatas,
        },
      };

      const originalDatas = (await this.read({})).raws;
      
      return this.checkExcelValidate(datas, columns, originalDatas, uniqueColumns, uuidObj);
    } catch (error) {
      throw error;
    }
  }

  public checkExcelValidate = async (datas: any[], columns: any[], originalDatas: any[], uniqueColumns: string[], uuidObj?: any) => {
    const validations = getColumnValidation(columns);
    
    // 중복값 초기 세팅
    /**
     * 예)
     * {
     *   partner_cd: {
     *     '00195': true,
     *     '01204': true,
     *     ... 실제 DB에 있는 값
     *   }
     * }
     */
    const uniqueValue: any = {};
    uniqueColumns.forEach(uniqueColumn => {
      uniqueValue[uniqueColumn] = {};
      originalDatas.forEach(data => {
        uniqueValue[uniqueColumn][data[uniqueColumn]] = true;
      });
    });

    // validation 체크 구간
    datas.forEach(data => {
      const errors: string[] = [];
      columns.forEach(column => {
        const columnCode = column.excel_form_column_cd;

        // not empty and type check validation
        for (let { validate, params, message } of validations[columnCode]) {
          if (!validate(data[columnCode], [... params])) {
            errors.push(`${message} (${column.excel_form_column_nm})`);
          }
        }
        
        // cd에 맞는 uuid 있는지 확인
        if (column.excel_form_type === 'popup' && uuidObj && uuidObj[columnCode]) {
          const { uuidColumnName, uuidDatas } = uuidObj[columnCode];

          const findResult = uuidDatas.find((element: any) => element[columnCode] === data[columnCode]);

          if (findResult) {
            data[uuidColumnName] = findResult['uuid'];
          } else {
            errors.push(`잘못된 데이터를 입력했습니다. (${column.excel_form_column_nm})`);
          }
        }

        // 중복체크
        if (uniqueColumns.includes(columnCode)) {
          if (!uniqueValue[columnCode][data[columnCode]]) {
            uniqueValue[columnCode][data[columnCode]] = true;
          } else {
            errors.push(`중복된 데이터를 입력했습니다. (${column.excel_form_column_nm})`);
          }
        }
      });

      data['error'] = errors;
    });

    return {count: datas.length, raws: datas};
  }
}

function isNotEmpty(data: any, _params?: any) {
  if (data === undefined || data === null || data.length === 0) {
    return false;
  } else {
    return true;
  }
}

function isString(data: any, _params?: any) {
  if (!data) {
    return true;
  }
  if (typeof data === 'string') {
    return true;
  } else {
    return false;
  }
}

/**
 * 컬럼별 validation 셋팅 (타입 및 필수 값 여부만)
 * columns (예> partner_type_cd, partner_type_nm, partner_cd ...)을 돌면서
 * 해당 컬럼에 맞는 validation function을 validations에 저장하여 return
 * 
 * validations 구조
 * columnCode: [
 *   { validate: function, params: [ validate 함수에 data 외에 추가될 매개변수 ], message: 오류메세지 }
 * ]
 * 
 * 예)
 * {
 *   partner_type_cd: [
 *     { validate: isNotEmpty, params: [], message: ...},
 *     { validate: isString, params: [], message: ...}
 *   ]
 * }
 */
function getColumnValidation(columns: any[]) {
  const validations: any = {};
    
  columns.forEach(column => {
    const columnCode = column.excel_form_column_cd;
    validations[columnCode] = [];

    if (column.column_fg) {
      validations[columnCode].push({
        validate: isNotEmpty,
        params: [],
        message: `필수 항목을 입력하지 않았습니다.`
      });
    }

    switch (column.excel_form_type) {
      case 'text':
      case 'popup':
        validations[columnCode].push({
          validate: isString,
          params: [],
          message: `잘못된 형식을 입력했습니다.`
        });
        break;

      case 'date':
        validations[columnCode].push({
          validate: isDate,
          params: [TDateType.DATE],
          message: `잘못된 형식을 입력했습니다.`
        });
        break;

      case 'datetime':
        validations[columnCode].push({
          validate: isDate,
          params: [TDateType.DATE_TIME],
          message: `잘못된 형식을 입력했습니다.`
        });
        break;

      case 'time':
        validations[columnCode].push({
          validate: isDate,
          params: [TDateType.TIME],
          message: `잘못된 형식을 입력했습니다.`
        });
        break;
      
      case 'boolean':
        validations[columnCode].push({
          validate: isBoolean,
          params: [],
          message: `잘못된 형식을 입력했습니다.`
        });
        break;
    }
  });

  return validations;
}

export default StdPartnerService;
