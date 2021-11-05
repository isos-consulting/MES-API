import express = require('express');
import * as  jwt from 'jsonwebtoken';
import { errorState, successState } from '../states/common.state';
import { refreshVerify, sign, verify } from './jwt-util';
import response from './response_new';

const refreshToken = async (req: express.Request, res: express.Response) => {
  // 📌 access token과 refresh token의 존재 유무를 체크합니다.
  if (req.headers.authorization && req.headers.refresh) {
    // 📌 Authrization이 Bearer 형태가 아닌경우 Error Return
    if (!req.headers.authorization.startsWith("Bearer ")){
      return response(
        res, 
        { raws: [], value: {}, status: 400, message: '잘못된 토큰정보가 입력되었습니다.' },
        { state_tag: 'authentication', type: 'ERROR', state_no: errorState.INVALID_TOKEN }
      );
    }
    
    const authToken = req.headers.authorization.split('Bearer ')[1];
    const refreshToken = req.headers.refresh as string;

    // access token 검증 -> expired여야 함.
    const authResult = verify(authToken);

    // access token 디코딩하여 user의 정보를 가져옵니다.
    const decoded: any = jwt.decode(authToken);
	
    // 디코딩 결과가 없으면 권한이 없음을 응답.
    if (decoded === null) {
      return response(
        res, 
        { raws: [], value: {}, status: 401, message: '토큰정보의 사용자를 찾을 수 없습니다.' },
        { state_tag: 'authentication', type: 'ERROR', state_no: errorState.NOT_FOUND_USER }
      );
    }

    /* access token의 decoding 된 값에서
      유저의 id를 가져와 refresh token을 검증합니다. */
    const refreshResult = await refreshVerify(refreshToken, decoded.uid);

    // 재발급을 위해서는 access token이 만료되어 있어야합니다.
    if (authResult.ok === false && authResult.message === 'jwt expired') {
      // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
      if (refreshResult === false) {
        return response(
          res, 
          { raws: [], value: {}, status: 401, message: 'REFRESH 토큰 정보가 만료되었습니다.' },
          { state_tag: 'authentication', type: 'ERROR', state_no: errorState.EXPIRED_REFRESH_TOKEN }
        );
      } else {
        // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
        const newAccessToken = sign(decoded);

        // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환합니다.
        return response(
          res, 
          { raws: [{ access_token: newAccessToken, refresh_token: refreshToken }], status: 201 },
          { state_tag: 'authentication', type: 'SUCCESS', state_no: successState.PUBLISHED_TOKEN }
        );
      }
    } else {
      // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
      return response(
        res, 
        { raws: [], value: {}, status: 400, message: 'ACCESS 토큰 정보가 만료되지 않았습니다.' },
        { state_tag: 'authentication', type: 'ERROR', state_no: errorState.NOT_EXPIRED_ACCESS_TOKEN }
      );
    }
  } else { 
    // access token 또는 refresh token이 헤더에 없는 경우
    return response(
      res, 
      { raws: [], value: {}, status: 400, message: '토큰 정보가 없습니다.' },
      { state_tag: 'authentication', type: 'ERROR', state_no: errorState.NO_TOKEN }
    );
  }
};

export { refreshToken };