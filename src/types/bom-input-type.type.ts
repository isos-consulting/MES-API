type TBomInputType = 
  'PUSH'          |   // 📌 수동입력
  'PULL'              // 📌 선입선출
;

const BOM_INPUT_TYPE = { PUSH: 1, PULL: 2 };

export default TBomInputType;
export { BOM_INPUT_TYPE };