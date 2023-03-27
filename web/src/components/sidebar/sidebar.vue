<template>
  <div class="box-sidebar">
    <div class="head-sculpture"
      :style="{backgroundImage:`url('https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png')`}">
    </div>

    <el-popover placement="right" :width="200" :visible="visible" effect="dark">
      <template #reference>
        <el-icon id="iconChat" class="menu" size="20" @click.preventDefault="visible=!visible">
          <Menu id="iconChat" />
        </el-icon>
      </template>
      <template #default>
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
</template>

<script setup lang="ts">
import { Menu, SwitchButton } from "@element-plus/icons-vue";
import { onBeforeUnmount, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const visible = ref(false);
const trim = ref(0);

onMounted(() => {
  window.addEventListener("click", handleClick, false);
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
      localStorage.removeItem("token");
      sessionStorage.removeItem("chat");
      router.push("/login");
    }, 350);
  });
};

onBeforeUnmount(() => {
  clearTimeout(trim.value);
  window.removeEventListener("click", handleClick, false);
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
    width: 35px;
    height: 35px;
    background-position: center;
    background-size: cover;
    margin: 10px auto;
    border-radius: 5px;
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
.login-out {
  width: 100%;
  height: 25px;
  line-height: 25px;
  cursor: pointer;
  span {
    margin-left: 5px;
  }
}
</style>