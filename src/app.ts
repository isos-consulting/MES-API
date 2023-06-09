import dotenv from 'dotenv';
import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwtMiddleware from './middlewares/jwt.middleware';
import routers from './routes';
import response from './utils/response_new';
import morgan = require('morgan');
import { stream } from './configs/winston';
import { refreshToken } from './utils/refreshToken';
import tenantMiddleware from './middlewares/tenant.middleware';
import config from './configs/config';
import isNumber from './utils/isNumber';

// Import Environment
dotenv.config();
process.traceDeprecation = true;

declare global {
  // add user information in express request
  namespace Express {
    interface Request {
      tenant: {
        uuid: string
      },
      user: {
        uuid: string,
        uid: number,
        user_nm: string,
        email: string
      } | undefined,
      file_promise: any
    }
  }
};
const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Cross Origin Resource Sharping 의 약자
// 서로 다른 도메인 또는 포트에서 자원을 요청 할 때 보안목적으로 차단 되는 경우
// const corsOptions = {
//   origin: 'http://localhost:3000', // 허락하고자 하는 요청 주소
//   credentitals: true // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
// }
// app.use(cors(corsOptions));
app.use(cors());
app.use('/health-check', async (req: express.Request, res: express.Response, next: express.NextFunction) => { 
  return response(
    res, 
    { status: 200, message: { admin_message: 'HealthCheck', user_message: 'HealthCheck' }},
    { state_tag: 'healthCheck', state_no: '0000', type: 'SUCCESS' }
  );
});

// Create Log (IP, User, Date, Method, Uri, Status, Response Length, Referrer, Agent, ResponseTime, TotalTime)
app.use(morgan('combined', { stream }));
app.use(morgan('dev'));

app.use(tenantMiddleware);
app.use('/refresh-token', refreshToken);
app.use(jwtMiddleware);
app.use('/', routers);

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: createError.HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  let apiError = err;

  if (!err.status) {
    apiError = createError(err);
  }

  // set locals, only providing error in development
  res.locals.message = apiError.message;
  res.locals.error = config.node_env === 'development' || 'test' ? apiError : {};

  // render the error page
  return response(
    res, 
    { status: isNumber(apiError.status) ? apiError.status : 500, message: { admin_message: apiError.message, user_message: '[오류발생] 관리자에게 문의하세요.'} },
    { state_tag: 'unknown', state_no: '9999', type: 'ERROR' }
  );
});

export default app;