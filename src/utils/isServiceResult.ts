const isServiceResult = (result: any) => {
  if (result?.result_info && result?.log_info) { return true; }
  return false;
}

export default isServiceResult;