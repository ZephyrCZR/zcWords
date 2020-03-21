const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
  word_id: {
    type: String,
    required: true
  },
  state: {
    type: Number,
    default: 0
    //0: 未背； 1：已背； 2：已掌握
  },
  review_times: {
    type: Number,
    default: -1
  }, 
  first_date: {
    type: String
  },
  next_date: {
    type: String
  }

})

const dataSchema = new Schema({
  book_name: {
    type: String,
    require: true,
    default: "common"
  },
  create_date: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Date,
    default: Date.now
  },
  book: [bookSchema]
})


module.exports = mongoose.model('UserBooks', dataSchema)