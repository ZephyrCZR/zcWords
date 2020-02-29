const mongoose = require('mongoose')
const Schema = mongoose.Schema


const wordSchema = new Schema({
  word: {
    type: String,
    required: true
  },
  "soundmark": [{
    "soundtype": {
      type: String,
      default: ''
    },
    "symbol": {
      type: String,
      default: ''
    },
    "audio": {
      type: String,
      default: ''
    }
  }],
  "paraphrase": [{
    "pos": {
      type: String,
      default: ''
    },
    "meaning": {
      type: String,
      default: ''
    }
  }],
  "example": [{
    "sentence": {
      type: String,
      default: ''
    },
    "interpret": {
      type: String,
      default: ''
    }
  }]

})
module.exports = mongoose.model('Word', wordSchema)
