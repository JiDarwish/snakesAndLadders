function Player(name, socket) {
  this.name = name
  this.currentPos = 1
  this.movementsRecord = []
  this.socket = socket
}

module.exports = Player
