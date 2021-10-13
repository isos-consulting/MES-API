import * as crypto from 'crypto-js'

export default (data: string, key: string) => {
  return crypto.AES.decrypt(data, key).toString(crypto.enc.Utf8);
}