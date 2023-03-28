import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: (): IStort => {
    return {
      flag: false, // 是否打开聊天
      userList: [], // 用户列表
      chatMassage: [], // 聊天记录
      currentChatUserInfo: { // 当前聊天用户信息
        accountNumber: null,
        userName: '',
        avatar: '',
      },
      userInfo: {   // 当前用户信息
        accountNumber: null,
        userName: '',
        avatar: '',
        introduction: '',
      },
    }
  },

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
    /** 获取用户列表头像 */
    getUserList: (state: IStort): Array<IUserInfo> => {
      return state.userList.map((item: IUserInfo) => {
        const avatar: string = item.avatar as string
        if (avatar && !avatar.includes("undefined")) {
          return item;
        } else {
          item.avatar = "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          return item;
        }
      })
    },

    /** 获取当前用户昵称 */
    getUserInfo: (state: IStort): IUserInfo => {
      const avatar: string = state.userInfo.avatar as string
      state.userInfo.introduction = state.userInfo.introduction ? state.userInfo.introduction : '暂无简介'
      if (avatar && !avatar.includes("undefined")) {
        return state.userInfo;
      } else {
        state.userInfo.avatar = "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
        return state.userInfo;
      }
    },

    getCurrentChatUserInfo: (state: IStort): IUserInfo => {
      const avatar: string = state.currentChatUserInfo.avatar as string
      if (avatar && !avatar.includes("undefined")) {
        return state.currentChatUserInfo;
      } else {
        state.currentChatUserInfo.avatar = "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
        return state.currentChatUserInfo;
      }
    }
  },

  persist: {
    key: 'chat',
    paths: ['userInfo', 'userList', 'chatMassage'],
    storage: sessionStorage,
  },
})
