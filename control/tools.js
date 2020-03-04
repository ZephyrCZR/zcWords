const LibModle = require('../db/models/wordLib')
const DataModle = require('../db/models/userData')
const BookModle = require('../db/models/book')
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
 * @param {词书名称} bookName 
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

// getUserBook("102", "book4",(res) => {
//   console.log(res);
// })

/**获取指定用户指定词书待复习的单词
 * 
 * @param {用户Id} userId 
 * @param {词书名称} bookName 
 * @param {回调函数，参数返回一个保存待复习单词的 wordId 数组} fun 
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
          "book.state": 1
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
      let wordsIdArr = []
      doc[0].wordsArr.forEach(el => {
        wordsIdArr.push(el.wordId)
      });
      fun(wordsIdArr)
    }
  })
}

// getReviews("101", "book6", (res) => {
//   // console.log(res[0].wordsArr);
//   // console.log(res);
//   // getWordsArrByIdArr(res, (data) => {
//   //   console.log(data);
//   // })

// })


/**获取用户词书中，状态为state的单词（ 0: 未背； 1：已背； 2：已掌握 ）
 * 
 * @param {用户Id} userId 
 * @param {词书名称} bookName 
 * @param {单词状态} state
 * @param {回调函数} fun 
 */
const getState = function (userId, bookName, state, fun) {
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
          "book.state": state
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
      console.log(doc);
      let wordsIdArr = []
      doc[0].wordsArr.forEach(el => {
        wordsIdArr.push(el.wordId)
      });
      fun(wordsIdArr)
    }
  })
}

// getState("102", "common2000",0, (res) => {
//   // console.log(res[0].wordsArr);
//   console.log(res);
//   // getWordsArrByIdArr(res, (data) => {
//   //   console.log(data);
//   // })

// })

const setState = function (id, wordId, state) {
  DataModle.update({
    "_id": id,
    "book.wordId": wordId
  }, {
    $set: {
      "book.$.state": state
    }
  }, function (err, res) {
    if (err) {
      throw err
    } else {
      console.log(res)
    }
  })
}
// setState("5e5f791eb3011214942e8d5d", "5e58b377b197993f90e1e88a", 0)


/**通过单词id的数组查询所有单词
 * 
 * @param {单词Id数组} wordsIdArr 
 * @param {回调函数} fun 
 */
const getWordsArrByIdArr = function (wordsIdArr, fun) {
  wordsIdArr.forEach(el => {
    findWordById(el, function (res) {
      fun(res)
    })
  });
}

/** 初始化用户词书
 * 
 * @param {用户Id} userId 
 * @param {词书名称} bookName 
 */
const initUserBook = function (userId, bookName) {

  getUserBook(userId, bookName, (res) => {
    if (res) {
      let err = "For user id: " + userId + ", book \"" + bookName + "\" is already exist"
      console.log(err);
    } else {
      BookModle.findOne({
        bookName: bookName
      }).select("wordsId").exec((err, wordsIdArr) => {
        if (err) {
          throw err
        } else {
          // console.log(wordsIdArr);
          let idArr = []
          wordsIdArr.wordsId.forEach(el => {
            idArr.push({
              wordId: el
            })
          })
          DataModle.create({
            userId: userId,
            bookName: bookName,
            book: idArr
          })
          console.log("Initialization is complete");
        }
      })
    }
  })
}

// initUserBook("101", "common2000")


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


// module.exports = {
//   findWord,findWordById,getUserBook,getReviews,getWordsArrByIdArr,initUserBook
// }