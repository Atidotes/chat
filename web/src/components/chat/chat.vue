<template>
  <div class="chat-box" v-if="flag">
    <!-- 聊天框顶部 -->
    <div class="header">
      <h1>{{chatUser.userName}}聊天界面</h1>
    </div>

    <!-- 聊天框内容 -->
    <div class="chat-content">
      <el-scrollbar ref="scrollbarRef" always>
        <ul ref="innerRef" class="content">
          <li v-for="(item,index) in chatMassage" :key="index" :class="item.type === 'left' ? 'left' : 'right'">
            <div class="head-sculpture"
              :style="{backgroundImage:`url('https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png')`}">
            </div>
            <div :class="item.type === 'left'? 'text' : 'text-right'">
              {{item.data}}
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

  <div class="chat-box" v-else>
    <h2 class="title">
      欢迎{{userName}}回来！
    </h2>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, defineEmits, watch, nextTick } from "vue";
import { useChatStore } from "@/store/chatStore";

const store = useChatStore();
const { changeMessage } = store;
const emit = defineEmits(["chat"]);

/**
 * 定义页面数据
 */
const msg = ref("");
const scrollbarRef = ref();
const innerRef = ref();

/**
 * 获取状态库数据
 */
const flag = computed(() => store.flag);
const chatUser = computed(() => store.chatUser);
const userName = computed(() => store.userInfo.userName);
const chatMassage = computed(() => store.chatMassage);

/**
 * 检测数据变化
 */
watch(chatMassage.value,()=>{
   scrollbarBottom()
})

/**
 * 检测滚动条始终保持在底部
 */
const scrollbarBottom = () => {
  nextTick(()=>{
      scrollbarRef.value.setScrollTop(innerRef.value.clientHeight);
  })
};

/**
 * 发送消息
 */
const handleSend = () => {
  emit("chat", { data: msg.value, to: chatUser.value });
  changeMessage({
    data: msg.value,
    type: "right",
  });
  msg.value = null
};
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
  position: relative;
  .title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
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