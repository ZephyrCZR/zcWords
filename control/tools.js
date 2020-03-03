const LibModle = require('../db/models/wordLib')
const DataModle = require('../db/models/userData')

const connect = require('../db/connect')

/**根据 word 从单词总库中查找一个单词
 * 
 * @param {单词} word 
 */
const findWord = function (word, fun) {
  LibModle.findOne({
    "word": word
  }, (err, doc) => {
    if (err) {
      throw err
    }
    fun(doc)
  })
}

/**根据 wordId 从单词总库中查找一个单词
 * 
 * @param {单词Id} wordId 
 */
const findWordById = function (wordId, fun) {
  LibModle.findOne({
    "_id": wordId
  }, (err, doc) => {
    if (err) {
      throw err
    }
    fun(doc)
  })
}

// findWord("aw", (res) => {
//   console.log(res);
// })

/**获取指定用户的词书信息
 * 
 * @param {用户id} userId 
 * @param {词书名称}} bookName 
 */
const getUserBook = function (userId, bookName, fun) {
  DataModle.findOne({
    $and: [{
      "userId": userId
    }, {
      "bookName": bookName
    }]
  }, (err, doc) => {
    if (err) {
      throw err
    } else {
      fun(doc)
    }
  })
}

// getUserBook("102", "book4", now, (res) => {
//   console.log(res);
// })

/**获取指定用户指定词书待复习的单词
 * 
 * @param {用户Id} userId 
 * @param {词书名称} bookName 
 * @param {回调函数，参数返回一个数组} fun 
 */
const getReviews = function (userId, bookName, fun) {
  let now = new Date()
  DataModle.aggregate([{
      "$unwind": "$book"
    },
    {
      "$match": {
        $and: [{
          "userId": userId
        }, {
          "bookName": bookName
        }, {
          "book.nextDate": {
            $lt: now
          }
        }]
      }
    },
    {
      "$group": {
        "_id": "$_id",
        "wordsArr": {
          "$push": "$book"
        }
      }
    }
  ], (err, doc) => {
    if (err) {
      throw err
    } else {
      fun(doc[0].wordsArr)
    }
  })
}

// getReviews("101", "book6", (res) => {
//   // console.log(res[0].wordsArr);
//   console.log(res);
// })



/**从用户数据中查找amount个待复习的单词
 * amount：查找数量
 * return：返回一个数组
 */
// const getReviewWords = function (amount) {
//   let now = new Date()
//   DataModle.find({nextDate:{ $lt: now }},function (err, docs) {
//     if (err) {
//       throw err
//     }else return docs
//   }).limit(amount)
// }
// getNewWords(1)