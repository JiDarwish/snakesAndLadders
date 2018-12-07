const messageTypes = require('./public/javascripts/messageTypes')
const Player = require('./models/Player')

function rollDice(game) {
  const player = game.whosTurn

  const diceGotten = Math.floor(Math.random() * 6) + 1

  game.handleNextMovement(player, diceGotten)

  if (game.checkGameEnded()) {
    const winner = game.checkGameEnded()

    broadCasToPlayers(game, {
      type: messageTypes.END_GAME,
      content: {
        winner: winner.name
      }
    })
    return // stop execution sothat it does not change turns
  } else {
    broadCasToPlayers(game, {
      type: messageTypes.MOVE_PIN,
      content: {
        newPos: player.currentPos,
        playersName: player.name,
        diceVal: diceGotten
      }
    })
  }

  // NOW CHECK FOR THE SNAKE OR LADDER THING But wait for a while for the animation to take effect
  const oldVal = player.currentPos
  setTimeout(() => {
    if (game.checkIfStoppedOnSnakeOrLadder(player)) {
      broadCasToPlayers(game, {
        type: messageTypes.MOVE_PIN,
        content: {
          newPos: player.currentPos,
          playersName: player.name,
          diceVal: oldVal > player.currentPos ? 'snake' : 'ladder'
        }
      })
    }
  }, 1000)

  changeTurns(game)
}

function changeTurns(game) {
  game.changeTurn()
  sendToSocket(game.whosTurn.socket, { type: messageTypes.TURN_CHANGE })
  broadCasToPlayers(game, {
    type: messageTypes.BROADCAST_TURN,
    content: { playerName: game.whosTurn.name }
  })
}

function addPlayerToGame(game, playerName, ws) {
  game.addPlayer(new Player(playerName, ws))

  // broad cast the new names
  const playersNamesMsg = {
    type: messageTypes.PLAYER_NAMES,
    content: {
      playerA: game.playerA.name,
      playerB: game.playerB ? game.playerB.name : null
    }
  }

  broadCasToPlayers(game, playersNamesMsg)

  // if both player are there initiate game
  if (game.hasTwoConnectedPlayers()) {
    broadCasToPlayers(game, { type: messageTypes.START_GAME })
    game.startTime = Date.now()
    changeTurns(game)
  }
}

function sendToSocket(ws, msg) {
  ws.send(JSON.stringify(msg))
}

function broadCasToPlayers(game, msg) {
  game.playerA.socket.send(JSON.stringify(msg))
  if (game.playerB) {
    game.playerB.socket.send(JSON.stringify(msg))
  }
}

module.exports = {
  rollDice,
  addPlayerToGame
}
