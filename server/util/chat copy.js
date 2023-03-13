const JWT = require('./JWT')
const WebSocket = require('ws')
const WebSocketServer = WebSocket.WebSocketServer

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws,req) => {
  const url = new URL(req.url,'http://127.0.0.1:3000')
  const token = url.searchParams.get('token')
  const analysis = JWT.verify(token)

  if(analysis){
    
  }else{

  }


  ws.on('message', (data) => {
    console.log(req.url)
    const msg = JSON.parse(data)
    console.log('%s', msg)



    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: false })
      }
    });
  })
})




