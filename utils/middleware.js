const logger = require('./logger')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtracter = (request, response, next) => {
  const authHeader = request.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract the token part after 'Bearer '
    const token = authHeader.split(' ')[1];
    // Assign the token to req.token
    request.token = token;
  } else {
    // If no Authorization header or not in Bearer format, set req.token to null or handle as error
    request.token = null; 
  }

  next()
}

const userExtracter = (request, response, next) => {
  
  const thisUserId = request.token.id

  request.user = thisUserId
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')){
    return response.status(400).json({ error: 'Please choose a unique username' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtracter,
  userExtracter
}