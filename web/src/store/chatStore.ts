import { defineStore } from 'pinia'
import { AES_Decrypt } from '../util/encryption'
import { getCurrentInstance } from 'vue'

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
      avatar: '',
      introduction: '',
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
      /** 组件实例 */
      const { proxy } = getCurrentInstance() as any;

      return state.userList.length !== 0 ? state.userList.map(item => {
        item.userName = proxy.$AES_Decrypt(item.userName as string)
        return {
          userName: item.userName,
          accountNumber: item.accountNumber
        }
      }) : state.userList
    },

    /** 解密当前用户昵称 */
    getUserInfo: (state) => {
      const avatar: string = state.userInfo.avatar as string
      state.userInfo.introduction = state.userInfo.introduction ? state.userInfo.introduction : '暂无简介'
      if (avatar && !avatar.includes("undefined")) {
        return state.userInfo;
      } else {
        state.userInfo.avatar = "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
        return state.userInfo;
      }
    }
  },

  persist: {
    key: 'chat',
    paths: ['userInfo', 'userList',],
    storage: sessionStorage,
  },
})
