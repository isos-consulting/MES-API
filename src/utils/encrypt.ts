import * as crypto from 'crypto-js'

export default (data: string, key: string) => {
  return crypto.AES.encrypt(data, key).toString();
}