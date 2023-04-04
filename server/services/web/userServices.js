const userModel = require('../../models/userModels')

const userServices = {
  /** 上传头像 */
  upload: ({ _id, userName, accountNumber, avatar, introduction, gender }) => {
    if (avatar) {
      return userModel.updateOne({ _id }, {
        userName, accountNumber, avatar, introduction, gender,
      })
    } else {
      return userModel.updateOne({ _id }, {
        userName, accountNumber, introduction, gender,
      })
    }
  },

  /** 上传音频 */
  audio: ({ _id, audio }) => {
    if (audio) {
      return userModel.updateOne({ _id }, {
        audio,
      })
    }
  },

  /** 查找密码是否正确 */
  proving: ({ accountNumber, password }) => {
    return userModel.findOne({
      accountNumber, password,
    })
  },

  /** 修改密码 */
  updatePassword: ({ accountNumber, password }) => {
    return userModel.updateOne({
      accountNumber, password
    })
  }
}

module.exports = userServices