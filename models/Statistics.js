function Statistics() {
  this.totalGames = 0
  this.totalPlayers = 0
  this.avgTime = null
}

Statistics.prototype.calcAvg = function(games) {
  const durations = []
  if (games.length === 0) {
    return
  }
  for (const game of games) {
    console.log(
      'game with start time ' +
        game.startTime +
        ', and end time ' +
        game.endTime
    )
    const duration = Math.floor((game.endTime - game.startTime) / 1000) // to get seconds instead of millis
    durations.push(duration)
  }

  const numDurations = durations.length
  const sumDurations = durations.reduce((acc, val) => acc + val, 0)
  this.avgTime = Math.floor(sumDurations / numDurations)

  console.log('calculating the avg duration ')
  console.log(games)
  console.log(durations)
  console.log(sumDurations)
}

module.exports = new Statistics()
