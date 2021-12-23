import * as express from 'express';
import createHttpError = require('http-errors');
import { logger } from '../configs/winston';
import isNumber from './isNumber';
import response from './response_new';

const createUnknownError = (
  req: express.Request,
  res: express.Response,
  error: createHttpError.HttpError,
) => {
  if (req.path.indexOf('send-gov') !== -1 || req.path.indexOf('sign-in') !== -1 || req.path.indexOf('api-docs') !== -1 || req.path.indexOf('swagger') !== -1 || req.path.indexOf('favicon') !== -1) return;
  if (!error.status) { error = createHttpError(error); }

  // 📌 Error Log File 생성
  const errObj = {
    req: {
      headers: req.headers,
      query: req.query,
      body: req.body,
      route: req.route
    },
    error: {
      message: error.message,
      stack: error.stack,
      status: error.status
    },
    user: req.user ?? 'unknown'
  }
  logger.error(errObj)

  return response(
    res, 
    { status: isNumber(error.status) ? error.status : 500, message: error.message },
    { state_tag: 'unknown', state_no: '9999', type: 'ERROR' }
  );
};

export default createUnknownError;