const express = require('express')
const db = require('../db/login_helper')
const jwt = require('jsonwebtoken')
const msgAPI = require('../common/message_api')
const utils = require('../common/utils')
const sha256 = require('sha256')
const router = express.Router()
const SECRET = 'Zephyr'

const tempStorage = new Map()

/**
 * 获取短信验证码
 */
router.post('/zrizc/getmsg', (req, res) => {
  const body = req.body
  console.log(body);

  db.findLocalUPhone(body.phone).then((doc) => {
    console.log(doc);
    if (doc) {
      res.status(200).json({
        err_code: 1,
        message: '该手机号已经注册过了'
      })
    } else {
      const code = utils.randCode(4)

      msgAPI(body.phone, code)

      // 用于短信验证的临时token
      const tempToken = utils.getTempToken(body.phone)
      const time = Date.now()
      tempStorage.set(body.phone, {
        createTime: time,
        code: code,
        token: tempToken
      })

      //清理map结构缓存
      if (tempStorage.size > 100) {
        tempStorage.forEach((el) => {
          if (time - el.createTime > 5 * 60 * 1000) {
            tempStorage.remove(el)
          }
        })
      }
      console.log(tempStorage);
      res.status(200).json({
        temptoken: tempToken,
        err_code: 0,
        message: '短信已发送'
      })
    }

  }, (err) => {
    console.log(err);
  })

})


 // err_code: 0:注册/登录成功；  1：注册/登录失败，用户名或手机号已经存在/账号密码错误； 401：短信验证码错误  500： 服务器错误

/**
 * 本地用户注册
 */
router.post('/zrizc/register', (req, res) => {
 
  const body = req.body

  if (!utils.matchMobile(body.phone)) {
    res.status(200).json({
      err_code: 4444444,
      message: '臭傻逼，攻击我我要报警了！！！'
    })
  }

  console.log(body);
  console.log(tempStorage);

  const tempInfo = tempStorage.get(body.phone)
  console.log(tempInfo);
  if (!tempInfo) {

    res.status(401).json({
      err_code: 401,
      message: '验证码错误'
    })
    return
  }

  const tokenInfo = tempInfo.token.split('&')

  // 如果没有token,或者用户号码不匹配
  if (sha256(tokenInfo[0]) !== tokenInfo[1] || JSON.parse(tokenInfo[0]).phone !== body.phone) {
    res.status(401).json({
      err_code: 401,
      message: '验证码错误'
    })
    return
  }

  // 如果token过期
  if (tokenInfo[0].deadline < Date.now()) {
    res.status(401).json({
      err_code: 401,
      message: '验证码已超时'
    })
    return
  }

  // 短信验证
  if (tempInfo && tempInfo.code === body.code && body.token) {

    db.findLocalUPhone(body.phone).then(msg => {
      if (msg) {
        res.status(200).json({
          err_code: 1,
          message: '该手机号已经注册过了'
        })
      } else {
        db.localReg(body).then((doc) => {
          db.finishReg(doc, "local").then(() => {

            return db.getUserIdByPhone(body.phone)

          }).then(uid => {
            const token = 'Bearer ' + jwt.sign({
              _id: uid,
              ban: false
            }, SECRET, {
              expiresIn: 3600 * 24 * 7
            })

            res.status(200).json({
              err_code: 0,
              message: '注册成功',
              token: token
            })
          })

        }, (err) => {
          console.log(err);
          res.status(500).json({
            err_code: 500,
            message: '注册失败，服务器发生错误'
          })
        })
      }
    })

  } else {
    res.status(401).json({
      err_code: 401,
      message: '验证码错误'
    })
  }

})


/** 
 * 本地用户登录
 */
router.post('/zrizc/login', (req, res) => {

  const body = req.body

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
      err_code: 0,
      token: token
    })
  }, (err) => {
    res.status(200).json({
      err_code: 1,
      message: err
    })
  })
})



module.exports = router