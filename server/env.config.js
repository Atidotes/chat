const dotenv = require('dotenv')
const path = require('path')
const os = require('os')

/**
 * 判断当前的环境
 */
switch (os.type()) {
  case 'Windows_NT':
    dotenv.config({ path: path.join(__dirname, '.env.development') })
    dotenv.config({ path: path.join(__dirname, '.env') })
    break;
  default:
    dotenv.config({ path: path.join(__dirname, '.env.production') })
    dotenv.config({ path: path.join(__dirname, '.env') })
    break;
}

/** 暴露env变量 */
module.exports = {
  ...process.env
}