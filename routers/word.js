const express = require('express')
const db = require('../db/word_helper')
const router = express.Router()

//初始化用户词书
router.get('/initbook', (req, res) => {
  console.log(req.query); 

  let userId = req.query.userId
  let bookName = req.query.bookName
  db.initUserBook(userId, bookName).then((message) => {
    res.send(message)
  },(error) => {
    res.send(error)
  })
})


module.exports = router