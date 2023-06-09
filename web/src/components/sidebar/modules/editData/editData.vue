<template>
  <el-dialog v-model="flag" title="编辑资料" width="30%" :close-on-click-modal="false">
    <el-form ref="editRef" :model="editData" :rules="editRules" status-icon label-position="right" :label-width="80">
      <!-- 昵称 -->
      <el-form-item label="昵称" prop="userName">
        <el-input v-model.trim="editData.userName" placeholder="请填写昵称"></el-input>
      </el-form-item>

      <!-- 选择性别 -->
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model.number="editData.gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
          <el-radio :label="0">未知</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 个人简介 -->
      <el-form-item label="个人简介" prop="introduction">
        <el-input type="textarea" :rows="2" v-model.trim="editData.introduction" maxlength="30" show-word-limit
          placeholder="请填写个人简介"></el-input>
      </el-form-item>

      <!-- 头像 -->
      <el-form-item label="头像" prop="avatar">
        <el-upload class="avatar-uploader" action="" :show-file-list="false" :auto-upload="false"
          :on-change="changeUpload">
          <img v-if="editData.avatar" :src="editData.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>

    <el-button :loading="editLoading" class="btn" @click="handleSave(editRef)" type="primary">保存资料</el-button>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, onMounted,getCurrentInstance } from "vue";
import type {
  FormInstance,
  FormRules,
  UploadProps,
  UploadRawFile,
} from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { upload } from "@/api/sidebar";
import { useChatStore } from "@/store/chatStore";
import compress from "@/util/compress";

const { proxy } = getCurrentInstance() as any;
const store = useChatStore();
const { setUpUserInfo } = store;

const editLoading = ref(false);
const editRef = ref<FormInstance>();
const editData: IUserInfo = reactive({
  userName: "",
  gender: 0,
  introduction: "",
  avatar: "",
  file: null,
});

/** 获取状态库数据 */
const userInfo = computed(() => store.getUserInfo);
onMounted(() => {
  Object.assign(editData, userInfo.value);
});

const editRules = reactive<FormRules>({
  userName: [
    { required: true, message: "请填写昵称", trigger: "blur" },
    { max: 8, min: 3, message: "昵称长度为3~8位字符", trigger: "blur" },
  ],
  gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
  introduction: [{ required: true, message: "请填简介", trigger: "blur" }],
  avatar: [{ required: true, message: "请上传头像", trigger: "blur" }],
});

/**
 * 上传头像
 */
const changeUpload: UploadProps["onChange"] = async (file) => {
  editData.avatar = URL.createObjectURL(file.raw as Blob | MediaSource);
  editData.file = await compress({ file: file.raw as UploadRawFile});
};

/** 封装v-model */
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

/**
 * 提交资料
 */
const handleSave = (editRef: FormInstance | undefined) => {
  if (!editRef) return;
  editRef.validate(async (valid) => {
    if (valid) {
      editLoading.value = true;
      // 数据转换成FormData
      const params: FormData = new FormData();
      for (let item in editData) {
        params.append(item, editData[item as keyof typeof editData] as any);
      }

      let result = await upload(params);
      if (result.code === 200 && result.success) {
        // 更新状态库
        setUpUserInfo(result.data);
        flag.value = false;
        proxy.$message({
          type: "success",
          message: result.message,
        });
        editLoading.value = false;
      } else {
        editLoading.value = false;
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
.btn {
  display: block;
  margin: auto;
}

.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  display: block;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
}

.example-showcase .el-loading-mask {
  z-index: 9;
}

:deep(.el-textarea__inner) {
  resize: none;
}

:deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  &:hover {
    border-color: var(--el-color-primary);
  }
}
</style>