const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
  book_name: {
    type: String,
    required: true
  },
  words_id: {
    type: Array
  }

})


module.exports = mongoose.model('books', bookSchema)