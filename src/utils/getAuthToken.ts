import * as request from 'supertest'
import app from '../app'
import encrypt from './encrypt';

const getAuthToken = async (_id: string, _pwd: string) => {
  let response = await request(app)
    .post('/aut/user/sign-in')
    .accept('Accept')
    .type('application/json')
    .send({ id: _id, pwd: encrypt(_pwd, process.env.CRYPTO_SECRET as string) })

  return response.body.datas.raws[0].token;
}

export default getAuthToken;