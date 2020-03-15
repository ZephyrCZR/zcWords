const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema({
  date: {
    type: String,
    default: ''
  },
  clock: {
    type: Boolean,
    default: false
  },
  learn: {
    type: Number,
    default: 0,
  },
  review: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 0
  }
})

const usersSchema = new Schema({
  nickname: {
    type: String,
    default: 'MEOW用户'
  },
  avatar: {
    type: String,
    default: '/public/img/avatar-default.png'
  },
  coin: {
    type: Number,
    default: 110,
    required: true
  },
  book_id: {
    type: String
  },
  book_list: {
    type: Array,
    default: [] //bookId, bookName, createDate, wordsCount
  },
  last_login_time: {
    type: Date,
    default: Date.now
  },
  register_time: {
    type: Date,
    default: Date.now
  },
  calendar: [recordSchema]
})

module.exports = mongoose.model('Users', usersSchema)