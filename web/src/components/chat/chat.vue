<template>
  <div class="chat-box">
    <!-- 聊天框顶部 -->
    <div class="header">
      <h1>聊天界面</h1>
    </div>

    <!-- 聊天框内容 -->
    <div class="chat-content">
      <el-scrollbar>
        <ul class="content">
          <li v-for="item in left" :key="item.id" class="left">
            <div class="head-sculpture"
              :style="{backgroundImage:`url('https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png')`}">
            </div>
            <div class="text">
              {{item.data}}
            </div>
          </li>
          <li class="right">
            <div class="head-sculpture"
              :style="{backgroundImage:`url('https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png')`}">
            </div>
            <div class="text-right">
              不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道
            </div>
          </li>
        </ul>
      </el-scrollbar>
    </div>

    <!-- 聊天框底部 -->
    <div class="chat-bottom">
      <textarea v-model.trim="msg" class="text-area" autofocus="true" placeholder="请输入内容" maxlength="120"
        @keyup.enter="handleSend"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
// import { io, Socket } from "socket.io-client";


const msg = ref("");
const num = ref(1);
const left = reactive([]);
// const userList = ref([])

/**
 * 创建连接
 */
// const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
//   "http://localhost:3030",
//   {
//     reconnection: false,
//     withCredentials: true,
//     extraHeaders: {
//       token: localStorage.getItem("token"),
//     },
//   }
// );

// socket.on("connect", function () {
//   console.log("连接成功");
// });

// socket.on('tabulation',(result)=>{
//   userList.value = result.data
// })




// socket.on("error", function (data) {
//   console.log(data || "error");
// });

// socket.on("connect_failed", function (data) {
//   console.log(data || "connect_failed");
// });
</script>

<style scoped lang="less">
.chat-box {
  width: 550px;
  height: 500px;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid #00000040;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  .header {
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-bottom: #00000040 1px solid;
  }
  .chat-content {
    width: 100%;
    height: 300px;
    border-bottom: 1px solid #00000040;
    .content {
      width: 100%;
      min-height: 300px;
      list-style: none;
      padding: 10px 15px;
      box-sizing: border-box;
      .left {
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        margin-bottom: 10px;
      }
      .right {
        width: 100%;
        display: flex;
        justify-content: end;
        align-items: center;
        margin-bottom: 10px;
      }
      .head-sculpture {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background-position: center;
        background-size: cover;
      }
      .text {
        max-width: 40%;
        min-height: 20px;
        line-height: 20px;
        border: #00000030 1px solid;
        border-radius: 5px;
        position: relative;
        background-color: #ffdead;
        padding: 5px;
        word-wrap: break-word;
        box-sizing: content-box;
        margin-left: 20px;
        &::before {
          content: "";
          position: absolute;
          top: 50%;
          left: -19px;
          transform: translate(0, -50%);
          width: 0;
          height: 0;
          border: transparent 10px solid;
          border-right: #ffdead 10px solid;
          border-radius: 1px;
        }
      }
      .text-right {
        order: -1;
        max-width: 40%;
        min-height: 20px;
        line-height: 20px;
        border: #00000030 1px solid;
        border-radius: 5px;
        position: relative;
        background-color: #ffdead;
        padding: 5px;
        word-wrap: break-word;
        box-sizing: content-box;
        margin-right: 20px;
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          right: -19px;
          transform: translate(0, -50%);
          width: 0;
          height: 0;
          border: transparent 10px solid;
          border-left: #ffdead 10px solid;
          border-radius: 1px;
        }
      }
    }
  }
  .chat-bottom {
    width: 100%;
    height: calc(500px - 360px);
    border-radius: 0px 10px;
    .text-area {
      width: 100%;
      height: calc(500px - 360px);
      outline: none;
      resize: none;
      border: none;
      padding: 10px;
      font-size: 18px;
      box-sizing: border-box;
    }
  }
}
</style>