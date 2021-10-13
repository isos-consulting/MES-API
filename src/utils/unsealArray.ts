import checkArray from "./checkArray";

const unsealArray = (arr: any[]): any => {
  const result = checkArray(arr);
  return result.length > 0 ? result[0] : result;
}

export default unsealArray;