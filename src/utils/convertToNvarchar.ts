'use strict'

const convertToNvarchar = (data: any) => {
  return "'" + data + "'";
}

export default convertToNvarchar;