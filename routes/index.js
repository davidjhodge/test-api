const users = require('./user.js')
const comments = require('./comments.js')
const posts = require('./posts.js')

module.exports = (app) => {
  app.use('/users', users)
  app.use('/comments', comments)
  app.use('/posts', posts)
}
