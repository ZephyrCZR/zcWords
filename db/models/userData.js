const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dataSchema = new Schema({
  "userId": {
    type: Number,
    required: true
  },
  "bookName": {
    type: String,
    require: true,
    default: "common"
  },
  "wordId": {
    type: Number,
    required: true
  },
  "nextDate": {
    type: Date
  },
  "reviewTimes": {
    type: Number,
    default: -1
  },
  "state": {
    type: Number,
    default: 0
    //0: 未背； 1：已背； 2：已掌握
  }






})
module.exports = mongoose.model('UserData', dataSchema)