// add enum of transaction type code
const TRAN_TYPE_CD = {
  MAT_INCOME: 'MI',                 // 👉 Material In                       📌 자재입고                  
  MAT_RETURN: 'MR',                 // 👉 Material Return                   📌 자재반출
  MAT_RELEASE: 'MOPI',              // 👉 Material Out Product In           📌 공정출고
  PRD_RETURN: 'POMI',               // 👉 Product Out Material In           📌 자재반납
  PRD_OUTPUT: 'PI',                 // 👉 Product In                        📌 생산입고
  PRD_INPUT: 'PO',                  // 👉 Product Out                       📌 생산투입
  PRD_REJECT: 'PR',                 // 👉 Product Reject                    📌 생산부적합
  SAL_INCOME: 'POSI',               // 👉 Product Out Sales In              📌 제품입고
  SAL_RELEASE: 'SOWI',              // 👉 Sales Out Wait In                 📌 제품출고
  SAL_OUTGO: 'WO',                  // 👉 Wait Out                          📌 제품출하
  SAL_RETURN: 'SR',                 // 👉 Sales Reject                      📌 제품반입
  OUT_INCOME: 'OI',                 // 👉 Outsourcing In                    📌 사급입고
  OUT_INPUT: 'OO',                  // 👉 Outsourcing Out                   📌 사급투입
  OUT_RELEASE: 'OOPI',              // 👉 Outsourcing Out Partner In        📌 사급출고
  INVENTORY: 'INV',                 // 👉 Inventory                         📌 재고실사
  INV_MOVE: 'IM',                   // 👉 Inventory Move                    📌 재고이동
  INV_REJECT: 'IR',                 // 👉 Inventory Reject                  📌 재고부적합
  QMS_RECEIVE_INSP_REJECT: 'QRIR',  // 👉 Quality Receive Insp Reject       📌 수입검사부적합
  QMS_FINAL_INSP_INCOME: 'QFII',    // 👉 Quailty Final Insp In             📌 최종검사입고
  QMS_FINAL_INSP_REJECT: 'QFIR',    // 👉 Quality Final Insp Reject         📌 최종검사부적합
  QMS_REWORK: 'QR',                 // 👉 Quality Rework                    📌 부적합품판정(재작업)
  QMS_DISPOSAL: 'QDP',              // 👉 Quality Disposal                  📌 부적합품판정(폐기)
  QMS_RETURN: 'QRW',                // 👉 Quality Return Wait               📌 부적합품판정(반출대기)
  QMS_DISASSEMBLE: 'QD',            // 👉 Quality Disassemble               📌 부적합품판정(분해)
  QMS_DISASSEMBLE_INCOME: 'QDI',    // 👉 Quality Disassemble In            📌 부적합품판정(분해입고)
  QMS_DISASSEMBLE_RETURN: 'QDRW',   // 👉 Quality Disassemble Return Wait   📌 부적합품판정(분해반출대기)
  ETC_INCOME: 'EI',                 // 👉 Etc In                            📌 기타입고
  ETC_RELEASE: 'EO',                // 👉 Etc Out                           📌 기타출고
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
    'OUT_INPUT' |
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
