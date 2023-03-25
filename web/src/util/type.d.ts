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

/** 获取要聊天的用户信息 */
declare interface IChangeChat {
  flag: boolean,
  chatUser: object
}

/** 聊天记录 */
declare interface IChangeInfo {
  data: string,
  type: string
}

/** 要向谁发送信息以及发送信息内容 */
declare interface IChat {
  data: string,
  to: Object
}