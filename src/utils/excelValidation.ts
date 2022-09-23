import { Repository } from "sequelize-typescript";
import ApiResult from "../interfaces/common/api-result.interface";
import AdmExcelFormService from "../services/adm/excel-form.service";
import excelValidationInfos from "../types/excel-validation-info.type";
import checkExcelValidator from "./checkExcelValidator";
import convertToUniqueOrFk from "./convertToUniqueOrFk";
import getFkUuidByCd from "./getFkUuidByCd";
import getRawAttributes from "./getRawAttributes";
import { getSequelize } from "./getSequelize";
import { setExcelValidationEmptyError } from "./setExcelValidationEmptyError";

const excelValidation = async (bodyDatas: any[], excelFormCd: string, tenantUuid: string) => {
  let result: ApiResult<any> = { count: 0, raws: [] };
  if (bodyDatas === undefined || bodyDatas.length === 0) {
    return result;
  }

  const excelInfo: any = excelValidationInfos[excelFormCd];
  const { fkUuidInfos, modelClass, repoClass } = excelInfo;
  
  const sequelize = getSequelize(tenantUuid);
  const repo = sequelize.getRepository(modelClass);

  
  let datas = setExcelValidationEmptyError(bodyDatas);
  datas = await getFkUuidByCd(tenantUuid, datas, fkUuidInfos);

  const excelFormService = new AdmExcelFormService(tenantUuid);
  const excelFormColumns = await excelFormService.readRawByCd(excelFormCd);
  const validaitonColumns = await getValidationColumns(repo, excelFormColumns);

  const validationResult = await checkExcelValidator(datas, validaitonColumns, repoClass, tenantUuid);

  result = { count: validationResult.length, raws: validationResult };

  return result;
}

const getValidationColumns =  async <M> (repo: Repository<M>, excelColumns: any[]) => {
  const attributes = getRawAttributes(repo);
  const result = convertToUniqueOrFk(attributes);
  result.notNull = excelColumns.filter((value: any) => value.column_fg);
  result.columns = excelColumns;

  return result;
}

export default excelValidation;