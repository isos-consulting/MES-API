import * as redis from 'redis';

console.log("refresh-all-cache");

console.log(`
    --------------------------------------
    +++++++ Refresh ALL Cache Start+++++++
    --------------------------------------
`);

const refreshAllCache = () => {
  const client = redis.createClient();
  client.FLUSHDB();
  client.quit();
}
refreshAllCache();