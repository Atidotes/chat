const userModel = require('../../models/userModels')

const chatServices= {
  login: ({password,accountNumber}) =>{
    return userModel.findOne({accountNumber,password}) 
  }
}

module.exports = chatServices