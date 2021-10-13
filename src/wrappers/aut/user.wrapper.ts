import Wrapper from '../'

class UserWrapper extends Wrapper {
  toWeb() {
    const values = Object.assign({}, this) as any;

    delete values.id;
    delete values.pwd;

    return values;
  }
}

export default UserWrapper;