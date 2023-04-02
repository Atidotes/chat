/** 返回数据类型 */
declare interface IResult {
  code: number,
  message: string,
  success: Boolean,
  data?: object | Array | string
}

declare interface IChatStore {
  flag: boolean,
  userList: Array<IUserInfo>
  chatMassage: any
  currentChatUserInfo: IUserInfo
  userInfo: IUserInfo
}

declare interface ISettingStore {
  assembly: Array<IObject>
  menu: Array<IObject>
  postbox: string
  inputPostbox: string
}

/** 用户信息 */
declare interface IUserInfo {
  accountNumber?: number | null | string
  userName?: string
  password?: string
  password2?: string
  captcha?: string
  introduction?: string
  avatar?: string
  file?: Blob | MediaSource | null
  audio?: string
  audioURL?: string
}

declare interface IObject {
  id: number
  title: string
  name: string | any
}

/** 当前聊天用户信息 */
declare interface ISelectChat {
  flag: boolean,
  currentChatUserInfo: IUserInfo
}

/** 聊天记录 */
declare interface IChangeInfo {
  data: string,
  type: string,
  avatar: string | undefined,
}

/** 要向谁发送信息以及发送信息内容 */
declare interface IChat {
  data: string,
  to: Object,
  userChat: IUserInfo
}