import config from '../../configs/config';
import AutUser from '../../models/aut/user.model';
<<<<<<< HEAD
import { getAsyncInRedis, setAsyncInRedis } from '../../utils/redisClient';
=======
import redis from 'redis';
import bluebird from 'bluebird';

declare module 'redis' {
  export interface RedisClient extends NodeJS.EventEmitter {
    setAsync(key:string, value:any): Promise<void>;
    getAsync(key:string): Promise<any>;
  }
}
>>>>>>> won

class AutUserCache {
  tenant: string;

  constructor(tenant: string) {
    this.tenant = tenant;
  }

  public create = async(_user: AutUser) => {
    try {
      await setAsyncInRedis(config.cache.elastic.host, Number(config.cache.elastic.port))(`tenants:${this.tenant}:users:id:${_user.id}`, _user.uuid);
      await setAsyncInRedis(config.cache.elastic.host, Number(config.cache.elastic.port))(`tenants:${this.tenant}:users:uuid:${_user.uuid}`, JSON.stringify(_user.toJSON ? _user.toJSON() : _user));
    } catch (err) {
      console.error(`redis create error: ${err}`);
    } 
  };
  
  public read = async(uuid: string) => {
    if (uuid) {
      try {
        return await getAsyncInRedis(config.cache.elastic.host, Number(config.cache.elastic.port))(`tenants:${this.tenant}:users:uuid:${uuid}`);
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
        const uuid = await getAsyncInRedis(config.cache.elastic.host, Number(config.cache.elastic.port))(`tenants:${this.tenant}:users:id:${id}`);
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
      await setAsyncInRedis(config.cache.elastic.host, Number(config.cache.elastic.port))(`tenants:${this.tenant}:users:id:${_user.id}`, JSON.stringify(null));
      await setAsyncInRedis(config.cache.elastic.host, Number(config.cache.elastic.port))(`tenants:${this.tenant}:users:uuid:${_user.uuid}`, JSON.stringify(null));
    } catch (err) {
      console.error(`redis delete error: ${err}`);
    } 
  };
}

export default AutUserCache;