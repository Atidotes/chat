const CryptoJS = require('crypto-js')
const config = require('../env.config')

/** 密钥 */
const KEY = CryptoJS.enc.Utf8.parse(config.APP_ENCRYPTION)

/** 加密 */
const AES_Encrypt = (plaintext) => {
  return CryptoJS.AES.encrypt(plaintext, KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
}

/** 解密 */
const AES_Decrypt = (jsonStr) => {
  return CryptoJS.AES.decrypt(jsonStr, KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8)
}

module.exports = {
  AES_Encrypt,
  AES_Decrypt
}
