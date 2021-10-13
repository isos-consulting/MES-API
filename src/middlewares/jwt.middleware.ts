import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import AutUserRepo from '../repositories/aut/user.repository';
import response from '../utils/response';
import UserWrapper from '../wrappers/aut/user.wrapper';

export default async(req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // 로그인 및 사용자 정보 조회,등록,수정 및 Swagger Document의 경우 Token값을 검사하지 않고 API통신 진행
    if(req.path.indexOf('sign-in') !== -1 || req.path.indexOf('api-docs') !== -1 || req.path.indexOf('swagger') !== -1) {
      next();
    } else {
      req.user = undefined;
      if (!req.headers.authorization) {
        throw next(response(res, [], {}, '토큰 정보가 없습니다.', 404));
      }
      else {
        let uuid: string = "";
        jwt.verify(
          req.headers.authorization,
          process.env.JWT_SECRET as string,
          (err: jwt.VerifyErrors, payload: any) => {
            if (err) {
              throw next(response(res, [], {}, '토큰 정보가 유효하지 않습니다.', 404));
            }
  
            uuid = payload.uuid;
          })
        
        let user = await new AutUserRepo().readAuth(uuid);
        
        if (!user) {
          throw next(response(res, [], {}, '사용자를 찾을 수 없습니다.', 404));
        }

        // id, pwd 삭제
        let result = new UserWrapper(user).toWeb() as any;
  
        // 받아온 유저 정보를 request에 생성
        req.user = result as any;
        
        next();
      }
    }
  } catch (e) {
    next(e);
  }
}