const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const Websocket = require('ws')
const http = require('http')

const indexRouter = require('./routes/index')
const Game = require('./models/Game')
const statistics = require('./models/Statistics')
const messageTypes = require('./public/javascripts/messageTypes')
const gameHandlers = require('./gameHandlers')
const app = express()

const port = process.env.PORT || 3000

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
const webSockets = {} // websocket -> game
let gameId = 0

wss.on('connection', ws => {
  // join the game if not yet joined && add new statistics data
  handleNewConnection()

  ws.on('close', m => {
    statistics.totalPlayers--
    console.log('Another player left!')
  })

  ws.on('message', m => {
    const msg = JSON.parse(m)
    const game = webSockets[ws.id] // game conserning the current connection (if exists)

    if (game.checkGameEnded()) {
      return
    }
    switch (msg.type) {
      case messageTypes.THROW_DICE:
        gameHandlers.rollDice(game)
        break
      case messageTypes.ADD_PLAYER:
        gameHandlers.addPlayerToGame(game, msg.content, ws)
        break
      case messageTypes.PLAYER_LEFT:
        const playerWhoJustLeft =
          game.playerA.socket === ws ? game.playerA : game.playerB

        // TODO
        console.log('A DAMN PLAYER HAS JUST LEFT! ' + playerWhoJustLeft.name)
        break
      default:
        console.log('default hit')
    }
  })

  function handleNewConnection() {
    // 1. Adding user to a game
    if (webSockets[gameId] && webSockets[gameId].canIJoinGame()) {
      ws.id = gameId
    } else {
      const newGame = new Game(++gameId)
      ws.id = gameId
      webSockets[gameId] = newGame
    }

    const activeGames = Object.values(webSockets).filter(game =>
      game.isGameStillActive()
    )
    console.log('here')
    const inActiveGames = Object.values(webSockets).filter(
      game =>
        !activeGames.includes(game) &&
        game.gameState !== game.gameStatusses.ABORD
    )

    statistics.calcAvg(inActiveGames)
    console.log('length of active games is ', activeGames.length)
    statistics.totalGames = activeGames.length
    statistics.totalPlayers++
  }
})

server.listen(port, console.log)
