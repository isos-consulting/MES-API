import moment = require("moment");

const isDateFormat = (date: any) => {
  if (!date) { return false; }

  try { return moment(date).isValid(); }
  catch (error) { return false; }
}

export default isDateFormat;