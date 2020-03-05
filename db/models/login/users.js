const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new Schema({
  token: {
    type: String,
    required: true
  },
  expire_in: {
    type: Date,
    default: Date.now,
    required: true
  },
  try_times: {
    type: Number,
    default: 0,
    required: true
  }  
})

module.exports = mongoose.model('Users', usersSchema)