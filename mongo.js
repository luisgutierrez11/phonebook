const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://luisgut11jm:${password}@cluster0.l0eq8.mongodb.net/personsApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

if(process.argv.length>3){
    person.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
} else{
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(p => {
            console.log(p.name, p.number)
        })
        mongoose.connection.close()
    })
}


