import CryptoJS from 'crypto-js'

/** 密钥 */
const KEY = CryptoJS.enc.Utf8.parse(import.meta.env.APP_ENCRYPTION)

/** 加密 */
export const AES_Encrypt = (plaintext: string): string => {
  return CryptoJS.AES.encrypt(plaintext, KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
}

/** 解密 */
export const AES_Decrypt = (jsonStr: string): string => {
  return CryptoJS.AES.decrypt(jsonStr, KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8)
}
