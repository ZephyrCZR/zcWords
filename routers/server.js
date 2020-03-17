const server_helper = require('../service/server')
const user_helper = require('../service/user')
const express = require('express')
const jwt = require('../common/jwt')
const router = express.Router()


//err_code: 0: 请求成功，1: 请求失败, 3: 发生错误

//每日上线初始化 返回用户信息表和新的token 请求参数：一张用户记录表
router.post('/zrizc/server/init', (req, res) => {
  console.log(req.body);
  const body = {}
  //接收一张信息表，同步用户上传的calendar数据
  body._id = req.user._id
  body.calendar =  req.body

  console.log("body:");
  console.log(body);
  user_helper.getRecort(body).then((uInfo) => {
    console.log("初始化："+uInfo);
    if (uInfo) {
      const token = jwt({
        user_id: uInfo._id,
        permisson: uInfo.permisson
      })
      res.status(200).json({
        message: "每日初始化成功",
        err_code: 0,
        uInfo: uInfo,
        token: token
      })
    } else {
      res.status(202).json({
        message: "今日已完成过初始化了",
        err_code: 0,
        uInfo: uInfo,
      })
    }
  })
})

//签到
router.get('/zrizc/server/clock', (req, res) => {  
  const user_id = req.user._id
  console.log(user_id);
  user_helper.clock(user_id).then((uInfo) => {
    console.log(uInfo);
    res.status(200).json({
      message: '签到成功',
      uInfo: uInfo,
      err_code: 0
    })
  })
})

//根据用户id返回用户信息表
router.get('/zrizc/server/getuinfo', (req, res) => {
  const uid = req.user._id
  console.log(req.user);
  user_helper.getUserInfo(uid).then(uInfo => {
    res.status(200).json({
      message: uInfo,
      uInfo: uInfo,
      err_code: 0
    })
  })
})

//获取系统图书列表信息
router.get('/zrizc/server/getserverbooks', (req, res) => {
  server_helper.getServerBooksList().then((list) => {
    res.status(200).json({
      bookList: list,
      err_code: 0
    })
  })
})

// router.get('/zrizc/server/getbackground', (req, res) => {
//   server_helper.getServerBooksList().then((list) => {
//     res.status(200).json({
//       bookList: list
//     })
//   })
// })

module.exports = router