const setupModel = require('../../models/setupModels')

const setupServices = {
  /** 查找邮箱是否存在 */
  findPostbox: ({ postbox, accountNumber }) => {
    if (accountNumber) {
      return setupModel.findOne({ accountNumber })
    } else {
      return setupModel.findOne({ postbox })
    }
  },

  /** 绑定邮箱号 */
  postbox: ({ postbox, accountNumber, userID, flag }) => {
    if (flag) {
      return setupModel.updateOne({
        accountNumber,
        userID,
        postbox,
      })
    } else {
      return setupModel.create({
        accountNumber,
        userID,
        postbox,
      })
    }
  }
}

module.exports = setupServices