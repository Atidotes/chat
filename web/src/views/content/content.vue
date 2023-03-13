<template>
  <div class="box">
    <div class="content">
      <div class="list">
        <friendsList></friendsList>
      </div>
      <div class="chat">
        <chat></chat>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import chat from "@/components/chat/chat.vue";
import friendsList from "@/components/friendsList/friendsList.vue";

import { io } from "socket.io-client";
import { useChatStore } from "@/store/chatStore";
import { onBeforeUnmount } from "vue";

// 使用状态库
const store = useChatStore();
const { getUserList } = store;

/**
 * 创建连接
 */
const socket = io("http://localhost:3030", {
  // reconnection: false,
  withCredentials: true,
  extraHeaders: {
    token: localStorage.getItem("token") as string,
  },
});

socket.on("connect", () => {
  console.log("连接成功");
  socket.on("error", (res) => {
    console.log(res);
  });
});

socket.on("tabulation", (result: any) => {
  // 去除自己用户信息
  const userListInfo = result.data;
  const userInfo = store.userInfo;
  const arr = userListInfo.filter((item: IUserInfo) => {
    if (item !== null) {
      return item?.accountNumber !== userInfo?.accountNumber;
    }
  });
  getUserList([...arr]);
  console.log('获取好友列表',[...arr])
});

/**
 * 页面离开断开连接
 */
onBeforeUnmount(()=>{
  socket.disconnect()
})
</script>

<style scoped lang="less">
.box {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #393939;
  box-sizing: border-box;
  .content {
    width: 800px;
    height: 500px;
    background-color: #fdf5e6;
    border-radius: 10px;
    box-shadow: #ffffff6b 40px 30px 30px;
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 20px;
  }
}
</style>