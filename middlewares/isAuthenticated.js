const jwt = require('jsonwebtoken')
const secret = require('../secret')
const db = require('../db')

const isAuthenticated = (req, res, next) => {
  // Determine if user is authenticated
  if (!req.headers.authorization) {
    return res.status(401).send({ "Error": "User is not authorized."})
  }

  // Get token value from the authorization header
  // An example value may come in the format "Bearer <Token>"
  const token = req.headers.authorization.split(" ").slice(-1)[0]

  return jwt.verify(token, secret, (err, decodedSub) => {
    // If error, the token is invalid
    if (err) { res.status(401).end() }

    const username = decodedSub

    const sendResponse = async() => {
      // TODO Check if user is a valid user
      try {
        const result = await db.query(
          'SELECT id, username, created_at FROM users WHERE username = $1',
          [username]
        )
        const user = result.rows[0]
        if (result && user) {
          res.send(user)
        } else {
          // If http error or user does not exist, throw 401
          res.status(404).send({ "error": "User not found", "message": "The user was not found in the database." })
        }
      } catch(e) {
        res.status(500).send({ "error": e.name, "message": e.message })
      }
    }
    sendResponse()
  })
}
module.exports = isAuthenticated
