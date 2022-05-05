const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const contactName = process.argv[3]
const contactNumber = process.argv[4]

const url =
  `mongodb+srv://Folami:${password}@cluster0.dqcwl.mongodb.net/contactsApp?retryWrites=true&w=majority`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (contactName && contactNumber) {
    const contact = new Contact({
        name: contactName,
        number: contactNumber,
    })
    contact.save().then(result => {
        console.log('contact saved!')
        console.log('added ', `${contactName}`, `${contactNumber}`,' to phonebook')
    })
}

Contact.find({}).then(result => {
    result.forEach(contact => {
        console.log(contact)
    })
    mongoose.connection.close()
})