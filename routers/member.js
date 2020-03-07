const express = require('express')
const db = require('../db/login_helper')
const jwt = require('jsonwebtoken')

const router = express.Router()
const SECRET = 'Zephyr'
/**
 * 本地用户注册
 */
router.get('/register', (req, res) => {
  // 1. 获取表单提交的数据
  // 2. 操作数据库
  //     判断该用户是否存在
  //     如果存在，不允许注册
  //     如果不存在，注册新建用户
  // 3. 发送响应
  const body = req.query
  // const body = req.body

  // err_code: 0:注册成功；  200：注册失败，用户名或手机号已经存在；  500： 服务器错误
  db.checkLocalRegInfo(body.user_name, body.phone).then(err => {
    if (err) {
      res.status(err.code).json({
        err_code: err.code,
        message: err.msg
      })
    } else {
      helper.localReg(body).then((doc) => {
        helper.finishReg(doc, "local")
        res.status(200).json({
          err_code: 0,
          message: '注册成功'
        })
      }, () => {
        res.status(500).json({
          err_code: 500,
          message: '注册失败，服务器发生错误'
        })
      })
    }
  })

})


/** 
 * 本地用户登录
 */
router.get('/login',  (req, res) => {

  const body = req.query
  // const body = req.body

  db.localLogin(body).then((user) => {
    // 注意默认情况 Token 必须以 Bearer+空格 开头
    const token = 'Bearer ' + jwt.sign({
      _id: user.user_id,
      ban: user.permission === 0
    }, SECRET, {
      expiresIn: 3600 * 24 * 7
    })

    db.newLogTime(user.user_id)
    res.status(200).json({
      message: '登录成功',
      data: {
        token: token
      }
    })
  },(err) => {
    res.status(200).json({
      message: err
    })
  })
  
})

module.exports = router