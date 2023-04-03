<template>
  <div class="box-sidebar">
    <el-popover effect="dark" :width="280" :visible="avatarVisible" placement="bottom-start">
      <template #reference>
        <el-avatar id="iconAvatar" @click.preventDefault="avatarVisible = !avatarVisible" shape="square"
          class="head-sculpture" :size="40" :src="userInfo.avatar" />
      </template>
      <template #default>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-avatar shape="square" style="margin-top:15px;margin-left:5px;" :size="50" :src="userInfo.avatar" />
          </el-col>
          <el-col :span="18">
            <div class="box-nickname">
              <h3>{{userInfo.userName}}</h3>
              <el-icon v-show="userInfo.gender === 1">
                <Female />
              </el-icon>
              <el-icon v-show="userInfo.gender === 2">
                <Male />
              </el-icon>
            </div>

            <div>账号：{{userInfo.accountNumber}}</div>
            <div>简介：{{userInfo.introduction}}</div>
          </el-col>
        </el-row>
        <el-button @click="editDataFlag = true" style="margin-top:10px;margin-left:50px;"
          type="primary">编辑资料</el-button>
      </template>
    </el-popover>

    <el-popover placement="right" :width="200" :visible="visible" effect="dark">
      <template #reference>
        <el-icon id="iconChat" class="menu" size="20" @click.preventDefault="visible=!visible">
          <Menu id="iconChat" />
        </el-icon>
      </template>
      <template #default>
        <div @click="visible=!visible">
          <div class="setting" @click="settingVisible = true">
            <el-icon>
              <Setting />
            </el-icon>
            <span>设置</span>
          </div>
        </div>
        <div @click="visible=!visible">
          <div class="login-out" @click="handleLoginOut">
            <el-icon>
              <SwitchButton />
            </el-icon>
            <span>退出登录</span>
          </div>
        </div>
      </template>
    </el-popover>
  </div>

  <!-- 修改个人资料 -->
  <editData v-model="editDataFlag"></editData>
  <!-- 设置 -->
  <settingDiadlog v-model="settingVisible"></settingDiadlog>
</template>

<script setup lang="ts">
import {
  Menu,
  SwitchButton,
  Setting,
  Female,
  Male,
} from "@element-plus/icons-vue";
import { onBeforeUnmount, onMounted, onUnmounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import editData from "@/components/sidebar/modules/editData/editData.vue";
import settingDiadlog from "@/components/sidebar/modules/settingDiadlog/settingDiadlog.vue";
import { useChatStore } from "@/store/chatStore";

const router = useRouter();
const store = useChatStore();

const visible = ref(false);
const avatarVisible = ref(false);
const settingVisible = ref(false);
const trim = ref(0);
const editDataFlag = ref(false);

const userInfo = computed(() => store.getUserInfo);
onMounted(() => {
  window.addEventListener("click", handleClick, false);
  window.addEventListener("click", handleAvatar, false);
});

/**
 * 点击事件
 */
const handleClick = (e: any) => {
  if (!visible.value) return;
  if (e.target.parentNode.id !== "iconChat") {
    return (visible.value = false);
  }
};

const handleAvatar = (e: any) => {
  if (!avatarVisible.value) return;
  if (e.target.parentNode.id !== "iconAvatar") {
    return (avatarVisible.value = false);
  }
};

/**
 * 退出登录
 */
const handleLoginOut = () => {
  ElMessageBox.confirm("确认要退出登录吗？", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    trim.value = setTimeout(() => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("chat");
      sessionStorage.removeItem("setting");
      router.push("/login");
    }, 350);
  });
};

onBeforeUnmount(() => {
  clearTimeout(trim.value);
  window.removeEventListener("click", handleClick, false);
  window.removeEventListener("click", handleAvatar, false);
});
</script>

<style lang="less" scoped>
.box-sidebar {
  width: 50px;
  height: 500px;
  border-top: 1px solid #00000040;
  border-left: 1px solid #00000040;
  border-bottom: 1px solid #00000040;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  box-sizing: border-box;
  background-color: #70809040;
  position: relative;
  .head-sculpture {
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translate(-50%, 0);
    cursor: pointer;
  }
  .menu {
    position: absolute;
    left: 50%;
    bottom: 5px;
    transform: translate(-50%, 0);
    color: #9932cc;
    cursor: pointer;
  }
}

.login-out,
.setting {
  width: 100%;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  border-radius: 5px;
  padding-left: 5px;
  span {
    margin-left: 5px;
  }
  &:hover {
    background-color: dimgray;
  }
}

.box-nickname {
  display: flex;
  align-items: center;
  h3 {
    margin-right: 10px;
  }
}
</style>