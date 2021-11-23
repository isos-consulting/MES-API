import IUser from "../interfaces/aut/user.interface";
import { getAsyncInRedis, setAsyncInRedis } from "./redisClient";
import * as jwt from 'jsonwebtoken';

const secret = process.env.CRYPTO_SECRET as string;

// 📌 access token 발급
const sign = (user: IUser) => {
  const payload = { // access token에 들어갈 payload
    uid: user.uid,
    uuid: user.uuid,
    user_nm: user.user_nm,
    email: user.email
    // role: user.role, 나중에 Role 추가 해야 함 (admin, user, customer[고객사도 등급] 등등 아니면 아예 등급으로)
  };

  // secret으로 sign하여 발급하고 return
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: '30m',
    subject: 'iso-was-access-token',
    issuer: 'isos',
    audience: 'iso-client-user'
  });
}

// 📌 access token 검증
const verify = (token: string) => {
  let decoded: any = null;
  try {
    decoded = jwt.verify(token, secret);
    return {
      ok: true,
      uid: decoded.uid,
      uuid: decoded.uuid,
      user_nm: decoded.user_nm,
      email: decoded.email
      // role: decoded.role,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message,
    };
  }
}

// 📌 refresh token 발급
const refresh = async (uid: number) => {
  // refresh token은 payload 없이 발급
  const token = jwt.sign({}, secret, { 
    algorithm: 'HS256',
    expiresIn: '14d',
    subject: 'iso-was-refresh-token',
    issuer: 'isos',
    audience: 'iso-client-user'
  });

  // redis에 Refresh Token 저장
  await setAsyncInRedis(`token:refresh:${uid}`, token);

  return token;
}

// 📌 refresh token 검증
const refreshVerify = async (token: string, uid: number) => {
  try {
    const data = await getAsyncInRedis(`token:refresh:${uid}`); // refresh token 가져오기
    if (token === data) {
      try {
        jwt.verify(token, secret);
        return true;
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

export { sign, verify, refresh, refreshVerify }