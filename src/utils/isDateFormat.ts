import moment = require("moment");
import { TDateType } from "../types/date-type.type";

const isDateFormat = (date: any) => {
  if (!date) { return false; }

  try { return moment(date).isValid(); }
  catch (error) { return false; }
}

export const isDate = (date: any, type: TDateType) => {
  if (!date) { return false; }
  
  try { return moment(date, type, true).isValid(); }
  catch (error) { return false; }
}

export default isDateFormat;