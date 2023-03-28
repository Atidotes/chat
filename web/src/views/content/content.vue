<template>
  <div class="box">
    <div class="content">
      <div class="sidebar">
        <sidebar></sidebar>
      </div>
      <div class="list">
        <friendsList></friendsList>
      </div>
      <div class="chat">
        <chat @chat="chats"></chat>
      </div>
    </div>
  </div>

  <!-- 音效 -->
  <audio ref="audioRef" hidden>
    <source src="@/assets/01.mp3" type="audio/mpeg">
  </audio>
</template>

<script lang="ts" setup>
import chat from "@/components/chat/chat.vue";
import friendsList from "@/components/friendsList/friendsList.vue";
import sidebar from "@/components/sidebar/sidebar.vue";
import { io } from "socket.io-client";
import { useChatStore } from "@/store/chatStore";
import { onBeforeUnmount, ref } from "vue";

// 使用状态库
const store = useChatStore();
const { setUpUserList, changeMessage } = store;

const audioRef = ref();

/**
 * 创建连接
 */
const socket = io(import.meta.env.APP_CHAT_BASE, {
  withCredentials: true,
  extraHeaders: {
    token: localStorage.getItem("token") as string,
  },
});

socket.on("connect", () => {
  socket.on("tabulation", (result: any) => {
    // 去除自己用户信息
    const userListInfo = result.data;
    const userInfo = store.userInfo;
    const arr = userListInfo.filter((item: IUserInfo) => {
      if (item !== null) {
        return item.accountNumber !== userInfo.accountNumber;
      }
    });
    setUpUserList([...arr]);
  });

  socket.on("private-Chat", (res) => {
    changeMessage({
      avatar: res.userChat.avatar,
      data: res.data,
      type: "left",
    });
    audioRef.value.play();
  });
});

/**
 * 发送消息
 */
const chats = (target: IChat) => {
  socket.emit("private-Chat", target);
};

/**
 * 页面离开断开连接
 */
onBeforeUnmount(() => {
  socket.disconnect();
});
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
    width: 850px;
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