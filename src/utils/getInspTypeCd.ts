// add enum of inspection type code
const ISNP_TYPE_CD = {
  RECEIVE_INSP: 'RECEIVE_INSP',    // 📌 수입검사
  PROC_INSP: 'PROC_INSP',          // 📌 공정검사
  FINAL_INSP: 'FINAL_INSP',        // 📌 최종검사
};

const getInspTypeCd = ( 
  _type: 
    'RECEIVE_INSP' |
    'PROC_INSP' |
    'FINAL_INSP' ) => { return ISNP_TYPE_CD[_type]; }

export default getInspTypeCd;