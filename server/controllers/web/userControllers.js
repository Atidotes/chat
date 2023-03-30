const Router = require('koa-router')
const userServices = require('../../services/web/userServices')
const multer = require('koa-multer');
const path = require('path')
const config = require('../../env.config')
const JWT = require('../../util/JWT')

const userControllers = new Router()

/** 上传图片配置 */
const storageAvatar = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, path.join(__dirname, '../../assets/avatar'))
  },
})

/** 上传音频配置 */
const storageAudio = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, path.join(__dirname, '../../assets/audio'))
  },
})
const uploadAvatar = multer({ storage: storageAvatar })
const uploadAudio = multer({ storage: storageAudio })

/** 上传图片接口 */
userControllers.post('/upload', uploadAvatar.single('file'), async (ctx, next) => {
  const { userName, introduction } = ctx.req.body

  const token = ctx.headers['authorization'].split(' ')[1]
  const analysis = JWT.verify(token)
  const avatar = ctx.req.file ? `/avatar/${ctx.req.file.filename}` : false

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

/** 上传音频接口 */
userControllers.post('/audio', uploadAudio.single('file'), async (ctx, next) => {
  const { audioURL } = ctx.req.body

  const token = ctx.headers['authorization'].split(' ')[1]
  const analysis = JWT.verify(token)
  let audio = ctx.req.file ? `/audio/${ctx.req.file.filename}` : false
  if (audioURL) {
    audio = audioURL ? audioURL : false
  }

  await userServices.audio({
    _id: analysis._id,
    audio,
  })

  if (audio) {
    if (audio === `/audio/${ctx.req.file?.filename}`) {
      ctx.body = {
        code: 200,
        message: '上传成功',
        success: true,
        data: {
          audio:`${config.APP_BASE}:${config.APP_PORT}${audio}`,
        }
      }
    } else {
      ctx.body = {
        code: 200,
        message: '上传成功',
        success: true,
        data: {
          audio,
        }
      }
    }
  } else {
    ctx.body = {
      code: 403,
      message: '没有文件上传',
      success: true,
    }
  }
})


module.exports = userControllers