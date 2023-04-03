const userModel = require('../../models/userModels')

const userServices = {
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
  audio: ({ _id, audio }) => {
    if (audio) {
      return userModel.updateOne({ _id }, {
        audio,
      })
    }
  }
}

module.exports = userServices