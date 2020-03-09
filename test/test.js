const LibModle = require('../db/models/server/wordLib')
const DataModle = require('../db/models/user/userBook')
const BookModle = require('../db/models/server/book')

// const tool = require('./tools')



const connect = require('../db/connect')



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


{
  data: [
    {
      Location: "tian1",
      info:[
        {
          DTU: "51",
          type: "LORADTU",
          HEX: "33"
        },
        {
          DTU: "51",
          type: "水位计",
          HEX: "8C"
        }
      ]
    },
    {
      Location: "tian2",
      info:[
        {
          DTU: "51",
          type: "LORADTU",
          HEX: "33"
        }
      ]
    }
  ]
}

// const parentSchema = new Schema({
//   location: {
//     type: String,
//     required: true
//   },
//   info: [childSchema]
// })

// const childSchema = new Schema({
//   dtu: {
//     type: String,
//     required: true
//   },
//   type: {
//     type: String,
//     required: true
//   },
//   hex:{
//     type: String,
//     required: true
//   }
// })