import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/store/index'
import { AES_Encrypt, AES_Decrypt } from '@/util/encryption'

const app = createApp(App)

app.config.globalProperties.$AES_Encrypt = AES_Encrypt //全局加密
app.config.globalProperties.$AES_Decrypt = AES_Decrypt //全局解密

app.use(router)
app.use(pinia)
app.mount('#app')
