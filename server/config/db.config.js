const mongoose = require('mongoose')

mongoose.set("strictQuery", true)
mongoose.connect("mongodb://127.0.0.1:27017/chat")
mongoose.connection.on("open", () => {
  console.log('数据库连接成功')
}).on('error',()=>{
  console.log('数据库连接异常')
})
