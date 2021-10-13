const checkArray = (obj: object) => {
  if (!Array.isArray(obj)) {
    return [ obj ];
  } else {
    return obj;
  }
}

export default checkArray;