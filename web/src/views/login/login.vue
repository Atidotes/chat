<template>
  <div class="box">
    <div class="login">
      <h1 class="title">聊天系统</h1>
      <el-form class="login-from" ref="loginRef" :model="loginData" :rules="rules" status-icon>
        <!-- 账号 -->
        <el-form-item label="账号" prop="accountNumber">
          <el-input v-model="loginData.accountNumber"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginData.password"></el-input>
        </el-form-item>

        <!-- 登录 -->
        <el-button class="btn" size="large" type="primary" @click="handleLogin(loginRef)">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter, Router } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { login } from "@/api/login";
import { useChatStore } from '@/store/chatStore'

const router: Router = useRouter();
const store = useChatStore()
const {getUserInfo} =store

const loginRef = ref<FormInstance>();
const loginData = reactive({
  accountNumber: "",
  password: "",
});

const rules = reactive<FormRules>({
  accountNumber: [{ required: true, message: "请填写账号", trigger: "blur" }],
  password: [{ required: true, message: "请填写密码", trigger: "blur" }],
});

const handleLogin = (formRef: FormInstance | undefined) => {
  if (!formRef) return;
  formRef.validate(async (valid) => {
    if (valid) {
      let result:any = await login(loginData);

      if (result.code === 200) {
        getUserInfo(result.data)
        router.push('/')
      }
    }
  });
};
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 100vh;
  background-color: #353535;
  display: flex;
  justify-content: center;
  align-items: center;
  .login {
    width: 400px;
    height: 240px;
    background-color: #778899;
    border-radius: 10px;
    box-sizing: border-box;
    color: #fff;
    padding: 0px 20px 10px 20px;
    .title {
      width: 100%;
      height: 60px;
      text-align: center;
      line-height: 60px;
      border-bottom: 1px solid #fff;
    }
    .login-from {
      margin-top: 20px;
      .btn {
        margin-top: 10px;
        display: block;
        width: 200px;
        margin: auto;
        font-size: 20px;
      }
    }
  }
}

:deep(.el-form-item__label) {
  color: #fff;
}
:deep(.el-form-item__error) {
  color: #fff;
}
</style>