const db = require('../db/server_helper')
const express = require('express')
const jwt = require('../common/JWT')
const router = express.Router()


router.get('/zrizc/server/getserverbooks', (req, res) => {
  db.getServerBooksList().then((list) => {
    res.status(200).json({
      bookList: list
    })
  })
})

// router.get('/zrizc/server/getbackground', (req, res) => {
//   db.getServerBooksList().then((list) => {
//     res.status(200).json({
//       bookList: list
//     })
//   })
// })

module.exports = router