// @flow
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const payment = require('./routes/payment')
const helmet = require('helmet')
const cors = require('cors')
const {logger} = require('./util/logger')
const error = require('./error/error')

const app = express()

app.use(helmet())
app.use(compression())
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.options('*', cors())
app.use('/api/v1/payment', payment)

// catch 404 and forward to error handler
app.use(function (req, res, next: express$NextFunction) {
  next(new error.ResourceNotFoundError(req))
})

// error handler
app.use(function (err, req, res, next: express$NextFunction) {
  let e = null
  if (err && err instanceof error.BaseError) {
    logger.warn('known error - %s', err)
    e = err
  } else {
    logger.error('unknown server error - %s', err)
    e = new error.UnknownServerError(err.toString())
  }
  res.status(e.statusCode).json(e.toJson())
})

module.exports = app
