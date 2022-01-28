type TTranType = 
  'MAT_INCOME' |                 // 📌 자재입고                  
  'MAT_RETURN' |                 // 📌 자재반출
  'MAT_RELEASE' |                // 📌 자재출고

  'PRD_RETURN' |                 // 📌 자재반납
  'PRD_OUTPUT' |                 // 📌 생산입고
  'PRD_INPUT' |                  // 📌 생산투입
  'PRD_REJECT' |                 // 📌 생산부적합

  'SAL_INCOME' |                 // 📌 제품입고
  'SAL_RELEASE' |                // 📌 제품출고
  'SAL_OUTGO' |                  // 📌 제품출하
  'SAL_RETURN' |                 // 📌 제품반입

  'OUT_INCOME' |                 // 📌 사급입고
  'OUT_INPUT' |                  // 📌 사급투입
  'OUT_RELEASE' |                // 📌 사급출고

  'INVENTORY' |                  // 📌 재고실사
  'INV_MOVE' |                   // 📌 재고이동
  'INV_REJECT' |                 // 📌 재고부적합

  'QMS_RECEIVE_INSP_REJECT' |    // 📌 수입검사부적합
  'QMS_FINAL_INSP_INCOME' |      // 📌 최종검사입고
  'QMS_FINAL_INSP_REJECT' |      // 📌 최종검사부적합
  'QMS_REWORK' |                 // 📌 부적합품판정(재작업)
  'QMS_DISPOSAL' |               // 📌 부적합품판정(폐기)
  'QMS_RETURN' |                 // 📌 부적합품판정(반출대기)
  'QMS_DISASSEMBLE' |            // 📌 부적합품판정(분해)
  'QMS_DISASSEMBLE_INCOME' |     // 📌 부적합품판정(분해입고)
  'QMS_DISASSEMBLE_RETURN' |     // 📌 부적합품판정(분해반출대기)

  'ETC_INCOME' |                 // 📌 기타입고
  'ETC_RELEASE'                  // 📌 기타출고
;


export default TTranType;