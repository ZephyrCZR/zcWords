const db = require('../db/user_helper')
const express = require('express')
const jwt = require('../common/JWT')
const router = express.Router()

//: 0: 请求成功，1: 请求失败, 500: 服务器错误

//每日上线初始化 返回用户信息表和新的token
router.post('/zrizc/home/init', (req, res) => {
  const body = req.body //接收一张信息表，同步用户上传的calendar数据
  console.log("body:");
  console.log(body);
  db.getRecort(body).then((uInfo) => {
    console.log(uInfo);
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
      res.status(200).json({
        message: "今日已完成过初始化了",
        err_code: 1
      })
    }
  })
})


//签到
router.get('/zrizc/home/clock', (req, res) => {
  console.log(req.query);
  const body = req.query
  db.clock(body.user_id).then((uInfo) => {
    console.log(uInfo);
    res.status(200).json({
      message: uInfo,
      uInfo: uInfo,
      err_code: 0
    })
  })
})

//根据用户id返回用户信息表
router.get('/zrizc/home/getUserInfo', (req, res) => {
  const uid = req.user._id
  db.getUserInfo(uid).then(uInfo => {
    res.status(200).json({
      message: uInfo,
      uInfo: uInfo,
      err_code: 0
    })
  })
})


module.exports = router