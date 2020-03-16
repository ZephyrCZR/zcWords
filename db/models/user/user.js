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
  duration: { //连续签到时间，未实现该功能
    type: Number,
    default: 0
  }
})

const configSchema = new Schema({
  numbers: {
    type: Number,
    min: 10, max: 30,
    default: 20   
  },
  auto_audio: {
    type: Boolean,
    default: false
  },
  is_kk: {
    type: Boolean,
    default: false
  },
  isHold: {
    type: Boolean,
    default: false
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
  config: {
    type: {configSchema},
    default: {
      numbers: 20,
      auto_audio: false,
      is_kk: false,
      isHold: false
    }
  },
  calendar:{
    type: [recordSchema],
    default: undefined
  } 

})

module.exports = mongoose.model('Users', usersSchema)