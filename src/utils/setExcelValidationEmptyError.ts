const setExcelValidationEmptyError = (datas: any[]) => {
  for(const data of datas) {
    data['error'] = [];
  }

  return datas;
}

export { setExcelValidationEmptyError }