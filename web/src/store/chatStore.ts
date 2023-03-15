import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    flag: false, // 是否打开聊天
    userList: [], // 用户列表
    userInfo: {   // 用户信息
      accountNumber: null,
      userName: '',
    } as IUserInfo,
    chatUser: {
      userName:'',
    } as {},  // 选择聊天的用户
    chatMassage:[] as Array<any>, // 聊天记录
  }),

  actions: {
    /** 获取用户列表信息 */
    getUserList(value:any) {
      this.userList = value
    },
    /** 获取用户信息 */
    getUserInfo(value: any) {
      this.userInfo = value
    },
    /** 获取要聊天的用户信息 */
    changeChat(value: IChangeChat) {
      this.flag = value.flag
      this.chatUser = value.chatUser
    },
    /** 获取聊天记录 */
    changeMessage(value:IChangeInfo){
      this.chatMassage.push(value)
    }
  },

  persist: {
    key: 'chat',
    paths: ['userInfo', 'userList'],
    storage: localStorage,
  },

})
