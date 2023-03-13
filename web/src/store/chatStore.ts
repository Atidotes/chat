import { defineStore } from 'pinia'

export  const useChatStore = defineStore('chat', {
  state: () => ({
    userList: [],
    userInfo: {
      accountNumber: null,
      userName: '',
    } as IUserInfo
  }),

  actions: {
    getUserList(value: []) {
      this.userList = value
    },
    getUserInfo(value: IUserInfo) {
      this.userInfo = value
    }
  },

  persist: {
    key: 'chat',
    paths: ['userInfo','userList'],
    storage: localStorage,
  },

})
