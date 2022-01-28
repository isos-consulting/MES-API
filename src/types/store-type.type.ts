type TStoreType = 
  'AVAILABLE'     |   // 📌 가용창고
  'RETURN'        |   // 📌 반출창고
  'REJECT'        |   // 📌 부적합창고                  
  'FINAL_INSP'    |   // 📌 최종검사창고
  'OUTGO'         |   // 📌 출하대기창고
  'OUTSOURCING'       // 📌 외주창고
;

export default TStoreType;