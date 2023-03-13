import { io } from "socket.io-client";
import { useChatStore } from '@/store/chatStore'

/**
 * 创建连接
 */
const socket = io(
  "http://localhost:3030",
  {
    // reconnection: false,
    withCredentials: true,
    extraHeaders: {
      token: localStorage.getItem("token") as string,
    },
  }
);

socket.on("connect", () => {
  console.log('连接成功')
  socket.on('error', (res) => {
    console.log(res)
  })
  socket.on('tabulation', (result: any) => {
    // 使用状态库
    const store = useChatStore()
    const { getUserList } = store

    // 去除自己用户信息
    const userListInfo = result.data
    const userInfo = store.userInfo
    const arr = userListInfo.filter((item: IUserInfo) => {
      if(item !== null){
        return  item?.accountNumber !== userInfo?.accountNumber
      }
    })
    getUserList(arr)

    console.log('获取好友列表',arr)
  })
});
