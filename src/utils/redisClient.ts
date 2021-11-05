import * as redis from 'redis';
import { promisify } from 'util';

const redisClient = redis.createClient();
const getAsyncInRedis = promisify(redisClient.get).bind(redisClient);
const setAsyncInRedis = promisify(redisClient.set).bind(redisClient);

redisClient.on('error', (err) => {
  console.error(`redis error: ${err}`);
});

process.on('exit', () => {
  console.log(`✅ redis quit`);
  redisClient.quit();
});

export { redisClient, getAsyncInRedis, setAsyncInRedis }