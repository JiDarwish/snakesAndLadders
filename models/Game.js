const Player = require('./Player')

function Game(gameId) {
  this.playerA = null
  this.playerB = null
  this.id = gameId
  this.gameState = 0
  this.startTime = new Date()
  this.endTime = null
}

Game.prototype.gameStatusses = {
  '0JOINT': 0,
  '1JOINT': 1,
  '2JOINT': 2,
  A: 3,
  B: 4,
  ABORTED: 5
}

Game.prototype.snakes = {
  93: 90,
  83: 76,
  62: 41,
  54: 35,
  14: 5
}

Game.prototype.ladders = {
  9: 28,
  15: 38,
  45: 63,
  50: 69,
  66: 87,
  81: 98
}

// All the statusses are from the gameStatusses obj
Game.prototype.isValidState = function(newState) {
  return newState in Game.prototype.gameStatusses
}

// If the transition is from 2JOINT to 0JOINT then something weird have happend
Game.prototype.isValidStateTransition = function(newState) {
  return this.gameStatusses[newState] < this.gameStatusses[this.gameState]
}

Game.prototype.setState = function(newState) {
  console.assert(
    typeof newState == 'string',
    '%s: Expecting a string, got a %s',
    arguments.callee.name,
    typeof w
  )

  // Check if it's a valid state before setting it
  if (this.isValidState(newState) && this.isValidStateTransition(newState)) {
    this.gameState = newState
  } else {
    return new Error(
      'Impossible status change from %s to %s',
      this.gameState,
      newState
    )
  }
}

Game.prototype.addPlayer = function(newPlayer) {
  console.assert(
    newPlayer instanceof Player,
    '%s: Expecting a player (WebSocket), got a %s',
    arguments.callee.name,
    typeof newPlayer
  )

  if (this.gameState != '0 JOINT' && this.gameState != '1 JOINT') {
    return new Error(
      'Invalid call to addPlayer, current state is %s',
      this.gameState
    )
  }

  // try doint this if it throw an error then second player is joining not the first
  const error = this.setStatus('1 JOINT')
  if (error instanceof Error) {
    this.setStatus('2 JOINT')
  }

  if (this.playerA == null) {
    this.playerA = newPlayer
    return 'A'
  } else {
    this.playerB = newPlayer
    return 'B'
  }
}

Game.prototype.hasTwoConnectedPlayers = function() {
  return this.gameState == '2JOINT'
}

Game.prototype.handleNextMovement = function(player, movementVal) {
  if (typeof movementVal !== 'number') {
    return new Error('Stop trying to cheat and play fairly ok?')
  }

  player.currentPos += movementVal
  player.movementsRecord.push(movementVal)
  this.checkIfStoppedOnSnakeOrLadder(player)
}

Game.prototype.checkIfStoppedOnSnakeOrLadder = function(player) {
  if (player.currentPos in this.snakes) {
    player.movementsRecord.push(
      'Snake -' + player.currentPos - this.snakes[player.currentPos]
    )
    player.currentPos = this.snakes[player.currentPos]
  } else if (player.currentPos in this.ladders) {
    player.movementsRecord.push(
      'Ladder +' + this.ladders[player.currentPos] - player.currentPos
    )
    player.currentPos = this.ladders[player.currentPos]
  }
}
