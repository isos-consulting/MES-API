import express = require('express');
import createError from 'http-errors';
import response from './response';

export default (err: createError.HttpError, res: express.Response) => {
  let apiError = err;
  if (!err.status) { apiError = createError(err); }

  // render the error page
  return response(res, [], {}, apiError.message, apiError.status);
}