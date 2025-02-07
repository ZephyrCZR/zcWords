const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 本地登录用户表
const userLocalAuth = new Schema({

  user_name: {
    type: String,
    default: 'MEOW用户'
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  try_times: {
    type: Number,
    default: 0,
    required: true
  },
})

module.exports = mongoose.model('user_local_auths', userLocalAuth)