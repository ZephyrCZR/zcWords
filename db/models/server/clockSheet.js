const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clockSchema = new Schema({
  user_id: {
    type: String,
    required: true
  }
})


module.exports = mongoose.model('clockSheet', clockSchema)