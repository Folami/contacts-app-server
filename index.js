require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Contact = require('./models/contact')
const contact = require('./models/contact')


app.use(express.static('build'))
app.use(express.json()) // middeware for parsing application/json
app.use(cors()) // middeware for allowing cross-origin requests
app.use(morgan('tiny'))

let persons = [
    { 'id': 1, 'name': 'Arto Hellas', 'number': '040-123456' },
    { 'id': 2, 'name': 'Ada Lovelace', 'number': '39-44-5323523' },
    { 'id': 3, 'name': 'Dan Abramov', 'number': '12-43-234345' },
    { 'id': 4, 'name': 'Mary Poppendieck', 'number': '39-23-6423122' },
]
let info = `<div><p>Contact List has info of ${persons.length} people</p><p>${new Date()}</p></div>`

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(info)
})

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contacts => {
        response.json(contacts)
    })
})

app.get('/api/persons/:id', (request, response) => {
    /*
   if(mongoose.Types.ObjectId.isValid(request.params.id)) {
    Contact.findById(request.params.id, function (err, doc) {
        if(err) {
            reject(err);
        } else if(doc) {
            resolve({success:true, data:doc});
        } else {
            reject({success:false, data:"no data exist for this id"})
        }
    });
    } else {
        reject({success:"false", data:"Please provide correct id"});
    }*/
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

/*
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const contact = persons.find(contact => {
      console.log(contact.id, typeof contact.id, id, typeof id, contact.id === id)
      return contact.id === id
    })
    console.log(contact)
    response.json(contact)
})
*/
/*
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = persons.find(contact => contact.id === id)

    if (contact) {
        response.json(contact)
    } else {
        response.status(204).end()
    }
})
*/
const max = Number.MAX_SAFE_INTEGER
const generateId = (max) => {
    return Math.floor(Math.random() * max)
}
/*
app.post('/api/persons', (request, response) => {
    const newContact = request.body

    if (!newContact.name || !newContact.number) {
        return response.status(400).json({
            error: 'Name or Number missing'
        })
    }
    if (persons.find(contact => contact.name === newContact.name)) {
        return response.status(400).json({
            error: 'Contact already exists'
        })
    }
    const contact = {
      name: newContact.name,
      number: newContact.number,
      id: generateId(),
    }
    persons = persons.concat(contact)
    response.json(contact)
})
*/
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    }
    const contact = new Contact({
        name: body.name,
        number: body.number,
    })
    contact.save().then(savedContact => {
        response.json(savedContact)
    })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const contact = {
        name: body.name,
        number: body.number,
    }

    Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
        .then(updatedContact => {
            response.json(updatedContact)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Contact.findByIdAndUpdate(request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})
/*
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(contact => contact.id !== id)
  response.status(204).end()
})
*/
app.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const app = require('./app') // the actual Express application
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})