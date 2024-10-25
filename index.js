const express = require('express')
const app = express()
const morgan = require('morgan')

const cors = require('cors')
app.use(cors()) 

app.use(express.static('dist'))

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

// Middlewares

// Mi propio middleware de ejemplo
// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }  
  
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

morgan.token('body', req => {
  return `{"name":"${req.body.name}","number":"${req.body.number}"}`
})

app.use(express.json())
// app.use(requestLogger)
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))


app.get('/', (request, response) => {
    response.send(`<h1>Hello World!!!</h1>`)
    })

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people<br>${Date()}</p>`)
    })
    
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
    response.json(person)
    } else {
    response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => p.id))
      : 0
    return maxId + 1
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
        error: 'info missing' 
        })
    }

    if(persons.find(p => p.name == body.name)){
        return response.status(400).json({ 
            error: 'name must be unique' 
            })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})


app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})