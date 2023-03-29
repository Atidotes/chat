const Router = require('koa-router')
const chatServices = require('../../services/web/chatServices')
const JWT = require('../../util/JWT')
const svgCaptcha = require('svg-captcha');
const config = require('../../env.config')

const chatControllers = new Router()
let captchaText = '0'

/** 登录 */
chatControllers.post('/login', async (ctx, next) => {
  const { password, accountNumber } = ctx.request.body
  let result = await chatServices.login({ password, accountNumber })
  const url = 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'

  if (result) {
    // 头像设置
    const avatar =  result.avatar === undefined ? url : `${config.APP_BASE}:${config.APP_PORT}${result.avatar}`

    // 设置token
    const token = JWT.generate({
      _id: result._id,
      accountNumber: result.accountNumber,
      userName: result.userName,
      avatar: avatar,
    }, '1d')
    ctx.set('Authorization', token)

    ctx.body = {
      code: 200,
      success: true,
      message: '登录成功',
      data: {
        accountNumber: result.accountNumber,
        userName: result.userName,
        avatar: `${config.APP_BASE}:${config.APP_PORT}${result.avatar}`,
        introduction: result.introduction,
      }
    }
  } else {
    ctx.body = {
      code: 403,
      success: false,
      message: '账号或密码不正确'
    }
  }
})

/** 获取验证码 */
chatControllers.get('/captcha', (ctx, next) => {
  const captcha = svgCaptcha.create({
    size: 4, //验证码长度
    noise: 3, //干扰线条数目
    width: 120, //宽度
    height: 32, //高度
    ignoreChars: '0oO1ilI', // 验证码字符中排除 0o1i
    inverse: false, // 翻转颜色
    fontSize: 45, // 字体大小
    color: true, // 验证码字符颜色（需设置背景色）
    background: '#ccc', // 背景
  });
  captchaText = captcha.text

  if (!captcha.text) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      success: false,
      message: '获取数据失败'
    }
  } else {
    ctx.body = {
      code: 200,
      success: true,
      message: '获取数据成功',
      data: captcha.data
    }
  }
})

/** 注册 */
chatControllers.post('/logon', async (ctx, next) => {
  let { password, accountNumber, userName, captcha } = ctx.request.body

  if (captcha.toLowerCase() == captchaText.toLowerCase()) {
    let res = await chatServices.findNumber({ accountNumber })

    if (res) {
      ctx.body = {
        code: 403,
        message: '此账号已注册',
        success: false,
      }
    } else {
      await chatServices.logon({ password, accountNumber, userName })
      ctx.body = {
        code: 200,
        message: '注册成功',
        success: true,
      }
    }

  } else {
    ctx.body = {
      code: 403,
      message: '验证码错误',
      success: false,
      data: {}
    }
  }
})

module.exports = chatControllers