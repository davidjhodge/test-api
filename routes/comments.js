const Router = require('express-promise-router')
const router = new Router()
module.exports = router

const db = require('../db')

router.get('/', (req, res, next) => {
  db.query('SELECT NOW() as now', (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows[0])
  })
})
