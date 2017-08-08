'use strict'

const express = require('express')
const app = express()

var requestTime = (req, res, next) => {
  req.requestTime = Date.now()
  console.log("Time: " + Date.now())
  next()
}
app.use(requestTime)

// function errorHandler (err, req, res, next) {
//   if (res.headersSent) {
//     return next(err)
//   }
//   res.status(500)
//   res.render('error', { error: err })
// }
// app.use(errorHandler)

app.get('/', (req, res) => {
  res.send({"value": "It's gucci two times!"})
})

app.post('/test', (req, res) => {
  res.send({"that": "was a success"})
})

app.listen(3000, () => {
  console.log('Example app listening on 3000!')
})
