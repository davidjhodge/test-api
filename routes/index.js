const users = require('./user.js')
const comments = require('./comments.js')

module.exports = (app) => {
  app.use('/users', users)
  app.use('/comments', comments)
}
