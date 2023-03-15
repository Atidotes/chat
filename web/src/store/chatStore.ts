import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    flag: false,
    userList: [],
    userInfo: {
      accountNumber: null,
      userName: '',
    } as IUserInfo,
    chatUser: {
    }
  }),

  actions: {
    getUserList(value: []) {
      this.userList = value
    },
    getUserInfo(value: IUserInfo) {
      this.userInfo = value
    },
    changeChat(value: IChangeChat) {
      this.flag = value.flag
      this.chatUser = value.chatUser
    }
  },

  persist: {
    key: 'chat',
    paths: ['userInfo', 'userList'],
    storage: localStorage,
  },

})
