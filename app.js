require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogs')

const app = express()

const mongoUrl = config.MONGODB_URI

logger.info('connecting to', mongoUrl)
mongoose.connect(mongoUrl)
  .then(() => {
    logger.info('Connected to db')
  })
  .catch((error) => {
    logger.error('Not connected:', error)
  })

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app