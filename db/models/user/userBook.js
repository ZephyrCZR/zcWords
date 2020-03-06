const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
  wordId: {
    type: String,
    required: true
  },
  state: {
    type: Number,
    default: 0
    //0: 未背； 1：已背； 2：已掌握
  },
  reviewTimes: {
    type: Number,
    default: -1
  }, 
  firstDate: {
    type: Date
  },
  nextDate: {
    type: Date
  },

})

const dataSchema = new Schema({
  bookName: {
    type: String,
    require: true,
    default: "common"
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  book: [bookSchema]
})


module.exports = mongoose.model('UserData', dataSchema)