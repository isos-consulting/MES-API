import AutUser from '../../models/aut/user.model';
import redis from 'redis';
import bluebird from 'bluebird';

declare module 'redis' {
  export interface RedisClient extends NodeJS.EventEmitter {
    setAsync(key:string, value:any): Promise<void>;
    getAsync(key:string): Promise<any>;
  }
}

class AutUserCache {
  client: redis.RedisClient;

  constructor() {
    this.client = redis.createClient();

    bluebird.promisifyAll(this.client);

    // this.client.on('connect', () => {
    //   bluebird.promisifyAll(this.client);
    // });
    this.client.on('error', (err) => {
      console.error(`redis error: ${err}`);
    });

    process.on('exit', () => {
      console.log(`✅ redis quit`);
      this.client.quit();
    });
  }

  public create = async(_user: AutUser, tenant: string) => {
    try {
      await this.client.setAsync(`tenants:${tenant}:users:id:${_user.id}`, _user.uuid);
      await this.client.setAsync(`tenants:${tenant}:users:uuid:${_user.uuid}`, JSON.stringify(_user.toJSON()));
    } catch (err) {
      console.error(`redis create error: ${err}`);
    } 
  };
  
  public read = async(uuid: string, tenant: string) => {
    if (uuid) {
      try {
        return await this.client.getAsync(`tenants:${tenant}:users:uuid:${uuid}`);
      } catch (err) {
        console.error(`redis read error: ${err}`);
        return null;
      }
    }

    return null;
  };

  public readById = async(id: string, tenant: string) => {
    if (id) {
      try {
        const uuid = await this.client.getAsync(`tenants:${tenant}:users:id:${id}`);
        return this.read(uuid, tenant);
      } catch (err) {
        console.error(`redis readById error: ${err}`);
        return null;
      }
    }

    return null;
  };
}

export default AutUserCache;