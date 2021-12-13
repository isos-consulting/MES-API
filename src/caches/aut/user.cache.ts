import AutUser from '../../models/aut/user.model';
import { getAsyncInRedis, setAsyncInRedis } from '../../utils/redisClient';

class AutUserCache {
  tenant: string;

  constructor(tenant: string) {
    this.tenant = tenant;
  }

  public create = async(_user: AutUser) => {
    try {
      await setAsyncInRedis('localhost', 6379)(`tenants:${this.tenant}:users:id:${_user.id}`, _user.uuid);
      await setAsyncInRedis('localhost', 6379)(`tenants:${this.tenant}:users:uuid:${_user.uuid}`, JSON.stringify(_user.toJSON ? _user.toJSON() : _user));
    } catch (err) {
      console.error(`redis create error: ${err}`);
    } 
  };
  
  public read = async(uuid: string) => {
    if (uuid) {
      try {
        return await getAsyncInRedis('localhost', 6379)(`tenants:${this.tenant}:users:uuid:${uuid}`);
      } catch (err) {
        console.error(`redis read error: ${err}`);
        return null;
      }
    }

    return null;
  };

  public readById = async(id: string) => {
    if (id) {
      try {
        const uuid = await getAsyncInRedis('localhost', 6379)(`tenants:${this.tenant}:users:id:${id}`);
        return this.read(uuid);
      } catch (err) {
        console.error(`redis readById error: ${err}`);
        return null;
      }
    }

    return null;
  };

  public delete = async(_user: AutUser) => {
    try {
      await setAsyncInRedis('localhost', 6379)(`tenants:${this.tenant}:users:id:${_user.id}`, JSON.stringify(null));
      await setAsyncInRedis('localhost', 6379)(`tenants:${this.tenant}:users:uuid:${_user.uuid}`, JSON.stringify(null));
    } catch (err) {
      console.error(`redis delete error: ${err}`);
    } 
  };
}

export default AutUserCache;