import request from "@/util/axios.config";

/** 登录 */
export const toLogin = (data: object):Promise<IResult> => request({ method: 'POST', url: '/login', data })

/** 验证码 */
export const getCaptcha = (): Promise<IResult> => request({ method: 'GET', url: '/captcha' })

/** 注册 */
export const toLogon = (data: object): Promise<IResult> => request({ method: 'POST', url: '/logon', data })
