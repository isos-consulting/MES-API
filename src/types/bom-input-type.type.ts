type TBomInputType = 
  'PUSH'          |   // 📌 수동입력
  'PULL'              // 📌 선입선출
;

const BOM_INPUT_TYPE = { PUSH: 0, PULL: 1 };

export default TBomInputType;
export { BOM_INPUT_TYPE };