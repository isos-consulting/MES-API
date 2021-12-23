import _ from "lodash";

const isBoolean = (bool: any) => {
  if (typeof bool === 'string') { 
    try { bool = JSON.parse(bool.toLowerCase()); } 
    catch (error) { return false; }
  }

  return typeof bool === 'boolean';
}

export default isBoolean;