const convertToPreviousValues = (raw: any[]) => {
  if (!raw[1][0]) { return null; }
  
  return raw[1][0]?._previousDataValues;
}

export default convertToPreviousValues;