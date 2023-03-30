<template>
  <el-dialog v-model="flag" title="设置" width="600px" :close-on-click-modal="false" :show-close="false"
    class="setting-dialog">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 菜单 -->
        <el-menu v-for="item in menu" :key="item.id" :default-active="current.title" @select="menuSelect">
          <el-menu-item :index="item.name">{{item.title}}</el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 内容区 -->
      <el-main>
        <!-- 动态组件 -->
        <component :is="current.name"></component>
      </el-main>
    </el-container>

    <!-- 弹窗页脚 -->
    <template #footer>
      <el-divider />
      <span class="dialog-footer">
        <el-button @click="flag = false">取消</el-button>
        <el-button type="primary" @click="flag = false">应用</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, markRaw, reactive, ref } from "vue";
import { useSetting } from "@/store/settingStore";
import { mapState } from "pinia";

/** 状态库 */
const store = useSetting();

const assembly = computed(() => store.assembly);
const menu = computed(() => store.menu);

/** 动态组件数据 */
const current = reactive({
  title: assembly.value[0].title,
  name: assembly.value[0].name,
});

/** 菜单选择项 */
const menuSelect = (index: string) => {
  assembly.value.forEach((item) => {
    if (item.title === index) {
      current.title = item.title;
      current.name = item.name;
    }
  });
};

/** 封装v-model */
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
const flag = computed<boolean>({
  set: (value: Boolean) => {
    return emit("update:modelValue", value);
  },
  get: () => {
    return props.modelValue;
  },
});
</script>

<style lang="less" scoped>
</style>

<style lang="less">
.setting-dialog {
  .el-dialog__body {
    padding-bottom: 0px;
    padding-top: 0;
  }
  .el-dialog__footer {
    padding-top: 0;
    .el-divider--horizontal {
      margin: 12px 0;
    }
  }
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
}
</style>