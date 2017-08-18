const timestamp = require('./timestamp.js');

module.exports = (app) => {
  app.use(timestamp)
}
