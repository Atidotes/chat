const Router = require('koa-router')
const chatControllers = require('../../controllers/web/chatControllers')
const userControllers = require('../../controllers/web/userControllers')

const chatRouter = new Router()

chatRouter.use('/web/api', chatControllers.routes(), chatControllers.allowedMethods())
chatRouter.use('/web/api/user', userControllers.routes(), userControllers.allowedMethods())

module.exports = chatRouter