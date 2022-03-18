const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
app.use(express.json()) // middeware for parsing application/json
app.use(cors()) // middeware for allowing cross-origin requests
app.use(morgan('tiny'))
app.use(express.static('build'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
let info = `<div><p>Contact List has info of ${persons.length} people</p><p>${new Date()}</p></div>`

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(info)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
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
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = persons.find(contact => contact.id === id)
    
    if (contact) {
        response.json(contact)
    } else {
        response.status(204).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(contact => contact.id !== id)
    response.status(204).end()
})

const max = Number.MAX_SAFE_INTEGER

const generateId = (max) => {
    return Math.floor(Math.random() * max);
}
  
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})