const LibModle = require('../db/models/wordLib')
const DataModle = require('../db/models/userData')
const BookModle = require('../db/models/book')

// const tool = require('./tools')



// const connect = require('../db/connect')



  LibModle.find().limit(2000).select('_id').exec((err, idArr) => {
    if (err) {
      throw err
    }else{
      let arr = []
      idArr.forEach(el => {
        arr.push(el._id)
      })
  
      BookModle.create({
        bookName: "common2000",
        wordsId: arr
      })
    }        
  })





// DataModle.create({
//   userId: "101",
//   bookName: "book6",
//   book: [{
//     wordId: "5e58b377b197993f90e20ef9",
   
//     reviewTimes: 0
//   },
//   {
//     wordId: "5e58b377b197993f90e20eff",

//     reviewTimes: 0
//   },
//   {
//     wordId: "5e58b377b197993f90e20fff",
//     reviewTimes: 1
//   },
// ]
// })
