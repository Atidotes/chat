declare interface IUserInfo {
  accountNumber: number | null,
  userName: string,
}

declare interface IChangeChat {
  flag:boolean,
  chatUser: object
}

declare interface IChangeInfo {
  data:string,
  type:string
}

declare interface IResult {
  code:any
}

declare interface IChat {
  data:string,
  to:Object
}