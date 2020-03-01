const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },  
  password: {
    type: String,
    required: true
  },
  register_time: {
    type: Date,
    default: Date.now
  },
  last_login_time: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: '/public/img/avatar-default.png'
  },
  sign_in_days: {
    type: Number,
    default: 1
  }
})

module.exports = mongoose.model('User', userSchema)