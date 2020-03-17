const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
  book_name: {
    type: String,
    required: true
  },
  book_type: {
    type: String,
    required: true
  },
  describe: {
    type: String,
    default: '作者很懒，什么都没有介绍哦'
  },
  cover_img: {
    type: String,
    default: '/public/img/book-default.png'
  },
  amount: {
    type: Number,
    required: true
  },
  words_id: {
    type: Array
  }

})


module.exports = mongoose.model('books', bookSchema)