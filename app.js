const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const Websocket = require('ws')
const http = require('http')

const indexRouter = require('./routes/index')
const Game = require('./models/Game')
const Player = require('./models/Player')
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

const server = http.createServer(app)

const wss = new Websocket.Server({ server })
const webSockets = {}
const connectionId = 0

wss.on('connection', ws => {
  console.log('connected')

  ws.on('message', msg => {
    console.log(JSON.parse(msg))
  })
  // // create a game or add him to the existing game
  // let game = null
  // if (webSockets[connectionId].hasTwoConnectedPlayers()) {
  //   game = new Game(connectionId++)
  //   webSockets[connectionId] = newGame
  // } else {
  //   game = webSockets[connectionId]
  // }
  // const PlayerName = req.cookies['gameToken'].split('=')[1]
  // const newPlayer = new Player(PlayerName, connectionId)
  // newGame.addPlayer(newPlayer)

  // ws.on('throwDice', () => {
  //   ws.emit('diceThrown', { value: Math.floor(Math.random() * 6) + 1 })
  // })
})

server.listen(3000, err => console.log)
