import request from "@/util/axios.config";

/** 绑定邮箱 */
export const bindMailbox = (data: Object): Promise<IResult> => request({ url: '/setup/postbox', method: 'POST', data })

/** 获取验证码 */
export const mailboxCaptcha = (data: Object): Promise<IResult> => request({ url: '/setup/captcha', method: 'POST', data })
