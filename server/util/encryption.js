const CryptoJS = require('crypto-js')
const config = require('../env.config')

/** 密钥 */
const KEY = CryptoJS.enc.Utf8.parse(config.APP_ENCRYPTION)

/**
 * 加密
 * @param plaintext 参数
 * @returns string
 */
const AES_Encrypt = (plaintext) => {
  if (typeof plaintext === 'string') {
    const data = CryptoJS.enc.Utf8.parse(plaintext);
    const encryptStr = CryptoJS.AES.encrypt(data, KEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    const encryptHexStr = encryptStr.ciphertext.toString().toUpperCase()
    return CryptoJS.enc.Hex.parse(encryptHexStr).toString()
  } else {
    const data = CryptoJS.enc.Utf8.parse(JSON.stringify(plaintext))
    const encryptStr = CryptoJS.AES.encrypt(data, KEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    const encryptHexStr = encryptStr.ciphertext.toString().toUpperCase()
    return CryptoJS.enc.Hex.parse(encryptHexStr).toString()
  }
}

/**
 * 解密
 * @param jsonStr 参数
 * @returns string
 */
const AES_Decrypt = (jsonStr) => {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(jsonStr);
  const data = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJS.AES.decrypt(data, KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  const str = decrypt.toString(CryptoJS.enc.Utf8)
  return str.toString()
}

module.exports = {
  AES_Encrypt,
  AES_Decrypt
}
