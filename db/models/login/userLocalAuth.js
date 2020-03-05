const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 本地登录用户表
const userLocalAuth = new Schema({

  user_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }  
})

module.exports = mongoose.model('user_local_auths', userLocalAuth)