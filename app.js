'use strict'

const express = require('express')
const app = express()

// Connect Database
const { Client } = require('pg')

const client = new Client({
  user: 'davidhodge',
  host: 'localhost',
  database: 'davidhodge',
  password: '',
  port: 5432
});
client.connect();

// Middleware
var requestTime = (req, res, next) => {
  req.requestTime = Date.now()
  console.log("Time: " + Date.now())
  next()
}
app.use(requestTime)

const asyncMiddleware = fn =>
(req, res, next) => {
  Promise.resolve(fn(req, res, next))
  .catch(next);
};

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

app.get('/comments', (req, res, next) => {
  client.query('SELECT NOW()', ['Fetched comments!'])
  var rows = res.rows
  if (rows == null || rows.length == 0) {
    rows = []
  }
  res.send({
    "results_count": 1,
    "comments": rows
  })
});

app.post('/test', (req, res) => {
  res.send({"that": "was a success"})
})

app.listen(3000, () => {
  console.log('Example app listening on 3000!')
})
