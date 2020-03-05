const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 用户验证关联表
const userAuthRel = new Schema({
  user_id: {
    type: String,
    required: true
  },
  auth_id: {
    type: String,
    required: true
  },
  auth_type: {
    type: String,
    required: true
  }  
})

module.exports = mongoose.model('user_auths_rel', userAuthRel)