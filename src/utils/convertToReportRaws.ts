import checkArray from "./checkArray";

/**
 * Report 를 조회 할 때 조회한 Raw 데이터를 data, sub-total, total로 구분 변환
 * @param raws Report 조회 형태로 변경 할 Raws
 * @returns [{ datas: any[], subTotals: any[], total: any }]
 */
const convertToReportRaws = (raws: any[]) => {
  const result: { total: any, subTotals: any[], datas: any[] } = { total: {}, subTotals: [], datas: [] }

  raws.forEach((raw: any) => {
    switch (raw.row_type) {
      case 'data': result.datas.push(raw); break;
      case 'sub-total': result.subTotals.push(raw); break;
      case 'total': result.total = raw; break;
      default: break;
    }
  });

  return checkArray(result);
}

export default convertToReportRaws;