const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 本地登录用户表
const userThirdAuth = new Schema({

  opendid: {
    type: String,
    required: true
  },
  login_type: {
    type: String,
    required: true
  },
  access_token: {
    type: String,
    required: true
  }  
})

module.exports = mongoose.model('user_third_auths', userThirdAuth)