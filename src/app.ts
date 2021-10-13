import * as dotenv from 'dotenv';
import * as createError from 'http-errors';
import * as express from 'express';
import * as logger from 'morgan';
import * as rfs from 'rotating-file-stream';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import jwtMiddleware from './middlewares/jwt.middleware';
import routers from './routes';
import response from './utils/response';

// Import Environment
dotenv.config();
process.traceDeprecation = true;

declare global {
  // add user information in express request
  namespace Express {
    interface Request {
      user: {
        uid: number,
        id: string,
        pwd: string,
      } | undefined
    }
  }
};
const app: express.Application = express();

// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
});

app.use('/health-check', (req: express.Request, res: express.Response, next: express.NextFunction) => { return response(res, [], {}, '', 200); });

// Create Log (IP, User, Date, Method, Uri, Status, Response Length, Referrer, Agent, ResponseTime, TotalTime)
app.use(logger(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":response-time" ":total-time"', { stream: accessLogStream }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());
app.use(jwtMiddleware);

// Cross Origin Resource Sharping 의 약자
// 서로 다른 도메인 또는 포트에서 자원을 요청 할 때 보안목적으로 차단 되는 경우
// const corsOptions = {
//   origin: 'http://localhost:3000', // 허락하고자 하는 요청 주소
//   credentitals: true // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
// }
// app.use(cors(corsOptions));
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
  res.locals.error = process.env.NODE_ENV === 'development' || 'test' ? apiError : {};

  // render the error page
  return response(res, [], {}, apiError.message, apiError.status);
});

export default app;