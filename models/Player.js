// this is a player object class. it tells all the attributes of the player in the game

function Player(name, socket) {
  this.name = name
  this.currentPos = 1
  this.movementsRecord = []
  this.socket = socket
}

module.exports = Player
