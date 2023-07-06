<template>
  <el-form ref="safeRef" status-icon>
    <el-form-item label="绑定邮箱">
      <div class="postbox">
        <span v-show="isPostbox" class="title">{{postbox}}</span>
        <span v-show="!isPostbox" class="title">暂无绑定邮箱</span>
        <el-button @click="isEdit(postboxFlag)" class="postbox-btn" type="primary">
          {{ isPostbox? '修改' : '添加'}}
        </el-button>
      </div>

      <el-input :disabled="inputFlag" class="postbox-input" v-model.trim="inputPostbox" placeholder="请填写邮箱">
        <template #append>
          <el-button :disabled="inputFlag" @click="handlePostbox(inputPostbox)">发送验证码</el-button>
        </template>
      </el-input>

      <el-input v-if="!postboxFlag" :disabled="postboxFlag" v-model.trim="captcha" class="postbox-input"
        placeholder="请填写验证码">
        <template #append>
          <el-button @click="handleCaptcha" :disabled="postboxFlag">确定</el-button>
        </template>
      </el-input>
    </el-form-item>

  </el-form>
</template>

<script lang="ts" setup>
import { computed, ref, watch,getCurrentInstance } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { mailbox } from "@/util/regular";
import { bindMailbox, mailboxCaptcha } from "@/api/setup";
import { useSetting } from "@/store/settingStore";

const store = useSetting();
const { savePostbox } = store;

const { proxy } = getCurrentInstance() as any;

const safeRef = ref<FormInstance>();
const postboxFlag = ref(true);
const inputFlag = ref(true);
const captcha = ref("");
const isPostbox = ref(false);

const postbox = computed<string>(() => store.postbox);

watch(
  postbox,
  (newValue, oldValue) => {
    if (newValue) {
      isPostbox.value = true;
    }
  },
  { immediate: true }
);

const inputPostbox = computed<string>({
  set(value: string) {
    return store.$patch({ inputPostbox: value });
  },
  get() {
    return store.inputPostbox;
  },
});

/** 点击新增按钮 */
const isEdit = (flag: boolean) => {
  if (flag) {
    postboxFlag.value = false;
    inputFlag.value = false;
  } else {
    store.$patch({ inputPostbox: postbox.value });
    postboxFlag.value = true;
    inputFlag.value = true;
  }
};

/** 提交邮箱 */
const handlePostbox = async (params: string) => {
  // 判断是否为QQ邮箱
  if (mailbox.test(params)) {
    const result = await bindMailbox({
      postbox: params,
    });
    if (result.code === 200 && result.success) {
      proxy.$message.success(result.message);
      inputFlag.value = true;
    } else {
      proxy.$message.error(result.message);
    }
  } else {
    proxy.$message.error("请输入QQ邮箱");
  }
};

/** 提交验证码 */
const handleCaptcha = async () => {
  const result = await mailboxCaptcha({
    postbox: inputPostbox.value,
    captcha: captcha.value,
  });

  if (result.code === 200 && result.success) {
    savePostbox(result.data.postbox);
    proxy.$message.success(result.message);
    postboxFlag.value = true;
    captcha.value = "";
    isPostbox.value = true;
  } else {
    proxy.$message.error(result.message);
  }
};
</script>

<style lang="less" scoped>
.postbox {
  margin-bottom: 5px;
  .title {
    display: inline-block;
    width: 185px;
  }
  .postbox-btn {
    margin-left: 30px;
  }
}
.postbox-input {
  width: 275px;
  margin-top: 5px;
}

:deep(.el-input-group__append button.el-button) {
  background-color: #67c23a;
  color: #fff;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  &:hover {
    background-color: #95d475;
    outline: 0;
  }
}

:deep(.el-form-item__content) {
  flex-direction: column;
  justify-items: center;
  align-items: flex-start;
}
</style>