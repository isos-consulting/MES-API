import * as dotenv from 'dotenv';
dotenv.config();

export default {
  node_env: process.env.NODE_ENV as string,
  port: process.env.PORT,
  cache: {
    elastic: {
      host: process.env.NODE_ENV === 'production' ? process.env.CACHE_ELA_HOST as string : 'localhost',
      port: process.env.NODE_ENV === 'production' ? process.env.CACHE_ELA_PORT as string : 6379,
    }
  },
  db: {
    reset_type: process.env.DB_RESET_TYPE as string,
    test: {
      user: process.env.DB_TEST_USER as string,
      password: process.env.DB_TEST_PW as string,
      host: process.env.DB_TEST_HOST as string,
      port: process.env.DB_TEST_PORT as string,
      database: process.env.DB_TEST_DATABASE as string,
      dialect: process.env.DB_TEST_DIALECT as string
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresin: process.env.JWT_EXPIRESIN as string,
  },
  crypto: {
    secret: process.env.CRYPTO_SECRET as string
  }
};