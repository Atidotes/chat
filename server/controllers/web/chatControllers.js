const Router = require('koa-router')
const chatServices = require('../../services/web/chatServices')
const chatControllers = new Router()
const JWT = require('../../util/JWT')

chatControllers.post('/login', async (ctx, next) => {
  const { password, accountNumber } = ctx.request.body

  let result = await chatServices.login({ password, accountNumber })

  // 设置token
  const token = JWT.generate({
    accountNumber: result.accountNumber,
    userName: result.userName
  }, '1d')
  ctx.set('Authorization', token)

  sendData(ctx, {
    accountNumber: result.accountNumber,
    userName: result.userName
  })
})

chatControllers.get('/a', (ctx, next) => {
  sendData(ctx, null)
})

const sendData = (target, data) => {
  if (data) {
    target.status = 200
    target.body = {
      code: 200,
      message: '获取数据成功',
      success: true,
      data
    }
  } else {
    target.status = 401
    target.body = {
      code: 401,
      message: '获取数据失败',
      success: false,
      data
    }
  }
}

module.exports = chatControllers