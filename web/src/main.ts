import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/store/index'
import { AES_Encrypt, AES_Decrypt } from '@/util/encryption'
import { ElMessage, ElMessageBox } from "element-plus"
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import {enterNext} from '@/util/enterNext'

const app = createApp(App)

// 加密解密
app.config.globalProperties.$AES_Encrypt = AES_Encrypt
app.config.globalProperties.$AES_Decrypt = AES_Decrypt

// 挂载全局UI库
app.config.globalProperties.$message = ElMessage
app.config.globalProperties.$messageBox = ElMessageBox

app.use(router)
app.use(pinia)
app.mount('#app')

enterNext(app)
