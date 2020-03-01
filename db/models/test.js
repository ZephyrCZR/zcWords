const mongoose = require('mongoose')
const Schema = mongoose.Schema

const testSch = new Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Test', testSch)