const userModel = require('../../models/userModels')

const userServices = {
  upload: ({ _id, userName, accountNumber, avatar, introduction, }) => {
    if (avatar) {
      return userModel.updateOne({ _id }, {
        userName, accountNumber, avatar, introduction,
      })
    } else {
      return userModel.updateOne({ _id }, {
        userName, accountNumber, introduction,
      })
    }
  },
  audio: ({ _id, audio }) => {
    if (audio) {
      return userModel.updateOne({ _id }, {
        audio,
      })
    }
  }
}

module.exports = userServices