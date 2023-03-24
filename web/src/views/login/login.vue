<template>
  <div class="box">
    <!-- 登录 -->
    <div v-if="flag" class="login">
      <h1 class="title">聊天系统</h1>
      <el-form class="login-from" ref="loginRef" :model="loginData" :rules="loginRules" status-icon>
        <!-- 账号 -->
        <el-form-item label="账号" prop="accountNumber">
          <el-input v-model="loginData.accountNumber"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginData.password" show-password></el-input>
        </el-form-item>

        <!-- 登录 -->
        <el-button class="btn" size="large" type="primary" @click="handleLogin(loginRef)">登录</el-button>
      </el-form>

      <span class="to-logon" @click="clickLogon">还没注册账号？去注册</span>
    </div>

    <!-- 注册 -->
    <div v-else class="logon">
      <h1 class="title">注册</h1>
      <el-form class="logon-from" ref="logonRef" :model="logonData" :rules="logonRules" status-icon
        label-position="right" :label-width="80">
        <!-- 账号 -->
        <el-form-item label="账号" prop="accountNumber">
          <el-input v-model="logonData.accountNumber"></el-input>
        </el-form-item>

        <!-- 昵称 -->
        <el-form-item label="昵称" prop="userName">
          <el-input v-model="logonData.userName"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="logonData.password" show-password></el-input>
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="password2">
          <el-input type="password" v-model="logonData.password2" show-password></el-input>
        </el-form-item>

        <el-row :gutter="10">
          <el-col :span="16">
            <!-- 验证码 -->
            <el-form-item label="验证码" prop="captcha">
              <el-input v-model="logonData.captcha"></el-input>
            </el-form-item>
          </el-col>

          <!-- 验证码图形 -->
          <el-col :span="8">
            <div v-html="captchaData" class="captcha" @click="handleCaptcha"></div>
          </el-col>
        </el-row>

        <!-- 注册 -->
        <el-button class="btn" size="large" type="primary" @click="handleLogon(logonRef)">注册</el-button>
      </el-form>

      <span class="to-login" @click="flag = !flag">已有账号？去登录</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { toLogin, getCaptcha, toLogon } from "@/api/login";
import { useChatStore } from "@/store/chatStore";

/** 路由和状态库 */
const router = useRouter();
const store = useChatStore();
const { getUserInfo } = store;

/** 用户数据 */
const flag = ref(true);
const captchaData = ref("");
const loginRef = ref<FormInstance>();
const logonRef = ref<FormInstance>();
const loginData: IUserInfo = reactive({
  accountNumber: null,
  password: "",
});
const logonData: IUserInfo = reactive({
  accountNumber: null,
  userName: "",
  password: "",
  password2: "",
  captcha: "",
});

/** 验证规则 */
const loginRules = reactive<FormRules>({
  accountNumber: [{ required: true, message: "请填写账号", trigger: "blur" }],
  password: [{ required: true, message: "请填写密码", trigger: "blur" }],
});

const logonRules = reactive<FormRules>({
  accountNumber: [{ required: true, message: "请填写账号", trigger: "blur" }],
  userName: [{ required: true, message: "请填写昵称", trigger: "blur" }],
  password: [{ required: true, message: "请填写密码", trigger: "blur" }],
  password2: [{ required: true, message: "请填写密码", trigger: "blur" }],
  captcha: [{ required: true, message: "请填写密码", trigger: "blur" }],
});

/**
 * 点击注册
 */
const clickLogon = () => {
  handleCaptcha();
  flag.value = !flag;
};

/**
 * 获取验证码
 */
const handleCaptcha = async () => {
  const result = await getCaptcha();
  if (result.code === 200 && result.success) {
    captchaData.value = result.data;
  }
};

/**
 * 登录回调
 */
const handleLogin = (formRef: FormInstance | undefined) => {
  if (!formRef) return;
  formRef.validate(async (valid) => {
    if (valid) {
      let result = await toLogin(loginData);
      if (result.code === 200 && result.success) {
        getUserInfo(result.data);
        router.push("/");
        formRef.resetFields();
      } else {
        ElMessage({
          type: "error",
          message: result.message,
        });
      }
    }
  });
};

/**
 * 注册回调
 */
const handleLogon = (formRef: FormInstance | undefined) => {
  if (!formRef) return;
  formRef.validate(async (valid) => {
    if (valid) {
      let result = await toLogon(logonData);
      if (result.code === 200 && result.success) {
        console.log("成功");

        flag.value = true;
        ElMessage({
          type: "success",
          message: result.message,
        });
        formRef.resetFields();
        handleCaptcha();
      } else {
        console.log("失败");

        handleCaptcha();
        ElMessage({
          type: "error",
          message: result.message,
        });
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
    height: 260px;
    background-color: #778899;
    border-radius: 10px;
    box-sizing: border-box;
    color: #fff;
    padding: 0px 20px 10px 20px;
    position: relative;
    .to-logon {
      position: absolute;
      right: 20px;
      bottom: 10px;
      cursor: pointer;
      &:hover {
        color: rgba(0, 0, 255, 0.4);
      }
    }
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

  .logon {
    width: 400px;
    height: 410px;
    background-color: #778899;
    border-radius: 10px;
    box-sizing: border-box;
    color: #fff;
    padding: 0px 20px 10px 20px;
    position: relative;
    .to-login {
      position: absolute;
      right: 20px;
      bottom: 10px;
      cursor: pointer;
      &:hover {
        color: rgba(0, 0, 255, 0.4);
      }
    }
    .title {
      width: 100%;
      height: 60px;
      text-align: center;
      line-height: 60px;
      border-bottom: 1px solid #fff;
    }
    .logon-from {
      margin-top: 20px;
      .captcha {
        cursor: pointer;
        border-radius: 5px;
        overflow: hidden;
        height: 32px;
        background-color: #ccc;
      }
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