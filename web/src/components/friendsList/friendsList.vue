<template>
  <div class="friends-list">
    <el-scrollbar>
      <el-card @click="handleClick(item)" v-for="item in userList" :key="item.userName"
        :body-style="{ padding: '0px' }">
        <el-avatar id="iconAvatar" class="head-sculpture" :size="50" :src="item.avatar" />
        <div class="title">
          <span>{{item.userName}}</span>
        </div>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/store/chatStore";
import { computed, getCurrentInstance } from "vue";

const store = useChatStore();
const { selectChat } = store;

const userList = computed<Array<IUserInfo>>(() => store.getUserList);

/**
 * 点击进入聊天界面
 */
const handleClick = (target: IUserInfo) => {
  selectChat({
    flag: true,
    currentChatUserInfo: {
      accountNumber: target.accountNumber,
      userName: target.userName,
      avatar: target.avatar,
    },
  });
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
  .head-sculpture {
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