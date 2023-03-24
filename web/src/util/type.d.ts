/** 返回数据类型 */
declare interface IResult {
  code: number,
  message: string,
  success: Boolean,
  data?: object | Array | string
}

/** 用户信息 */
declare interface IUserInfo {
  accountNumber: number | null,
  userName?: string,
  password?: string,
  password2?: string,
  captcha?: string,
}




declare interface IChangeChat {
  flag: boolean,
  chatUser: object
}

declare interface IChangeInfo {
  data: string,
  type: string
}

declare interface IChat {
  data: string,
  to: Object
}