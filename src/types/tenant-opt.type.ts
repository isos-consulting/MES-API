// 📌 Tenant Option(사용자정의옵션)에 대한 자세한 설명은 tenant-opt migration 참고

type TTenantOpt = 
  'ALLOW_MINUS_STOCK'         |   // 📌 마이너스 재고 허용 여부 (허용안함: 0, 허용: 1) 
  'PRD_METHOD_REJECT_QTY'     |   // 📌 부적합수량 집계 처리 방법 (집계 0, 마지막공정수량: 1)
  'PRD_ONGOING_SAVE'          |   // 📌 생산수량 중간저장 사용여부 (미사용: 0, 사용: 1)
  'PRD_ORDER_AUTO_COMPLETE'   |   // 📌 작업지시 자동마감 처리 (사용안함: 0, 지시기준마감: 1, 실적기준마감: 2)
  'OUT_AUTO_PULL'                 // 📌 외주투입 자동 선입선출 (사용안함: 0, 사용: 1)
;

const ALLOW_MINUS_STOCK = { DISABLE: 0, ENABLE: 1 };
const PRD_METHOD_REJECT_QTY = { SUM: 0, LAST_PROC_QTY: 1 };
const PRD_ONGOING_SAVE = { DISABLE: 0, ENABLE: 1 };
const PRD_ORDER_AUTO_COMPLETE = { DISABLE: 0, ORDER_BASE: 1, WORK_BASE: 2 };
const OUT_AUTO_PULL = { DISABLE: 0, ENABLE: 1 };

export default TTenantOpt;
export { 
  ALLOW_MINUS_STOCK,
  PRD_METHOD_REJECT_QTY,
  PRD_ONGOING_SAVE,
  PRD_ORDER_AUTO_COMPLETE,
  OUT_AUTO_PULL
}