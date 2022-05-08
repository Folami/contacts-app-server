/*
const app = require('./app') // the actual Express application
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})
*/

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
/*
let contacts = [
    {
        'name': 'Arto Hellas',
        'number': '040-123456',
        'id': 1
    },
    {
        'name': 'Ada Lovelace',
        'number': '39-44-5323523',
        'id': 2
    },
    {
        'name': 'Dan Abramov',
        'number': '12-43-234345',
        'id': 3
    },
    {
        'name': 'Mary Poppendieck',
        'number': '39-23-6423122',
        'id': 4
    },
    {
        'name': 'Mikaela Smith',
        'number': '39-23-6427542',
        'id': 5
    }
]
*/
const Contact = require('./models/contact')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.get('/', (request, response) => {
    response.send('<h1>Hello Contacts!</h1>')
})

app.get('/api/contacts', (request, response) => {
    Contact.find({}).then(contacts => {
        response.json(contacts)
    })
})

app.get('/info', (request, response) => {
    /*
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    var dateTime = date+' '+time
    console.log(dateTime)
    */
    Contact.find({}).then(contacts => {
        const today = new Date()
        const timestamp = today.getTime()
        const standardTime = new Date(parseInt(timestamp)).toUTCString()
        let info = `<p>Contacts list has info for ${contacts.length} contacts</p>
                        <p>${standardTime}</p>`
        response.send(info)
    })
})

app.get('/api/contacts/:id', (request, response, next) => {
    Contact.findById(request.params.id)
        .then(contact => {
            if (contact) {
                response.json(contact)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/contacts/:id', (request, response) => {
    Contact.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/contacts', (request, response, next) => {
    const body = request.body
    /*
    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    }
    if (body.number === undefined) {
        return response.status(400).json({ error: 'numbert missing' })
    }
    */
    const contact = new Contact({
        name: body.name,
        number: body.number,
    })

    contact.save().then(savedContact => {
        response.json(savedContact)
    })
        .catch(error => next(error))
})

app.put('/api/contacts/:id', (request, response, next) => {
    const { name, number } = request.body
    Contact.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedContact => {
            response.json(updatedContact)
        })
        .catch(error => next(error))
})

morgan('tiny')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }   else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})