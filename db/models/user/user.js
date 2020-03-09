const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new Schema({
  nickname: {
    type: String,
    default: 'MEOW用户'
  },
  avatar: {
    type: String,
    default: '/public/img/avatar-default.png'
  },
  star_coin: {
    type: Number,
    default: 10,
    required: true
  },
  book_id: {
    type: String
  },
  book_list: {
    type: Array,
    default: [] //bookId, bookName, createDate, wordsCount
  },  
  sign_days: { //连续签到天数
    type: Number,
    default: 0
  }, 
  permission: {
    type: Number,
    default: 1,
    required: true
  },
  last_login_time: {
    type: Date,
    default: Date.now
  },
  register_time: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Users', usersSchema)