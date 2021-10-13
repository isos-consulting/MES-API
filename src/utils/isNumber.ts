const isNumber = (num: number | string, contain: 'all' | 'commaAndDecimal' | 'decimal' | 'onlyNumber' = 'all') => {
  // 좌우 trim(공백제거)을 해준다.
  num = String(num).replace(/^\s+|\s+$/g, "");

  switch (contain) {
    case 'all':
      // 모든 10진수 (부호 선택, 자릿수구분기호 선택, 소수점 선택)
      var regex = /^[+\-]?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
      break;
    case 'all':
      // 부호 미사용, 자릿수구분기호 선택, 소수점 선택
      var regex = /^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
      break;
    case 'all':
      // 부호 미사용, 자릿수구분기호 미사용, 소수점 선택
      var regex = /^[0-9]+(\.[0-9]+)?$/g;
      break;
    default:
      // only 숫자만(부호 미사용, 자릿수구분기호 미사용, 소수점 미사용)
      var regex = /^[0-9]$/g;
      break;
  }

  if( regex.test(num) ){
    num = num.replace(/,/g, "");
    return isNaN(Number(num)) ? false : true;
  } else { return false; }
}

export default isNumber;