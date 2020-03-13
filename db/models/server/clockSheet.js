const mongoose = require('mongoose')
const Schema = mongoose.Schema

const  utils = require('../../../common/utils')

let date = utils.dateFormat(Date.now())

const idSchema = new Schema({
  user_id: {
    type: String,
    required: true
  }
})

const clockSchema = new Schema({
  date: {
    type: String,
    default: date,
    required: true
  },
  user: [idSchema]
})



module.exports = mongoose.model('clockSheet', clockSchema)