import { SequelizeOptions, Sequelize } from 'sequelize-typescript';
import config from '../configs/config';

const env: string = config.node_env;
const environment: any = {
  production: {
    database: config.db.test.database,
    username: config.db.test.user,
    password: config.db.test.password,
    logging: false
  },
  development: {
    database: config.db.test.database,
    username: config.db.test.user,
    password: config.db.test.password,
    logging: true
  },
  test: {
    database: config.db.test.database,
    username: config.db.test.user,
    password: config.db.test.password,
    logging: false
  },
};
const dbConfig: SequelizeOptions = environment[env];

const database: string = dbConfig.database as string;
const username: string = dbConfig.username as string;
const password: string = dbConfig.password as string;

const sequelize = new Sequelize(database, username, password, {
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
  models: [__dirname + '/**/*.model.js'],
  repositoryMode: true,
  quoteIdentifiers: false,
  logging: env === 'test' ? false : console.log,
});

export default sequelize;