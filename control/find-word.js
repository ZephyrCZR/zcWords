const connect = require('../db/connect')
// const mongoose = require('mongoose')
// const DataModle = require('../db/models/userData')
const LibModle = require('../db/models/wordLib')


//根据 word 从单词总库中查找一个单词
const findWord = function (word) {
  LibModle.findOne({word: word},function (err, doc) {
    if (err) {
      throw err
    }
    console.log(doc)
  })
}

// 从用户数据中查找amount个待复习的单词
const getReviewWords = function (amount) {
  let now = new Date()
  LibModle.find({nextDate:{ $lt: now }},function (err, docs) {
    if (err) {
      throw err
    }
    console.log(docs)
  }).limit(amount)
}
getNewWords(1)