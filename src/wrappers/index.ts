class Wrapper {
  constructor(obj: any) {
    if (obj instanceof Object) {
      if (obj.toJSON) { Object.assign(this, obj.toJSON()) } 
      else { Object.assign(this, obj); }
    } else {
      Object.assign(this, JSON.parse(obj))
    }
  }

  static create(obj: any) {
    if (!obj) {
      return null
    }
    
    return new Wrapper(obj)
  }

  toJSON() {
    return this
  }

  toWeb() {
    return this
  }
}

export default Wrapper