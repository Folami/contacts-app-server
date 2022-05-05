const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const contactsRouter = require('./controllers/contacts')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const morgan = require('morgan')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(morgan('tiny'))

app.use('/api/persons', contactsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app