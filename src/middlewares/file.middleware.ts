import axios from 'axios';
import * as express from 'express';

export default async(req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    req.file_promise = () => {
      return axios({
        url: 'http://localhost:3000',
        method: 'get'
      })
    }
    // req.file_promise = axios({
    //   url: 'localhost:3000',
    //   method: 'get'
    // });
    next();
  } catch (e) {
    return next(e);
  }
}