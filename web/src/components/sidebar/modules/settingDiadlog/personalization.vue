<template>
  <el-form ref="individualizationRef" :model="individualizationData" :rules="individualizationRules" status-icon>
    <el-form-item label="更换铃声" prop="accountNumber">
      <el-upload ref="upload" :on-change="handleChange" action="" :limit="1" :auto-upload="false">

        <template #trigger>
          <el-button type="primary">选择文件</el-button>
        </template>

        <el-button :loading="uploadLoading" class="btn-upload" type="success" @click="submitUpload">上传</el-button>

        <template #tip>
          <div class="el-upload__tip text">
            音频文件时长不能超过5秒
          </div>
        </template>
      </el-upload>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import {
  ElMessage,
  FormInstance,
  FormRules,
  UploadInstance,
  UploadProps,
  UploadRawFile,
} from "element-plus";
import { setting } from "@/api/sidebar";
import { useChatStore } from "@/store/chatStore";

const store = useChatStore();
const { setUpUserInfo } = store;

const uploadLoading = ref(false);
const upload = ref<UploadInstance>();
const individualizationRef = ref<FormInstance>();
const individualizationData: IUserInfo = reactive({
  audio: "",
  file: null,
});

/** 验证规则 */
const individualizationRules = reactive<FormRules>({});

/** 判断上传音频时长是否大于预设值 */
const judgmentDuration = (file: any, num: number): Promise<Boolean> => {
  return new Promise((resolve, reject) => {
    let url = URL.createObjectURL(file);
    let audioElement = new Audio(url);
    audioElement.addEventListener("loadeddata", () => {
      audioElement.duration > num ? resolve(false) : resolve(true);
    });
  });
};

/** 文件上传前变化 */
const handleChange: UploadProps["onChange"] = async (file) => {
  let result: Boolean = await judgmentDuration(file.raw, 5);
  if (!result) return ElMessage.error("音频时长不能大于5秒");

  individualizationData.audio = URL.createObjectURL(
    file.raw as Blob | MediaSource
  );
  individualizationData.file = file.raw;
};

/** 提交文件上传 */
const submitUpload = async () => {
  uploadLoading.value = true;
  
  const params: FormData = new FormData();
  for (let item in individualizationData) {
    params.append(
      item,
      individualizationData[item as keyof typeof individualizationData] as any
    );
  }

  let result = await setting(params);
  if (result.code === 200 && result.success) {
    setUpUserInfo(result.data);
    uploadLoading.value = false;
    ElMessage.success(result.message);
  } else {
    uploadLoading.value = false;
    ElMessage.error(result.message);
  }
};
</script>

<style lang="less" scoped>
.btn-upload {
  margin-left: 10px;
}
.text {
  margin: 0;
  padding: 0;
  line-height: 15px;
}

:deep(..el-upload-list) {
  margin: 0;
}

:deep(.el-upload-list__item) {
  line-height: 16px;
  height: 16px;
}

:deep(.el-upload-list__item-name) {
  font-size: 12px;
  line-height: 16px;
  height: 16px;
}
</style>