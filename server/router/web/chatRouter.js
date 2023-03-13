const Router = require('koa-router')
const chatControllers = require('../../controllers/web/chatControllers')
const chatRouter = new Router()

chatRouter.use('/web/api', chatControllers.routes(),chatControllers.allowedMethods())

module.exports = chatRouter