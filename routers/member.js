const express = require('express')
const helper = require('../db/login_helper')
// const User = require('./models/user')
// const Users = require('../db/models/login/users')
// const AuthRel = require('../db/models/login/userAuthRel')
// const LocalAuth = require('../db/models/login/userLocalAuth')
// const ThirdAuth = require('../db/models/login/userThirdAuth')
const router = express.Router()



router.get('/register', (req, res) => {
  // 1. 获取表单提交的数据
  // 2. 操作数据库
  //     判断该用户是否存在
  //     如果存在，不允许注册
  //     如果不存在，注册新建用户
  // 3. 发送响应
  const body = req.query
  // req.body

  helper.checkLocalRegInfo(body.user_name, body.phone).then(mes => {
    if (mes) {
      console.log(mes);
      res.status(200).json({
        err_code: 0,
        message: mes
      })
    } else {
      helper.localReg(body).then((doc) => {
        console.log(doc);
        helper.finishReg(doc._id,"local")
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

  // LocalAuth.findOne({
  //     $or: [{
  //         user_name: body.user_name
  //       },
  //       {
  //         phone: body.phone
  //       }]
  //   }, (err, doc) => {
  //     if (err) {
  //       return res.status(500).json({
  //         err_code: 500,
  //         message: '服务端错误'
  //       })
  //     }
  //     if (doc) {
  //       return res.status(200).json({
  //         err_code: 1,
  //         message: '该用户名或手机号码已被注册'
  //       })
  //     }
  //     LocalAuth.create(body, (err) => {
  //       if (err) {
  //         return res.status(500).json({
  //           err_code: 500,
  //           message: '服务端错误'
  //         })
  //       } else {

  //         //占位：token 、 第三方登录 表操作

  //         res.status(200).json({
  //           err_code: 0,
  //           message: '注册成功'
  //         })
  //       }
  //     })
  //   }
  // )
})




module.exports = router