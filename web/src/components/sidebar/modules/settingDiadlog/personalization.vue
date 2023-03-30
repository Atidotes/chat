<template>
  <el-form ref="individualizationRef" status-icon>
    <!-- 铃声设置 -->
    <el-form-item label="铃声设置">
      <el-tabs v-model="activeName">
        <!-- 上传本地铃声 -->
        <el-tab-pane label="使用本地铃声" name="first">
          <el-upload ref="upload" :on-change="handleChange" action="" :limit="1" :auto-upload="false">
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <el-button :loading="LocalUploadLoading" class="btn-upload" type="success"
              @click="handleLocalUpload">上传</el-button>
            <template #tip>
              <div class="el-upload__tip text">
                音频文件时长不能超过5秒
              </div>
            </template>
          </el-upload>
        </el-tab-pane>

        <!-- 上传网络铃声 -->
        <el-tab-pane label="使用网络铃声" name="second">
          <el-input v-model="networkUpload.audioURL" placeholder="请填写网络地址">
            <template #append>
              <el-button :loading="networkUploadLoading" @click="handleNetworkUpload">上传</el-button>
            </template>
          </el-input>
        </el-tab-pane>
      </el-tabs>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type {
  FormInstance,
  FormRules,
  UploadInstance,
  UploadProps,
  UploadRawFile,
} from "element-plus";
import { uploadAudio } from "@/api/sidebar";
import { useChatStore } from "@/store/chatStore";
import { networkReg } from "@/util/regular";

const store = useChatStore();
const { setUpUserInfo } = store;

const activeName = ref("first");
const LocalUploadLoading = ref(false);
const networkUploadLoading = ref(false);
const upload = ref<UploadInstance>();
const individualizationRef = ref<FormInstance>();
const localUpload: IUserInfo = reactive({
  audio: "",
  file: null,
});
const networkUpload: IUserInfo = reactive({
  audioURL: "",
});

/** 判断上传音频时长是否大于预设值 */
const judgmentDuration = (
  target: any,
  num: number,
  isFile: boolean
): Promise<Boolean> => {
  return new Promise((resolve, reject) => {
    if (isFile) {
      let url = URL.createObjectURL(target);
      let audioElement = new Audio(url);
      audioElement.addEventListener("loadeddata", () => {
        audioElement.duration > num ? resolve(false) : resolve(true);
      });
    } else {
      let audioElement = new Audio(target);
      audioElement.addEventListener("loadeddata", () => {
        audioElement.duration > num ? resolve(false) : resolve(true);
      });
    }
  });
};

/** 文件上传前变化 */
const handleChange: UploadProps["onChange"] = async (file) => {
  let result: Boolean = await judgmentDuration(file.raw, 5, true);
  if (!result) return ElMessage.error("音频时长不能大于5秒");
  localUpload.audio = URL.createObjectURL(file.raw as Blob | MediaSource);
  localUpload.file = file.raw;
};

/** 上传网络地址 */
const handleNetworkUpload = async () => {
  networkUploadLoading.value = true;
  // 判断是否为正确的网络地址
  if (networkReg.test(networkUpload.audioURL as string)) {
    // 判断地址铃声是否大于5秒
    let res = await judgmentDuration(networkUpload.audioURL, 5, false);
    if (!res) {
      networkUploadLoading.value = false;
      return ElMessage.error("音频时长不能大于5秒");
    }
    const params: FormData = new FormData();
    for (let item in networkUpload) {
      params.append(
        item,
        networkUpload[item as keyof typeof networkUpload] as any
      );
    }
    let result = await uploadAudio(params);
    if (result.code === 200 && result.success) {
      setUpUserInfo(result.data);
      ElMessage.success(result.message);
      networkUploadLoading.value = false;
    } else {
      networkUploadLoading.value = false;
      ElMessage.error(result.message);
    }
  } else {
    networkUploadLoading.value = false;
    ElMessage.error("请输入正确的网络地址");
  }
};

/** 上传本地文件 */
const handleLocalUpload = async () => {
  LocalUploadLoading.value = true;
  const params: FormData = new FormData();
  for (let item in localUpload) {
    params.append(item, localUpload[item as keyof typeof localUpload] as any);
  }
  let result = await uploadAudio(params);
  if (result.code === 200 && result.success) {
    setUpUserInfo(result.data);
    LocalUploadLoading.value = false;
    ElMessage.success(result.message);
  } else {
    LocalUploadLoading.value = false;
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

:deep(.el-tabs) {
  --el-tabs-header-height: auto;
}
</style>