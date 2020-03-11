const express = require('express')
const db = require('../db/word_helper')
const router = express.Router()

/** 添加新词书
 * @param {用户id} user_id
 * @param {词书名} book_name
 */
router.get('/addbook', (req, res) => {

  console.log(req.query); 
  if (req.user.ban){
    return res.sendStatus(401)
  }
  

  let user_id = req.query.user_id
  let book_name = req.query.book_name
  db.addUserBook(user_id, book_name).then((result) => {
    res.status(201).json({
      message: result
    })
  },(error) => {
    res.status(500).json({
      message: error
    })
  })
})


//上传词书数据
router.post('/upload', (req, res) => {
  const token = req.user
  const body = req.body

  const uid = token.uid
  db.syncUsersBook(token.uid, body.statelist).then(() => {
    res.status(200).json({
      message: '数据同步成功'
    })
  },() => {
    res.status(500).json({
      message: '数据同步失败'
    })
  })
})

//获取用户词书状态信息
router.get('/word/download', (req, res) => {

  const body = req.query

  db.getUsersBookByBId(body.book_id).then((book) => {
    res.status(200).json(book)
  })


})


module.exports = router