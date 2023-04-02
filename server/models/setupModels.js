/**
 * 设置模型
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const setupType = {
  accountNumber: Number, // 用户账号
  userID: String, // 用户ID
  postbox: String, // 用户邮箱
}

const setupModel = mongoose.model('setup', new Schema(setupType))

module.exports = setupModel