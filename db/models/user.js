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
  sign_in_days: { //连续签到天数
    type: Number,
    default: 1
  },
  num_per_group: { //每组单词数
    type: Number,
    required: true,
    default: 20,
    min: 10,
    max: 30,
  },
  auto_voice: { //自动发声
    type: Boolean,
    default: true
  },
  background_img: { //背景图片
    type: String,
    default: "/public/img/bg-default.jpg"
  }

})

module.exports = mongoose.model('User', userSchema)