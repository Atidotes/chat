const Router = require('koa-router')
const userServices = require('../../services/web/userServices')
const multer = require('koa-multer');
const path = require('path')
const config = require('../../env.config')
const JWT = require('../../util/JWT');

const userControllers = new Router()

/** 上传图片配置 */
const storageAvatar = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, path.join(__dirname, '../../assets/avatar'))
  },
  filename: (req, file, cb) => {
    let fileFormat = (file.originalname).split(".");
    return cb(null, `${Date.now()}-${fileFormat[0]}.${fileFormat[fileFormat.length - 1]}`);
  },
})

/** 上传音频配置 */
const storageAudio = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, path.join(__dirname, '../../assets/audio'))
  },
  filename: (req, file, cb) => {
    let fileFormat = (file.originalname).split(".");
    return cb(null, `${Date.now()}-${fileFormat[0]}.${fileFormat[fileFormat.length - 1]}`);
  },
})
const uploadAvatar = multer({ storage: storageAvatar })
const uploadAudio = multer({ storage: storageAudio })

/** 编辑个人资料 */
userControllers.post('/upload', uploadAvatar.single('file'), async (ctx, next) => {
  const { userName, introduction, gender } = ctx.req.body

  const token = ctx.headers['authorization'].split(' ')[1]
  const analysis = JWT.verify(token)
  const avatar = ctx.req.file ? `/avatar/${ctx.req.file.filename}` : false

  await userServices.upload({
    _id: analysis._id,
    userName,
    avatar,
    introduction,
    gender: Number(gender),
  })

  if (avatar) {
    ctx.body = {
      code: 200,
      message: '保存成功',
      success: true,
      data: {
        gender: Number(gender),
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
        gender: Number(gender),
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
          audio: `${config.APP_BASE}:${config.APP_PORT}${audio}`,
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

/** 修改密码 */
userControllers.post('/changePassword', async (ctx, next) => {
  const { password, newPassword } = ctx.request.body

  const token = ctx.headers['authorization'].split(' ')[1]
  const analysis = JWT.verify(token)

  const result = await userServices.proving({
    accountNumber: analysis.accountNumber,
    password,
  })

  if (result) {
    await userServices.updatePassword({
      accountNumber: analysis.accountNumber,
      password: newPassword,
    })
    ctx.body = {
      code: 200,
      success: true,
      message: '修改密码成功'
    }
  } else {
    ctx.body = {
      code: 403,
      success: false,
      message: '旧密码不正确'
    }
  }
})


module.exports = userControllers