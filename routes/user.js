const Router = require('express-promise-router')
const router = new Router()
module.exports = router

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const secret = require('../secret')
const db = require('../db')

// Create User
/**
 * @api {post} /users/create Create a New User
 * @apiGroup Users
 * @apiParam {String} username Username
 * @apiParam {String} password Password
 * @apiParamExample {json} Input
 *    {
 *      "username": "david.hodge@gmail.com",
 *      "password": "p@ssword123"
 *    }
 * @apiSuccess {Number} id User id
 * @apiSuccess {String} username Username
 * @apiSuccess {String} password Password Hash
 * @apiSuccess {Date} created_at Date Registered
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 9,
 *      "username": "rick@gmail.com",
 *      "password": "password_hash"
 *      "created_at": "2017-08-18T19:41:53.928Z"
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 500 Internal Server Error
 */
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
    const token = jwt.sign(user.username, secret)
    user["access_token"] = token
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
    var user = rows[0];

    const passwordMatchStatus = await bcrypt.compare(req.body.password, user.password)
    if (passwordMatchStatus == false) {
      throw new Error("The password you entered did not match our records.")
    }

    const token = jwt.sign(user.username, secret)

    // Add/Remove fields from User object
    delete user["password"]
    user["access_token"] = token

    res.send(user)
  } catch (e) {
    res.status(500).send({ "error": e.name, "message": e.message })
  }
})

// GET User
router.get('/:id', isAuthenticated, async(req, res) => {
  req.checkParams('id', 'That user id is not valid.').notEmpty().isAlphanumeric()

  try {
    const result = await db.query(
      'SELECT id, username, created_at FROM users WHERE id = $1'
      [req.params.id]
    )
    const user = result.rows[0]
    res.send(user)
  } catch(e) {
    res.status(500).send({ "error": e.name, "message": e.message })
  }
})

// Delete User
router.delete('/:id', async(req, res) => {
  req.checkParams('id', 'That user id is not valid.').notEmpty().isAlphanumeric()

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
