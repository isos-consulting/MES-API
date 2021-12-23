import express from "express";
import { validationResult } from "express-validator";
import response from "./response_new";

const validationCallback = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const error = validation.array({ onlyFirstError: true })[0];
    return response(
      res, 
      { status: error.msg.status, message: error.msg.message }, 
      { state_tag: error.msg.state_tag, type: 'ERROR', state_no: error.msg.state_no }
    );
  }

  return next();
}

export default validationCallback;