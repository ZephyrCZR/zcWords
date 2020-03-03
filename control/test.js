const LibModle = require('../db/models/wordLib')
const DataModle = require('../db/models/userData')

const connect = require('../db/connect')

DataModle.create({
  userId: "101",
  bookName: "book6",
  book: [{
    wordId: "5e58b377b197993f90e20ef9",
   
    reviewTimes: 0
  },
  {
    wordId: "5e58b377b197993f90e20eff",

    reviewTimes: 0
  },
  {
    wordId: "5e58b377b197993f90e20fff",
    reviewTimes: 1
  },
]
})
