const JWT = require('./JWT')
const { Server } = require('socket.io');
const { createServer } = require("http");

const start = (app) => {
  const httpServer = createServer(app.callback());
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      allowedHeaders: ["token"],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    const { token } = socket.handshake.headers
    if (token !== 'null') {
      const payload = JWT.verify(token)
      if (payload) {
        socket.user = payload
        // 群发在线用户
        sendAll(io)
        socket.on('private-Chat', (msg) => {
          console.log(msg)
          Array.from(io.sockets.sockets).forEach(item => {
            if (item[1].user.accountNumber === msg.to.accountNumber) {
              item[1].emit('private-Chat', { user: item[1].user, data: msg.data })
            }
          })
        })

        socket.on('disconnect', () => {
          sendAll(io)
        })
      } else {
        socket.emit('error', { code: 401, message: 'token过期' })
      }
    } else {
      socket.emit('error', { code: 401, message: 'token无效' })
    }
  })
  httpServer.listen(3030);
}

/** 群发函数 */
const sendAll = (io) => {
  io.sockets.emit('tabulation', {
    message: '连接成功',
    success: true,
    code: 200,
    data: Array.from(io.sockets.sockets).map(item => item[1].user)
  })
}

module.exports = start

