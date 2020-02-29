const express = require('express')
const User = require('./models/user')
const router = express.Router()



router.post('/register', (req, res) => {
  // 1. 获取表单提交的数据
  // 2. 操作数据库
  //     判断该用户是否存在
  //     如果存在，不允许注册
  //     如果不存在，注册新建用户
  // 3. 发送响应
  const body = req.body

  User.findOne({ email: body.email }, (err, data) => {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: '服务端错误'
      })
    }
    if (data) {
      return res.status(200).json({
        err_code: 1,
        message: '该邮箱已被注册'
      })
    }

    new User(body).save((err) => {
      if (err) {
        return res.status(500).json({
          err_code: 500,
          message: '服务端错误'
        })
      }
      res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
    })
  })
})




module.exports = userInfo