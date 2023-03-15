<template>
  <div class="friends-list">
    <el-scrollbar>
      <el-card @click="handleClick(item)" v-for="item in userList" :key="item" :body-style="{ padding: '0px' }">
        <div class="head-sculpture"
          :style="{backgroundImage:`url('https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png')`}">
        </div>
        <div class="title">
          <span>{{item.userName}}</span>
        </div>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/store/chatStore";
import { computed } from "vue";

const store = useChatStore();
const { changeChat } = store;

const userList:any = computed(() => store.userList);

/**
 * 点击进入聊天界面
 */
const handleClick = (target:any) => {
  changeChat({ flag: true, chatUser: target });
};
</script>

<style lang="less" scoped>
.friends-list {
  width: 250px;
  height: 500px;
  padding-top: 5px;
  padding-left: 5px;
  padding-bottom: 5px;
  box-sizing: border-box;
  border-top: 1px solid #00000040;
  border-left: 1px solid #00000040;
  border-bottom: 1px solid #00000040;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  .head-sculpture {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    float: left;
  }
  .title {
    height: 50px;
    line-height: 50px;
    text-align: left;
    margin-left: 10px;
    float: left;
  }
}

:deep(.el-card) {
  background-color: transparent;
  margin-bottom: 5px;
  cursor: pointer;
}
</style>