const express = require('express')
const service_word = require('../service/word')
const router = express.Router()

/** 添加新词书并设为当前词书，返回用户信息表
 * @param {用户id} user_id
 * @param {词书名} book_name
 */
router.get('/zrizc/study/addbook', (req, res) => {
  console.log(req.query);

  if (req.user.ban) {
    return res.sendStatus(401)
  }

  let user_id = req.user._id
  let book_name = req.query.book_name
  service_word.addUserBook(user_id, book_name).then((uInfo) => {
    res.status(201).json({
      message: '添加成功',
      err_code: 0,
      uInfo: uInfo
    })
  }, (error) => {
    console.log(error);
    res.status(202).json({
      message: error,
      err_code: 1
    })
  })
})


//上传词书数据
router.post('/zrizc/study/upload', (req, res) => {
  const body = req.body

  const uid = req.user.uid
  service_word.syncUsersBook(uid, body.book_info).then(() => {
    res.status(200).json({
      message: '数据同步成功',
      err_code: 0
    })
  }, () => {
    res.status(500).json({
      message: '数据同步失败',
      err_code: 1
    })
  })
})

//获取用户词书状态信息
router.get('/zrizc/study/bookinfo', (req, res) => {

  const body = req.query
  console.log(body);
  service_word.getUsersBookByBId(body.book_id).then((book) => {
    res.status(200).json({
      book_info: book,
      err_code: 0
    })
  })


})


module.exports = router