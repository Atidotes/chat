const Nodemailer = require('nodemailer')
const env = require('../env.config')

const config = {
  host: "smtp.qq.com",
  port: 465,
  secureConnection: true,
  service: "qq",
  auth: {
    user: env.APP_MAIL,    //发件账号
    pass: env.APP_KEY,     //发件邮箱授权码
  },
}

const transport = Nodemailer.createTransport(config);

const sendEmail = async (mail) => {
  return new Promise((resolve, reject) => {
    transport.sendMail(mail, (err, info) => {
      if (!err) {
        resolve(true);
      } else {
        resolve(false)
      }
    });
  })
}

module.exports = {
  sendEmail,
}
