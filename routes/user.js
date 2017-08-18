const Router = require('express-promise-router')
const router = new Router()
module.exports = router

const bcrypt = require('bcrypt');
const db = require('../db')

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id])
  res.send(rows[0])
})

// Create User
router.post('/create', async(req, res) => {
  req.checkBody('username', 'Please provide a valid username.').notEmpty().isAlphanumeric();
  req.checkBody('password', 'Please enter a password.').notEmpty().isAlphanumeric();

  try {
    const passwordHash = await(bcrypt.hash(req.body.password, 10))

    // Insert User into database
    const result = await db.query(
      'INSERT INTO users (username, password, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP);',
      [req.body.username, passwordHash]
    )
    // Retrieve user object out of database
    const { rows } = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [req.body.username]
    )
    const user = rows[0];
    delete user["password"]
    res.send(user)
  } catch (e) {
    res.status(500).send({ "error": e.name, "message": e.message })
  }
})

// Login User
router.post('/login', async(req, res) => {
  req.checkBody('username', 'Please provide a valid username.').notEmpty().isAlphanumeric();
  req.checkBody('password', 'Please enter a password.').notEmpty().isAlphanumeric();

  try {
    // Retrieve user object out of database
    const { rows } = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [req.body.username]
    )
    const user = rows[0];

    const passwordMatchStatus = await bcrypt.compare(req.body.password, user.password)
    if (passwordMatchStatus == false) {
      throw new Error("The password you entered did not match our records.")
    } else {
      delete user["password"]
      res.send(user)
    }
  } catch (e) {
    res.status(500).send({ "error": e.name, "message": e.message })
  }
})

// Delete User
router.delete('/:id', async(req, res) => {
  req.checkParams('id', 'That user id is not valid.').notEmpty().isAlphanumeric();

  try {
    const result = await db.query(
      'DELETE FROM users WHERE id = $1',
      [req.params.id]
    )
    res.send(result.rows)
  } catch (e) {
    res.status(500).send({ "error": e.name, "message": e.message })
  }
})
