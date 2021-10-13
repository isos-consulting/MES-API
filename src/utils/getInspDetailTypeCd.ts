// add enum of inspection detail type code
const ISNP_DETAIL_TYPE_CD = {
  selfProc: 'SELF_PROC',      // 📌 자주검사
  patrolProc: 'PATROL_PROC',  // 📌 순회검사
  matReceive: 'MAT_RECEIVE',  // 📌 자재수입검사
  outReceive: 'OUT_RECEIVE',  // 📌 외주수입검사
  finalInsp: 'FINAL_INSP',  // 📌 최종검사
};

const getInspDetailTypeCd = ( 
  _type: 
    'selfProc' |
    'patrolProc' |
    'matReceive' |
    'outReceive' |
    'finalInsp' ) => { return ISNP_DETAIL_TYPE_CD[_type]; }

export default getInspDetailTypeCd;