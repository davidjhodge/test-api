const Router = require('express-promise-router')
const router = new Router()
module.exports = router

const db = require('../db')

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id])
  res.send(rows[0])
})
