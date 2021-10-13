const getSubtractTwoDates = (_startDate: string | Date, _endDate: string | Date) => {
  try {
    if (typeof _startDate == 'string') { _startDate = new Date(_startDate); }
    if (typeof _endDate == 'string') { _endDate = new Date(_endDate); }

    const diff = _endDate.getTime() - _startDate.getTime();
    const result = diff / 1000 / 60; // Convert Milliseconds To Minute

    return Math.floor(result);
  } catch(e) { 
    throw new Error('Date Subtraction간에 에러가 발생하였습니다.'); 
  }
}

export default getSubtractTwoDates;