var requestTime = (req, res, next) => {
  req.requestTime = Date.now()
  console.log("Time: " + Date.now())
  next()
}
module.exports = requestTime
