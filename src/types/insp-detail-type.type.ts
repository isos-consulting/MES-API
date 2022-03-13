type TInspDetailType = 
  'MAT_RECEIVE' |                   // 📌 자재수입검사
  'OUT_RECEIVE' |                   // 📌 자재수입검사
  'SELF_PROC'    |                  // 📌 자주검사
  'PATROL_PROC'    |                // 📌 순회검사
  'FINAL_INSP'                      // 📌 최종검사
;

export default TInspDetailType;
