import * as express from 'express';
import { Sequelize } from 'sequelize-typescript';
import { sequelizes } from '../utils/getSequelize';
import { getAsyncInRedis, setAsyncInRedis } from '../utils/redisClient';

// 데이터베이스 기본 셋팅(공통)
const baseDbSetting = {
  timezone: '+09:00',
  dialectOptions: {
    useUTC: false, // for reading the data
    dateStrings: true,
    typeCast: true,
    timezone: '+09:00',
    options: {
      requestTimeout: 300000,
      encrypt: false
    }
  },
  pool: { max: 100, min: 0, idle: 10000 },
  define: { charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci', timestamps: true },
  models: [__dirname + '/../models/**/*.model.js'],
  quoteIdentifiers: false,
  repositoryMode: true,
  logging: process.env.NODE_ENV === 'test' ? false : console.log
}

export default async(req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // Swagger Document의 경우 Tenant를 격리하지 않고 API통신 진행
    if(req.path.indexOf('api-docs') !== -1 || req.path.indexOf('swagger') !== -1 || req.path.indexOf('favicon') !== -1) {
      return next();
    } else {
      // Header의 restrict-access-to-tenants속성에서 tenant_uuid Get
      // sequelize[tenant_uuid] 유무 확인
      // -> 있을 경우
      //    1. Cache에서 마지막 Update Date Get
      //      -> 있을 경우
      //         1. Header의 Update Date 데이터와 비교
      //            -> 다를 경우
      //               1. Connection 다시 만듬
      //               2. Cache에 Update Date 다시 삽입
      //      -> 없을 경우
      //         1. Connection 생성
      //         2. Cache에 Update Date 삽입
      // -> 없을 경우
      //    1. Connection 생성
      //    2. Cache에 Update Date 삽입
      
      const tenantUuid = req.headers['restrict-access-to-tenants'] as string;
      const connectionConfig = JSON.parse(req.headers['connection-config'] as string ?? '{}');
      const connectionUpdatedAt = req.headers['connection-updated-at'] as string;

      req.tenant = { uuid: tenantUuid };

      if (sequelizes[tenantUuid]) {
        // 📌 Tenant의 Sequelize 객체가 이미 존재하는 경우
        const existingUpdatedAt = await getAsyncInRedis(`tenant:${tenantUuid}:updatedAt`);
        console.log(existingUpdatedAt)
        console.log(connectionUpdatedAt)
        // 📌 Connection 정보가 Update 되지 않은 경우는 넘어감
        if (connectionUpdatedAt === existingUpdatedAt) { return next(); }
      } 

      // 📌 Tenant의 Sequelize 객체가 없는 경우
      // 📌 Connection 정보가 Update 된 경우
      sequelizes[tenantUuid] = new Sequelize({
        dialect: connectionConfig.dialect,
        username: connectionConfig.username,
        password: connectionConfig.password,
        host: connectionConfig.host,
        port: connectionConfig.port,
        database: connectionConfig.database,
        ...baseDbSetting
      });

      console.log('다시만듬')
      await setAsyncInRedis(`tenant:${tenantUuid}:updatedAt`, connectionUpdatedAt);
      return next();
    }
  } catch (e) {
    return next(e);
  }
}