<template>
  <div class="box">
    <!-- 登录 -->
    <div v-if="flag" class="login">
      <h1 class="title">聊天系统</h1>
      <el-form class="login-from" ref="loginRef" :model="loginData" :rules="loginRules" status-icon>
        <!-- 账号 -->
        <el-form-item label="账号" prop="accountNumber">
          <el-input v-enter-next v-model="loginData.accountNumber" placeholder="请填写手机号"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginData.password" show-password placeholder="请填写密码"
            @keydown.enter="handleLogin(loginRef)"></el-input>
        </el-form-item>

        <!-- 登录 -->
        <el-button :loading="loginLoading" class="btn" size="large" type="primary"
          @click="handleLogin(loginRef)">登录</el-button>
      </el-form>

      <span class="to-logon" @click="clickLogon">还没注册账号？去注册</span>
    </div>

    <!-- 注册 -->
    <div v-else class="logon">
      <h1 class="title">注册</h1>
      <el-form class="logon-from" ref="logonRef" :model="logonData" :rules="logonRules" status-icon
        label-position="right" :label-width="80" hide-required-asterisk>
        <!-- 账号 -->
        <el-form-item label="账号" prop="accountNumber">
          <el-input v-enter-next v-model="logonData.accountNumber" placeholder="请填写手机号"></el-input>
        </el-form-item>

        <!-- 昵称 -->
        <el-form-item label="昵称" prop="userName">
          <el-input v-enter-next v-model="logonData.userName" placeholder="请填写昵称"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-enter-next type="password" v-model="logonData.password" show-password
            placeholder="请填写密码"></el-input>
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="password2">
          <el-input v-enter-next type="password" v-model="logonData.password2" show-password
            placeholder="请填写确认密码"></el-input>
        </el-form-item>

        <el-row :gutter="10">
          <el-col :span="16">
            <!-- 验证码 -->
            <el-form-item label="验证码" prop="captcha">
              <el-input @keydown.enter="handleLogon(logonRef)" v-model="logonData.captcha"
                placeholder="请填写验证码"></el-input>
            </el-form-item>
          </el-col>

          <!-- 验证码图形 -->
          <el-col :span="8">
            <div v-html="captchaData" class="captcha" @click="handleCaptcha"></div>
          </el-col>
        </el-row>

        <!-- 注册 -->
        <el-button :loading="logonLoading" class="btn" size="large" type="primary"
          @click="handleLogon(logonRef)">注册</el-button>
      </el-form>

      <span class="to-login" @click="flag = !flag">已有账号？去登录</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { toLogin, getCaptcha, toLogon } from "@/api/login";
import { useChatStore } from "@/store/chatStore";
import { mobilePhone, pass } from "@/util/regular";
import { useSetting } from "@/store/settingStore";

/** 路由和状态库 */
const router = useRouter();
const store = useChatStore();
const setting = useSetting();
const { savePostbox } = setting;
const { setUpUserInfo } = store;

/** 组件实例 */
const { proxy } = getCurrentInstance() as any;

/** 用户数据 */
const flag = ref(true);
const captchaData = ref("");
const loginLoading = ref(false);
const logonLoading = ref(false);
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
const numberValidator = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback("请填写账号");
  } else {
    if (!mobilePhone.test(value)) {
      return callback(new Error("请正确输入账号！"));
    } else {
      return callback();
    }
  }
};

const passwordValidator = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback("请填写密码");
  } else {
    if (!pass.test(value)) {
      return callback(
        new Error("密码必须包含字母、数字、特殊符号的8位-16位的组合")
      );
    } else {
      return callback();
    }
  }
};

const passwordValidator2 = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback("请填写密码");
  } else if (logonData.password !== value) {
    return callback("两次密码不正确");
  } else {
    if (!pass.test(value)) {
      return callback(
        new Error("密码必须包含字母、数字、特殊符号的8位-16位的组合")
      );
    } else {
      return callback();
    }
  }
};

const loginRules = reactive<FormRules>({
  accountNumber: [{ validator: numberValidator, trigger: "blur" }],
  password: [{ validator: passwordValidator, trigger: "blur" }],
});

const logonRules = reactive<FormRules>({
  accountNumber: [{ validator: numberValidator, trigger: "blur" }],
  password: [{ validator: passwordValidator, trigger: "blur" }],
  password2: [{ validator: passwordValidator2, trigger: "blur" }],
  userName: [
    { required: true, message: "请填写昵称", trigger: "blur" },
    { max: 8, min: 3, message: "昵称长度为3~8位字符", trigger: "blur" },
  ],
  captcha: [
    { required: true, message: "请填写密码", trigger: "blur" },
    { max: 4, min: 4, message: "验证码长度为4位字符", trigger: "change" },
  ],
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
      loginLoading.value = true;
      // 加密数据
      const params: IUserInfo = {
        accountNumber: loginData.accountNumber,
        password: proxy.$AES_Encrypt(loginData.password),
      };

      let result = await toLogin(params);
      if (result.code === 200 && result.success) {
        setUpUserInfo(result.data);
        savePostbox(result.data.postbox);
        setting.$patch({ inputPostbox: result.data.postbox });
        router.push("/");
        formRef.resetFields();
        proxy.$message({
          type: "success",
          message: result.message,
        });
        loginLoading.value = false;
      } else {
        loginLoading.value = false;
        proxy.$message({
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
      logonLoading.value = true;
      // 加密数据
      const params: IUserInfo = {
        accountNumber: logonData.accountNumber,
        password: proxy.$AES_Encrypt(logonData.password),
        userName: logonData.userName,
        captcha: logonData.captcha,
      };

      let result = await toLogon(params);
      if (result.code === 200 && result.success) {
        flag.value = true;
        proxy.$message({
          type: "success",
          message: result.message,
        });
        formRef.resetFields();
        handleCaptcha();
        logonLoading.value = false;
      } else {
        logonLoading.value = false;
        handleCaptcha();
        proxy.$message({
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
  background-image: url("@/assets/image/background.png");
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  .login {
    width: 420px;
    height: 260px;
    background-color: #77889980;
    opacity: 0.9;
    border-radius: 10px;
    box-sizing: border-box;
    color: #fff;
    padding: 0px 20px 10px 20px;
    position: relative;
    box-shadow: #353535 30px 40px 40px, inset #ccc 10px 10px 30px;
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
    width: 420px;
    height: 410px;
    background-color: #77889980;
    opacity: 0.9;
    border-radius: 10px;
    box-sizing: border-box;
    color: #fff;
    padding: 0px 20px 10px 20px;
    position: relative;
    box-shadow: #353535 30px 40px 40px, inset #ccc 10px 10px 30px;
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