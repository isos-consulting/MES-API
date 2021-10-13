const convertToDataValues = (raw: any[]) => {
  if (!raw[1][0]) { return null; }
  
  return raw[1][0]?.dataValues;
}

export default convertToDataValues;