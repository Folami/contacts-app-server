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

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

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

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
app.use(express.static('build'))

const today = new Date()
const timestamp = today.getTime()
const standardTime = new Date(parseInt(timestamp)).toUTCString()
let info = `<p>Contacts list has info for ${contacts.length} contacts</p>
                <p>${standardTime}</p>`

app.get('/', (request, response) => {
    response.send('<h1>Hello Contacts!</h1>')
})

app.get('/api/contacts', (request, response) => {
    response.json(contacts)
})

app.get('/info', (request, response) => {
    /*
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    var dateTime = date+' '+time
    console.log(dateTime)
    */
    response.send(info)
})

app.get('/api/contacts/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id)
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/contacts/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = Number.MAX_SAFE_INTEGER
    function getRandomInt(max) {
        return Math.floor(Math.random() * max)
    }
    return getRandomInt(maxId)
}

app.post('/api/contacts', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if (contacts.includes(body.name)) {
        return response.status(400).json({
            error: 'contact already exists'
        })
    }

    const contact = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    contacts = contacts.concat(contact)
    response.json(contact)
})

morgan('tiny')
/*
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
*/
const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})