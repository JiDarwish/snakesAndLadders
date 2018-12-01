const { Router } = require('express')
const router = Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('splash')
})

/* GET home page. */
router.get('/game', (req, res, next) => {
  res.render('game')
})

module.exports = router
