function Player(name, gameId) {
  this.name = name
  this.currentPos = 1
  this.gameId = gameId
  this.movementsRecord = []
}

module.exports = Player
