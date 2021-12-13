import * as redis from 'redis';
import { promisify } from 'util';

let redisClients: any = {};

const setRedisClient = (host: string, port: number, option?: redis.ClientOpts) => {
  const client = redis.createClient(port, host, option) as redis.RedisClient;

  client.on('error', (err: any) => {
    console.error(`redis error: ${err}`);
  });
  
  process.on('exit', () => {
    console.log(`✅ redis quit`);
    client.quit();
  });

  return client;
}

const getRedisClient = (host: string, port: number, option?: redis.ClientOpts) => {
  if (!redisClients[host]) { redisClients[host] = setRedisClient(host, port, option); }

  return redisClients[host] as redis.RedisClient;
}

const quitRedis = async (host: string) => {
  if (!redisClients[host]) { return; }

  await new Promise<void>((resolve) => {
    redisClients[host].quit(() => { resolve(); });
  });
  // redis.quit() creates a thread to close the connection.
  // We wait until all threads have been run once to ensure the connection closes.
  await new Promise(resolve => setImmediate(resolve));
}

const getAsyncInRedis = (host: string, port: number, option?: redis.ClientOpts) => promisify(getRedisClient(host, port, option).get).bind(getRedisClient(host, port, option));
const setAsyncInRedis = (host: string, port: number, option?: redis.ClientOpts) => promisify(getRedisClient(host, port, option).set).bind(getRedisClient(host, port, option));

export { getAsyncInRedis, setAsyncInRedis, quitRedis }