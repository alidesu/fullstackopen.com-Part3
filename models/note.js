const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const url = process.env.MONGODB_URI; // Correct the variable name here
console.log('connecting to', url);

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength:3,
    required:true
  },   // Corrected field name from 'content' to 'name'
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Custom validation logic using a regular expression
        // The regular expression ensures that the format is as specified
        return /^[0-9]{2,3}-[0-9]+$/.test(value);
      },
      message: 'Invalid phone number format (correct: "040-22334455") (incorrect: "1234556")',
    },
  }, // Corrected field name from 'number' to 'number'
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);






