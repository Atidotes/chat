const mongoose = require('mongoose')
const config = require('../env.config')

mongoose.set("strictQuery", true)
mongoose.connect(`mongodb:${config.APP_MONGODB}/chat`)
mongoose.connection.on("open", () => {
  console.log('数据库连接成功')
}).on('error',()=>{
  console.log('数据库连接异常')
})
