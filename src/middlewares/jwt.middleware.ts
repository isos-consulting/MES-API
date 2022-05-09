import * as express from 'express';
import AutUserRepo from '../repositories/aut/user.repository';
import { errorState } from '../states/common.state';
import { verify } from '../utils/jwt-util';
import response from '../utils/response_new';

export default async(req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 로그인 및 사용자 정보 조회,등록,수정 및 Swagger Document의 경우 Token값을 검사하지 않고 API통신 진행
    if(req.path.indexOf('sign-in') !== -1 || req.path.indexOf('favicon') !== -1 || req.path.indexOf('api-docs') !== -1) {
      return next();
    } else {
      req.user = undefined;
      if (!req.headers.authorization) {
        // 📌 Token이 없는 경우 Error Return
        return response(
          res, 
          { raws: [], value: {}, status: 400, message: '토큰 정보가 없습니다.' },
          { state_tag: 'authentication', type: 'ERROR', state_no: errorState.NO_TOKEN }
        );
      } else {
        // 📌 Authrization이 Bearer 형태가 아닌경우 Error Return`
        if (!req.headers.authorization.startsWith("Bearer ")){
          return response(
            res, 
            { raws: [], value: {}, status: 400, message: '잘못된 토큰정보가 입력되었습니다.' },
            { state_tag: 'authentication', type: 'ERROR', state_no: errorState.INVALID_TOKEN }
          );
        }

        const token = req.headers.authorization.substring(7, req.headers.authorization.length);
        const result = verify(token);
        
        if (result.ok) {
          const readUser = await new AutUserRepo(req.tenant.uuid).readAuth(result.uuid) as any;
          let user = readUser;
          // 📌 Token이 유효한데 사용자가 없을 경우 Error Return
          if (!user) {
            return response(
              res, 
              { raws: [], value: {}, status: 401, message: '토큰정보의 사용자를 찾을 수 없습니다.' },
              { state_tag: 'authentication', type: 'ERROR', state_no: errorState.NOT_FOUND_USER }
            );
          }
          // 📌 정상 Token일 경우 Request에 User 정보를 담아 다음 Middleware로 이동
          req.user = { uid: user.uid, uuid: user.uuid, user_nm: user.user_nm, email: user.email };
          return next();
        } else {
          // 📌 Token이 유효하지 않은 경우 (만료된 경우) Error Return
          return response(
            res, 
            { raws: [], value: {}, status: 401, message: 'ACCESS 토큰 정보가 만료되었습니다.' },
            { state_tag: 'authentication', type: 'ERROR', state_no: errorState.EXPIRED_ACCESS_TOKEN }
          );
        }
      }
    }
  } catch (e) {
    return next(e);
  }
}