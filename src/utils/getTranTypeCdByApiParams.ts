import getTranTypeCd from "./getTranTypeCd";

// 📒 Fn[getTranTypeCdByApiParams]: Api Parameter로부터 TranTypeCd 생성
/**
 * Api Parameter로부터 TranTypeCd 생성
 * @param tranType 수불 유형에 따른 Api Parameter
 * @returns TranTypeCd(수불유형코드)
 */
const getTranTypeCdByApiParams = (tranType: string) => {
  let tranCd: string | undefined;

  switch (tranType) {
    // 📌 수불유형 전체 조회
    case 'all': break;
    // 📌 자재입하 수불내역 조회
    case 'matIncome': tranCd = getTranTypeCd('MAT_INCOME'); break;
    // 📌 자재반출 수불내역 조회
    case 'matReturn': tranCd = getTranTypeCd('MAT_RETURN'); break;
    // 📌 공정출고 수불내역 조회
    case 'matRelease': tranCd = getTranTypeCd('MAT_RELEASE'); break;
    // 📌 자재반납 수불내역 조회
    case 'prdReturn': tranCd = getTranTypeCd('PRD_RETURN'); break;
    // 📌 생산입고 수불내역 조회
    case 'prdOutput': tranCd = getTranTypeCd('PRD_OUTPUT'); break;
    // 📌 생산투입 수불내역 조회
    case 'prdInput': tranCd = getTranTypeCd('PRD_INPUT'); break;
    // 📌 생산부적합 수불내역 조회
    case 'prdReject': tranCd = getTranTypeCd('PRD_REJECT'); break;
    // 📌 제품입고 수불내역 조회
    case 'salRelease': tranCd = getTranTypeCd('SAL_INCOME'); break;
    // 📌 제품출고 수불내역 조회
    case 'salRelease': tranCd = getTranTypeCd('SAL_RELEASE'); break;
    // 📌 제품출하 수불내역 조회
    case 'salOutgo': tranCd = getTranTypeCd('SAL_OUTGO'); break;
    // 📌 제품반입 수불내역 조회
    case 'salReturn': tranCd = getTranTypeCd('SAL_RETURN'); break;
    // 📌 사급입고 수불내역 조회
    case 'outIncome': tranCd = getTranTypeCd('OUT_INCOME'); break;
    // 📌 사급출고 수불내역 조회
    case 'outRelease': tranCd = getTranTypeCd('OUT_RELEASE'); break;
    // 📌 재고실사 수불내역 조회
    case 'inventory': tranCd = getTranTypeCd('INVENTORY'); break;
    // 📌 재고이동 수불내역 조회
    case 'invMove': tranCd = getTranTypeCd('INV_MOVE'); break;
    // 📌 재고부적합 수불내역 조회
    case 'invReject': tranCd = getTranTypeCd('INV_REJECT'); break;
    // 📌 부적합품판정(재작업) 수불내역 조회
    case 'qmsRework': tranCd = getTranTypeCd('QMS_REWORK'); break;
    // 📌 부적합품판정(폐기) 수불내역 조회
    case 'qmsDisposal': tranCd = getTranTypeCd('QMS_DISPOSAL'); break;
    // 📌 부적합품판정(반출대기) 수불내역 조회
    case 'qmsReturn': tranCd = getTranTypeCd('QMS_RETURN'); break;
    // 📌 부적합품판정(분해) 수불내역 조회
    case 'qmsDisassemble': tranCd = getTranTypeCd('QMS_DISASSEMBLE'); break;
    // 📌 부적합품판정(분해입고) 수불내역 조회
    case 'qmsDisassembleIncome': tranCd = getTranTypeCd('QMS_DISASSEMBLE_INCOME'); break;
    // 📌 부적합품판정(분해반출대기) 수불내역 조회
    case 'qmsDisassembleReturn': tranCd = getTranTypeCd('QMS_DISASSEMBLE_RETURN'); break;
    // 📌 기타입고 수불내역 조회
    case 'etcIncome': tranCd = getTranTypeCd('ETC_INCOME'); break;
    // 📌 기타출고 수불내역 조회
    case 'etcRelease': tranCd = getTranTypeCd('ETC_RELEASE'); break;

    default: break;
  }

  return tranCd;
}

export default getTranTypeCdByApiParams;