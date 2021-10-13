// add enum of transaction type code
const TRAN_TYPE_CD = {
  MAT_INCOME: 'MI',                 // 📌 자재입고
  MAT_RETURN: 'MR',                 // 📌 자재반출
  MAT_RELEASE: 'MOPI',              // 📌 공정출고
  PRD_RETURN: 'POMI',               // 📌 자재반납
  PRD_OUTPUT: 'PI',                 // 📌 생산입고
  PRD_INPUT: 'PO',                  // 📌 생산투입
  PRD_REJECT: 'PR',                 // 📌 생산부적합
  SAL_INCOME: 'POSI',               // 📌 제품입고
  SAL_RELEASE: 'SOWI',              // 📌 제품출고
  SAL_OUTGO: 'WO',                  // 📌 제품출하
  SAL_RETURN: 'SR',                 // 📌 제품반입
  OUT_INCOME: 'OI',                 // 📌 사급입고
  OUT_RELEASE: 'OO',                // 📌 사급출고
  INVENTORY: 'INV',                 // 📌 재고실사
  INV_MOVE: 'IM',                   // 📌 재고이동
  INV_REJECT: 'IR',                 // 📌 재고부적합
  QMS_RECEIVE_INSP_REJECT: 'QRIR',  // 📌 수입검사부적합
  QMS_FINAL_INSP_INCOME: 'QFII',    // 📌 최종검사입고
  QMS_FINAL_INSP_REJECT: 'QFIR',    // 📌 최종검사부적합
  QMS_REWORK: 'QR',                 // 📌 부적합품판정(재작업)
  QMS_DISPOSAL: 'QDP',              // 📌 부적합품판정(폐기)
  QMS_RETURN: 'QRW',                // 📌 부적합품판정(반출대기)
  QMS_DISASSEMBLE: 'QD',            // 📌 부적합품판정(분해)
  QMS_DISASSEMBLE_INCOME: 'QDI',    // 📌 부적합품판정(분해입고)
  QMS_DISASSEMBLE_RETURN: 'QDRW',   // 📌 부적합품판정(분해반출대기)
  ETC_INCOME: 'EI',                 // 📌 기타입고
  ETC_RELEASE: 'EO',                // 📌 기타출고
};

const getTranTypeCd = ( 
  _type: 
    'MAT_INCOME' |
    'MAT_RETURN' |
    'MAT_RELEASE' |
    'PRD_RETURN' |
    'PRD_OUTPUT' |
    'PRD_INPUT' |
    'PRD_REJECT' |
    'SAL_INCOME' |
    'SAL_RELEASE' |
    'SAL_OUTGO' |
    'SAL_RETURN' |
    'OUT_INCOME' |
    'OUT_RELEASE' |
    'INVENTORY' |
    'INV_MOVE' |
    'INV_REJECT' |
    'QMS_RECEIVE_INSP_REJECT' |
    'QMS_FINAL_INSP_INCOME' |
    'QMS_FINAL_INSP_REJECT' |
    'QMS_REWORK' |
    'QMS_DISPOSAL' |
    'QMS_RETURN' |
    'QMS_DISASSEMBLE' |
    'QMS_DISASSEMBLE_INCOME' |
    'QMS_DISASSEMBLE_RETURN' |
    'ETC_INCOME' |
    'ETC_RELEASE' ) => { return TRAN_TYPE_CD[_type]; }

export default getTranTypeCd;