const errorHandler = (err, req, res, next) => {
  res.status(500).send({ 'error': err.name, 'message': err.message })
  next()
}
module.exports = errorHandler
