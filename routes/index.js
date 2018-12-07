const { Router } = require('express')
const router = Router()
const statistics = require('../models/Statistics')

function convertToMinAndSec(secs) {
  const newSeconds = secs % 60
  const newMinutes = parseInt(secs / 60, 10)

  seconds.innerText = newSeconds < 10 ? '0' + newSeconds : newSeconds
  minutes.innerText = newMinutes < 10 ? '0' + newMinutes : newMinutes

  return newMinutes + ':' + newSeconds
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('splash', {
    totalPlayers: statistics.totalPlayers,
    totalGames: statistics.totalGames,
    avgGameTime: statistics.avgTime
      ? convertToMinAndSec(statistics.avgTime)
      : 'No data yet'
  })
})

/* GET game page. */
router.get('/game', (req, res, next) => {
  const { referer } = req.headers
  if (
    referer
    // && referer.startsWith('http://localhost:3000/')
  ) {
    res.render('game')
  } else {
    res.render('splash', {
      error: 'Please enter the game by filling your name!',
      totalPlayers: statistics.totalPlayers,
      totalGames: statistics.totalGames,
      avgGameTime: statistics.avgTime
        ? convertToMinAndSec(statistics.avgTime)
        : 'No data yet'
    })
  }
})

module.exports = router
