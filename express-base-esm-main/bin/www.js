/**
 * Module dependencies.
 */

import app from '../app.js'
import debugLib from 'debug'
import http from 'http'
const debug = debugLib('node-express-es6:server')
import { exit } from 'node:process'
import WebSocket, { WebSocketServer } from 'ws'

// 導入dotenv 使用 .env 檔案中的設定值 process.env
import 'dotenv/config.js'
// import { isArray } from 'lodash'

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '6005')
app.set('port', port)

/**
 * Create HTTP server.
 */

var server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}

const wss = new WebSocketServer({ port: 8080 })

const clients = {}
const wc = []
const usernames = []
wss.on('connection', (connection) => {
  console.log('新使用者已經連線', connection)

  connection.on('message', (message) => {
    console.log(`收到訊息=> ${message}`)
    const parsedMessage = JSON.parse(message)
    if (parsedMessage.type === 'register') {
      const userId = parsedMessage.userId
      const userImage = parsedMessage.userImage
      console.log('boom', userId)
      const fromName = parsedMessage.userName
      console.log('看一下姓名', fromName)
      // clients[userId].userID = connection
      wc[userId.userID] = connection
      // console.log('不合理', wc[targetUserId])
      connection.userId = userId
      console.log('檢查現在要傳的內容', connection)
      // clients[fromName] = connection

      // usernames.push(userId)
      let isUser = false
      usernames.forEach((user) => {
        if (user.userID === userId.userID) {
          isUser = true
        }
      })
      console.log('tttt', isUser)
      if (!isUser) {
        const newUser = {
          ...userId,
          messages: [],
        }
        usernames.push(newUser)
      }
      console.log(usernames)
      connection.userId = userId
      // connection.fromName = fromName
      // connection.userImage = userImage
      // console.log('新使用者已經連線', connection.userId)
      // console.log('新使用者已經連線', connection.fromName)
      const otherClients = Object.keys(clients)
      console.log('兩個資料後')
      // connection.userName = usernames
      const otherNames = usernames
      const newUserID = userId.userID
      console.log('otherNames', otherNames)
      // console.log('0660', client)
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'registered',
              newUserID,
              otherClients,
              otherNames,
            })
          )
        }
      })
      return
    }
    if (parsedMessage.type === 'message') {
      console.log('parsedMessage.targetUserId', parsedMessage.targetUserId)
      const targetUserId = parsedMessage.targetUserId
      const fromID = parsedMessage.fromID
      const fromName = parsedMessage.fromName
      if (!targetUserId) {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'message',
                message: parsedMessage.message,
                fromName,
                fromID,
              })
            )
          }
        })
      } else {
        // const targetClient = parsedMessage.targetUserId
        // const fromID = parsedMessage.fromID
        const targetClientt = wc[targetUserId]
        // console.log('不合理', wc[userId])
        console.log('很煩', targetClientt)
        console.log('很煩2', parsedMessage.fromID)
        if (targetClientt && targetClientt.readyState === WebSocket.OPEN) {
          console.log('有沒有opne', targetClientt.readyState === WebSocket.OPEN)

          targetClientt.send(
            JSON.stringify({
              type: 'message',
              message: parsedMessage.message,
              fromName,
              fromID,
              private: true,
            })
          )
        }
      }
    }
  })
  connection.on('close', () => {
    console.log('使用者已經斷開連線')
    let dsID = connection.userId
    if (connection.userId) {
      delete clients[connection.userId]
    }
    const otherClients = Object.keys(clients)
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: 'disconnected',
            otherClients,
            disconnectedId: dsID,
          })
        )
      }
    })
  })
})
