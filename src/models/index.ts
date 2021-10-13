import { SequelizeOptions, Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
dotenv.config();

const env: string = process.env.NODE_ENV as string
const environment: any = {
  production: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    logging: false
  },
  development: {
    database: process.env.DB_DEV,
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    logging: true
  },
  test: {
    database: process.env.DB_TEST,
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    logging: false
  },
};
const config: SequelizeOptions = environment[env];

const database: string = config.database as string;
const username: string = config.username as string;
const password: string = config.password as string;

const sequelize = new Sequelize(database, username, password, {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
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
  logging: process.env.NODE_ENV === 'test' ? false : console.log,
});

export default sequelize;