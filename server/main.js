const koa = require('koa')
const bodyParser = require('koa-bodyparser')
const config = require('./env.config')
const chatRouter = require('./router/web/chatRouter')
const JWT = require('./util/JWT')
require('./config/db.config')
const chat = require('./util/chat')


/** 实例化koa */
const app = new koa()
app.use(bodyParser())
chat(app)

/** token验证 */
app.use(async (ctx, next) => {
  if (ctx.url.includes('/web/api/login')) return await next()
  // 获取token值
  const token = ctx.headers['authorization']

  // 判断是否有token
  if (token) {
    const mount = token.split(' ')
    const analysis = JWT.verify(mount[1])

    // 判断token是否有效
    if (analysis) {
      // 设置token
      const newToken = JWT.generate({
        accountNumber: analysis.accountNumber,
        userName: analysis.userName,
      }, '1d')
      ctx.set('Authorization', newToken)

      await next()
    } else {
      ctx.status = 401
      ctx.body = {
        errorCode: 401,
        errorInfo: '无效token值'
      }
    }
  }
})

/** web端路由配置 */
app.use(chatRouter.routes(), chatRouter.allowedMethods())

/** 监听端口号3000 */
app.listen(config.APP_PORT, () => {
  // console.clear()
  // console.log()
  console.log((`server start at ${config.APP_BASE}:${config.APP_PORT}`))
  console.info(`欢迎使用本次服务`)
})