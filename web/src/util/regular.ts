/**
 * 手机号
 */
export const mobilePhone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/

/**
 * 密码  密码必须包含字母、数字、特殊符号（#?!@$%^&*-.）3种类型的8位-16位的组合
 */
export const pass = /^(?=.*[A-z])(?=.*[0-9])(?=.*[#?!@$%^&*-.]).{8,16}$/

/**
 * 网络地址验证规则
 */
export const networkReg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/

/**
 * QQ邮箱验证规则
 */
export const mailbox = /^[1-9]\d{4,10}@qq\.com$/
