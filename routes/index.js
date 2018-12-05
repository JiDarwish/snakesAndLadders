const { Router } = require('express')
const router = Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('splash')
})

/* GET game page. */
router.get('/game', (req, res, next) => {
  const { referer } = req.headers
  if (referer && referer.startsWith('http://localhost:3000/')) {
    res.render('game')
  } else {
    res.render('splash', {
      error: 'Please enter the game by filling your name!'
    })
  }
})

// /* Register player. */
// router.post('/register_player', (req, res, next) => {
//   const { playerName } = req.body
//   if (!req.cookies['gameToken']) {
//     res.cookie('gameToken', 'player=' + playerName, {
//       httpOnly: true,
//       maxAge: 90000000
//     })
//   }

//   res.redirect('/game')
// })

module.exports = router
