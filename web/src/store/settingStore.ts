import { defineStore } from 'pinia'
import { markRaw, defineAsyncComponent } from 'vue'

/** 异步组件引入 */
const personalization = defineAsyncComponent(() => {
  return import("@/components/sidebar/modules/settingDiadlog/personalization.vue");
});
const safe = defineAsyncComponent(() => {
  return import("@/components/sidebar/modules/settingDiadlog/safe.vue")
});

export const useSetting = defineStore('setting', {
  state: (): ISettingStore => {
    return {
      /** 组件 */
      assembly: [
        {
          id: 0,
          title: "personalization",
          name: markRaw(personalization),
        },
        {
          id: 1,
          title: "safe",
          name: markRaw(safe),
        },
      ],
      /** 菜单 */
      menu: [
        {
          id: 0,
          title: "个性化设置",
          name: "personalization",
        },
        {
          id: 1,
          title: "安全",
          name: "safe",
        },
      ],
      /** 邮箱 */
      postbox: '',
      /** input框绑定的邮箱值 */
      inputPostbox: '',
    }
  },
  actions: {
    /** 保存邮箱信息 */
    savePostbox(value: string) {
      this.postbox = value
    }
  },

  persist: {
    key: 'setting',
    paths: ['menu', 'postbox','inputPostbox'],
    storage: sessionStorage,
  },
})