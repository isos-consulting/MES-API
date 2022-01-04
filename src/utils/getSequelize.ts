import { Sequelize } from "sequelize-typescript";
import config from "../configs/config";

let sequelizes: any = {};

const getSequelize = (tenant: string) => {
  // 📌 Test 환경에서는 Auth Server를 거치지 않고 Environment의 Connection 정보 사용
  if (config.node_env === 'test') {
    if (!sequelizes['test']) { 
      sequelizes['test'] = new Sequelize(
        config.db.test.database, 
        config.db.test.user, 
        config.db.test.password, 
        {
          host: config.db.test.host,
          port: Number(config.db.test.port),
          dialect: 'postgres',
          dialectOptions: { 
            useUTC: false, // for reading the data
            dateStrings: true,
            typeCast: true,
            timezone: '+09:00'
          },
          timezone: '+09:00', // for writing the data
          models: [__dirname + '/../models/**/*.model.js'],
          repositoryMode: true,
          quoteIdentifiers: false,
          logging: console.log
        }
      );
    }
    return sequelizes['test'] as Sequelize;
  }
  return sequelizes[tenant] as Sequelize;
}

export { sequelizes, getSequelize }