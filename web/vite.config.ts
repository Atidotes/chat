import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {

  const env = loadEnv(mode, process.cwd(),'APP_')

  return {
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],

    envPrefix: "APP_",

    server: {
      proxy: {
        '/web': {
          target: env.APP_BASE,
        }
      }
    },

    resolve: {
      alias: {
        "@": resolve(__dirname, 'src')
      }
    }
  }
})

