<template>
  <el-form ref="safeRef" status-icon>
    <el-form-item label="绑定邮箱">
      <div class="postbox">
        <span>2392503436@qq.com</span>
        <el-button @click="postboxFlag = false" class="postbox-btn" type="primary">修改</el-button>
      </div>
      <el-input :disabled="postboxFlag" class="postbox-input" v-model.trim="postbox" placeholder="请填邮箱">
        <template #append>
          <el-button @click="handlePostbox">确定</el-button>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";

const safeRef = ref<FormInstance>();
const postbox = ref("");
const postboxFlag = ref(true)

const handlePostbox = () =>{
  postboxFlag.value = true
  if(postbox.value.includes('@qq.com')){
    
  }else{
    ElMessage.error('请输入QQ邮箱')
  }
}
</script>

<style lang="less" scoped>
.postbox {
  margin-bottom: 5px;
  .postbox-btn {
    margin-left: 30px;
  }
}
.postbox-input {
  width: 237px;
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
</style>