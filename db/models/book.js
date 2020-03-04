const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
  bookName: {
    type: String,
    required: true
  },
  wordsId: {
    type: Array
  }

})


module.exports = mongoose.model('books', bookSchema)