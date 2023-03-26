import { defineStore } from 'pinia'
import { AES_Encrypt, AES_Decrypt } from '@/util/encryption'

export const useChatStore = defineStore('chat', {
  state: () => ({
    flag: false, // 是否打开聊天
    userList: [] as Array<IUserInfo>, // 用户列表
    chatMassage: [] as Array<any>, // 聊天记录
    currentChatUserInfo: { // 当前聊天用户信息
      accountNumber: null,
      userName: '',
    } as IUserInfo,
    userInfo: {   // 当前用户信息
      accountNumber: null,
      userName: '',
    } as IUserInfo,
  }),

  actions: {
    /** 获取用户列表信息 */
    setUpUserList(value: Array<any>) {
      this.userList = value
    },

    /** 获取要聊天的用户信息 */
    selectChat(target: ISelectChat) {
      this.flag = target.flag
      this.currentChatUserInfo = target.currentChatUserInfo
    },

    /** 获取用户信息 */
    setUpUserInfo(data: IUserInfo) {
      this.userInfo = data
    },

    /** 获取聊天记录 */
    changeMessage(value: IChangeInfo) {
      this.chatMassage.push(value)
    }
  },

  getters: {
    /** 解密用户列表用户昵称 */
    getUserList: (state) => {
      return state.userList.length !== 0 ? state.userList.map(item => {
        if (typeof item.userName === 'string') {
          item.userName = AES_Decrypt(item.userName)
        }
        return {
          userName: item.userName,
          accountNumber: item.accountNumber
        }
      }) : state.userList
    },

    /** 解密当前用户昵称 */
    getUserInfo: (state) => {
      if (typeof state.userInfo.userName === 'string') {
        return AES_Decrypt(state.userInfo.userName)
      }
    }
  },

  persist: {
    key: 'chat',
    paths: ['userInfo', 'userList',],
    storage: localStorage,
  },

})
