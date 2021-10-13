import moment = require("moment");

const isDateFormatFormat = (date: any) => {
  if (!date) { return false; }

  try { return moment(date).isValid(); }
  catch (error) { return false; }
}

export default isDateFormatFormat;