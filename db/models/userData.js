const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
  wordId: {
    type: String,
    required: true
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  nextDate: {
    type: Date,
    default: Date.now
  },
  reviewTimes: {
    type: Number,
    default: -1
  },
  state: {
    type: Number,
    default: 0
    //0: 未背； 1：已背； 2：已掌握
  }

})

const dataSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  bookName: {
    type: String,
    require: true,
    default: "common"
  },
  book: [bookSchema]

})


module.exports = mongoose.model('UserData', dataSchema)