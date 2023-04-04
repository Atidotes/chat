<template>
  <el-dialog v-model="flag" title="修改密码" width="30%" :close-on-click-modal="false">
    <el-form ref="changePasswordRef" :model="changePassword" :rules="changePasswordRules" status-icon
      label-position="right" :label-width="80">
      <!-- 旧密码 -->
      <el-form-item label="旧密码" prop="password">
        <el-input type="password" v-model="changePassword.password" show-password placeholder="请填写旧密码"></el-input>
      </el-form-item>

      <!-- 新密码 -->
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="changePassword.newPassword" show-password placeholder="请填写旧密码"></el-input>
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item label="确认密码" prop="newPassword2">
        <el-input type="password" v-model="changePassword.newPassword2" show-password placeholder="请填写旧密码"></el-input>
      </el-form-item>
    </el-form>

    <!-- 提交 -->
    <el-button @click="handleAffirm(changePasswordRef)" class="btn" type="primary">确认修改</el-button>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, getCurrentInstance } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { pass } from "@/util/regular";
import { password } from "@/api/sidebar";

const { proxy } = getCurrentInstance() as any;

const changePasswordRef = ref<FormInstance>();
const changePassword: IChangePassword = reactive({
  password: "",
  newPassword: "",
  newPassword2: "",
});

/** 验证规则 */
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
  } else if (changePassword.newPassword !== value) {
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

const changePasswordRules = reactive<FormRules>({
  password: [{ validator: passwordValidator, trigger: "blur" }],
  newPassword: [{ validator: passwordValidator, trigger: "blur" }],
  newPassword2: [{ validator: passwordValidator2, trigger: "blur" }],
});

/** 提交数据 */
const handleAffirm = (formRef: FormInstance | undefined) => {
  if (!formRef) return;
  formRef.validate(async (valid) => {
    if (valid) {
      const params: IChangePassword = {
        password: proxy.$AES_Encrypt(changePassword.password),
        newPassword: proxy.$AES_Encrypt(changePassword.newPassword),
      };
      const result = await password(params);

      if (result.code === 200 && result.success) {
        ElMessage.success(result.message);
        flag.value = false;
        formRef.resetFields();
      } else {
        ElMessage.error(result.message);
      }
    }
  });
};

/** 自定义v-model */
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
const flag = computed<boolean>({
  set(value: Boolean) {
    return emit("update:modelValue", value);
  },
  get() {
    return props.modelValue;
  },
});
</script>

<style lang="less" scoped>
.btn {
  position: relative;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0);
}
</style>