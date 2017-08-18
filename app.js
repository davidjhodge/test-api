'use strict'

const express = require('express')
const mountRoutes = require('./routes')
const applyMiddleware = require('./middlewares')

const app = express()
mountRoutes(app)
applyMiddleware(app)

app.listen(3000, () => {
  console.log('Now listening at http://localhost:3000/.')
})
