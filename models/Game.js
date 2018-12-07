const Player = require('./Player')

function Game(gameId) {
  this.playerA = null
  this.playerB = null
  this.id = gameId
  this.gameState = '0_JOINT'
  this.startTime = null
  this.endTime = null
  this.whosTurn = null
}

Game.prototype.gameStatusses = {
  '0_JOINT': '0_JOINT',
  '1_JOINT': '1_JOINT',
  '2_JOINT': '2_JOINT',
  A_WON: 'A_WON',
  B_WON: 'B_WON',
  ABORTED: 'ABORTED'
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
  19: 38,
  45: 63,
  50: 69,
  66: 87,
  81: 98
}

// All the statusses are from the gameStatusses obj
Game.prototype.isValidState = function(newState) {
  return newState in this.gameStatusses
}

Game.prototype.setState = function(newState) {
  console.assert(
    typeof newState == 'string',
    '%s: Expecting a string, got a %s',
    arguments.callee.name,
    typeof w
  )

  // Check if it's a valid state before setting it
  if (
    this.isValidState(newState)
    // this.isValidStateTransition(newState) // TODO keep or throw away
  ) {
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

  if (this.gameState === this.gameStatusses['0_JOINT']) {
    this.playerA = newPlayer
    this.setState(this.gameStatusses['1_JOINT'])
  } else if (this.gameState === this.gameStatusses['1_JOINT']) {
    this.playerB = newPlayer
    this.setState(this.gameStatusses['2_JOINT'])
  } else {
    console.log('Cannot add more players man!')
  }
}

Game.prototype.hasTwoConnectedPlayers = function() {
  return this.gameState === this.gameStatusses['2_JOINT']
}

Game.prototype.canIJoinGame = function() {
  return (
    this.gameState === this.gameStatusses['0_JOINT'] ||
    this.gameState === this.gameStatusses['1_JOINT']
  )
}

Game.prototype.changeTurn = function() {
  this.whosTurn = this.whosTurn === this.playerA ? this.playerB : this.playerA
}

Game.prototype.handleNextMovement = function(player, movementVal) {
  if (typeof movementVal !== 'number') {
    return new Error('Not a numeric movement value')
  }

  player.currentPos += movementVal
  player.movementsRecord.push(movementVal)
  this.checkGameEnded()
}
Game.prototype.checkGameEnded = function() {
  if (!this.playerA || !this.playerB) {
    return false
  }
  if (this.playerA.currentPos >= 100) {
    this.setState(this.gameStatusses.A_WON)
    this.endTime = Date.now()
    return this.playerA
  } else if (this.playerB.currentPos >= 100) {
    this.setState(this.gameStatusses.B_WON)
    this.endTime = Date.now()
    return this.playerB
  }
  return null
}
Game.prototype.checkIfStoppedOnSnakeOrLadder = function(player) {
  if (player.currentPos in this.snakes) {
    // calc the value of the movement
    const movementVal = this.snakes[player.currentPos] - player.currentPos
    // record it
    player.movementsRecord.push('Snake =' + movementVal)
    // move pos of player
    this.handleNextMovement(player, movementVal)
    return true
  } else if (player.currentPos in this.ladders) {
    // calc the value of the movement
    const movementVal = this.ladders[player.currentPos] - player.currentPos
    // record it
    player.movementsRecord.push('Ladder +' + movementVal)
    this.handleNextMovement(player, movementVal)
    return true
  }
  return false // it didn't stop on a snake neither a ladder
}

Game.prototype.isGameStillActive = function() {
  return (
    this.gameState === this.gameStatusses['0_JOINT'] ||
    this.gameState === this.gameStatusses['1_JOINT'] ||
    this.gameState === this.gameStatusses['2_JOINT']
  )
}

module.exports = Game
