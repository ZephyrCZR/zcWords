const express = require('express')
const service_login = require('../service/login')
const jwt = require('../common/jwt')
const msgAPI = require('../common/message_api')
const utils = require('../common/utils')
const sha256 = require('sha256')
const router = express.Router()

const tempStorage = new Map()

/**
 * 获取短信验证码
 */
router.post('/member/getmsg', (req, res) => {
  const body = req.body

  service_login.findLocalUPhone(body.phone).then((doc) => {
    if (doc) {
      res.status(202).json({
        err_code: 1,
        message: '该手机号已经注册过了'
      })
    } else {
      const code = utils.randCode(4)
  
      // 暂时先关掉短信验证码服务
      // msgAPI(body.phone, code)

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


// err_code: 0:注册/登录成功；  1：注册/登录失败，用户名或手机号已经存在/账号密码错误； 401：短信验证码错误/封号  500： 服务器错误

/**
 * 本地用户注册
 * 登录成功返回用户信息文档，token, uInfo
 */
router.post('/member/register', (req, res) => {

  const body = req.body

  if (!utils.matchMobile(body.phone)) {
    res.status(401).json({
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
  if (sha256(tokenInfo[0] + "aowu") !== tokenInfo[1] || JSON.parse(tokenInfo[0]).phone !== body.phone) {
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

    service_login.findLocalUPhone(body.phone).then(msg => {
      if (msg) {
        res.status(202).json({
          err_code: 1,
          message: '该手机号已经注册过了'
        })
      } else {
        service_login.localReg(body).then((doc) => {

          service_login.finishReg(doc, "local").then((uInfo) => {

            return service_login.getUserIdByPhone(body.phone).then(uid => {
              const token = jwt({
                user_id: uid,
                permission: 1
              })

              res.status(200).json({
                err_code: 0,
                message: '注册成功',
                token: token,
                uInfo: uInfo
              })
            })

          }, (err) => {
            console.log('错误测试点-finishReg');
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
 * 登录成功返回用户信息文档，token, uInfo
 */
router.post('/member/login', (req, res) => {

  const body = req.body

  service_login.localLogin(body).then((user) => {

    //验证黑名单
    if (user.permission === 0) {
      res.status(401).json({
        message: '该用户已被封禁',
        err_code: 401
      })
      return
    }

    const token = jwt(user)

    //更新最后一次登录时间
    service_login.newLogTime(user.user_id)

    // 发送用户信息
    service_login.getUserInfoById(user.user_id).then((uInfo) => {
      console.log(uInfo);
      res.status(200).json({
        message: '登录成功',
        err_code: 0,
        token: token,
        uInfo: uInfo
      })
    })

  }, (err) => {
    res.status(401).json({
      err_code: 1,
      message: err
    })
  })
})



module.exports = router