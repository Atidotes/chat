/** 返回数据类型 */
declare interface IResult {
  code: number,
  message: string,
  success: Boolean,
  data?: object | Array | string
}

/** 用户信息 */
declare interface IUserInfo {
  accountNumber?: number | null | string,
  userName?: string,
  password?: string,
  password2?: string,
  captcha?: string,
  introduction?: string,
  avatar?: string,
  file?: Blob | MediaSource | null,
}

/** 当前聊天用户信息 */
declare interface ISelectChat {
  flag: boolean,
  currentChatUserInfo: IUserInfo
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