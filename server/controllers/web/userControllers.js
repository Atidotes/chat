const Router = require('koa-router')
const userServices = require('../../services/web/userServices')
const multer = require('@koa/multer');
const path = require('path')
const config = require('../../env.config')
const JWT = require('../../util/JWT')

const userControllers = new Router()

/** 上传配置 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../assets/avatar'))
  },
})
const upload = multer({ storage })

userControllers.post('/upload', upload.single('file'), async (ctx, next) => {
  const { userName, introduction } = ctx.request.body

  const token = ctx.headers['authorization'].split(' ')[1]
  const analysis = JWT.verify(token)
  const avatar = ctx.file ? `/avatar/${ctx.file.filename}` : false

  await userServices.upload({
    _id: analysis._id,
    userName,
    avatar,
    introduction,
  })

  if (avatar) {
    ctx.body = {
      code: 200,
      message: '保存成功',
      success: true,
      data: {
        accountNumber: analysis.accountNumber,
        userName,
        avatar: `${config.APP_BASE}:${config.APP_PORT}${avatar}`,
        introduction,
      }
    }
  } else {
    ctx.body = {
      code: 200,
      message: '保存成功',
      success: true,
      data: {
        accountNumber: analysis.accountNumber,
        userName,
        introduction,
      }
    }
  }
})

module.exports = userControllers