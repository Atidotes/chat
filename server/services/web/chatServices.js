const userModel = require('../../models/userModels')

const chatServices = {
  /** 登录 */
  login: ({ password, accountNumber }) => {
    return userModel.findOne({ accountNumber, password })
  },

  /** 查找账号是否存在 */
  findNumber: ({ accountNumber }) => {
    return userModel.findOne({ accountNumber })
  },

  // /** 注册 */
  logon: ({ password, accountNumber, userName }) => {
    return userModel.create({ password, accountNumber, userName })
  }
}

module.exports = chatServices