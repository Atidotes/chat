const Router = require('koa-router')
const setupServices = require('../../services/web/setupServices')
const JWT = require('../../util/JWT')
const { sendEmail } = require('../../util/emailCode')
const env = require('../../env.config')

const setupControllers = new Router()
let emailCaptcha = ''

/** 发送验证码 */
setupControllers.post('/postbox', async (ctx, next) => {
  const { postbox } = ctx.request.body
  /** 查找邮箱是否存在 */
  const result = await setupServices.findPostbox({ postbox })
  emailCaptcha = Math.floor(Math.random() * 8999) + 1000

  if (!result) {
    const mail = {
      from: `聊天室<${env.APP_MAIL}>验证码`,       //发件邮箱
      subject: "验证码",
      to: `验证码<${postbox}>`,   //收件邮箱
      text: `验证码为：${emailCaptcha}`, //发送内容
    };
    let res = await sendEmail(mail)

    if (res) {
      ctx.body = {
        code: 200,
        message: '发送验证码成功',
        success: true,
      }
    } else {
      ctx.body = {
        code: 400,
        message: '发送验证码失败',
        success: false,
      }
    }
  } else {
    ctx.body = {
      code: 400,
      message: '邮箱已存在',
      success: false,
    }
  }
})

/** 绑定邮箱 */
setupControllers.post('/captcha', async (ctx, next) => {
  const { postbox, captcha } = ctx.request.body
  /** 解密token */
  const token = ctx.headers['authorization'].split(' ')[1]
  const analysis = JWT.verify(token)
  /** 查看绑定邮箱用户是否存在 */
  const res = await setupServices.findPostbox({ accountNumber: analysis.accountNumber })
  const flag = Boolean(res)

  if (emailCaptcha == captcha) {
    await setupServices.postbox({
      accountNumber: analysis.accountNumber,
      userID: analysis._id,
      postbox,
      flag,
    })

    ctx.body = {
      code: 200,
      message: '绑定邮箱成功',
      success: true,
      data: {
        postbox
      }
    }
  } else {
    ctx.body = {
      code: 403,
      message: '绑定邮箱失败',
      success: false,
    }
  }
})

module.exports = setupControllers