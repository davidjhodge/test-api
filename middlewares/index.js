const express = require('express'),
  bodyParser = require('body-parser'),
  expressValidator = require('express-validator'),
  logger = require('morgan'),
  errorHandler = require('./error.js');

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(expressValidator())
  app.use(logger('combined'))
  app.use(errorHandler)
  // Enable static server for public folder
  app.use(express.static('public'))
}
