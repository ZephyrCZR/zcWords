const Lib = require('./models/server/wordLib')
const UserBook = require('./models/user/userBook')
const User = require('../db/models/user/user')
const Book = require('./models/server/book')
const connect = require('./connect')

/**添加用户词书
 * 
 * @param {用户Id} user_id 
 * @param {词书名称} bookName 
 */
const addUserBook = (user_id, bookName) => {
  return new Promise((resolve, reject) => {
    getUserBook(user_id).then((book) => {
      return checkUserBook(book.bookList, bookName)
    }).then((flag) => {
      if (flag) {
        reject("词书已存在")
      } else {
        return createBook(bookName)
      }
    }).then((book_id) => {
      //添加到用户信息表
      if (book_id) {
        return addBookToUser(user_id, book_id)
      }      
     
      
    }).then(() => {
      resolve("添加词书成功")
    })
  })
}

//获取指定用户所拥有的词书信息
const getUserBook = (userId) => {
  return new Promise((resolve, reject) => {
    User.findOne({
      "_id": userId
    }).select("bookList").exec((err, doc) => {
      if (err) {
        reject(err)
      } else {
        resolve(doc)
      }
    })
  })
}

//检验是否已拥有该词书
const checkUserBook = function (list, bookName) {
  return new Promise((resolve, reject) => {
    if (list.length === 0) {
      resolve(false)
    }

    let round = 0

    list.forEach((id) => {
      UserBook.findOne({
        _id: id
      }).select("bookName").exec((err, doc) => {
        if (err) {
          console.log("服务器发生错误");
        } else if (doc && doc.bookName === bookName) {
          resolve(true)
        } else {
          round++
          if (round === list.length) {
            resolve(false)
          }
        }
      })
    })
  })
}

//创建新的用户词书
const createBook = (bookName) => {
  return new Promise((resolve, reject) => {
    findBook(bookName).then(
      (wordsIdArr) => {
        let idArr = []
        wordsIdArr.wordsId.forEach(el => {
          idArr.push({
            wordId: el
          })
        })
        UserBook.create({
          bookName: bookName,
          book: idArr
        }, (err, doc) => {
          if (err) {
            reject(err)
          } else {
            resolve(doc._id)
          }
        })
      }, (err) => {
        reject(err)
      }
    )
  })
}

//查找服务端的词书列表
const findBook = (bookName) => {
  return new Promise((resolve, reject) => {
    Book.findOne({
      bookName: bookName
    }).select("wordsId").exec((err, wordsIdArr) => {
      if (err) {
        reject(err)
      } else {
        if (wordsIdArr) {
          resolve(wordsIdArr)
        } else {
          reject("该词书不存在")
        }

      }
    })
  })
}

//添加词书到用户表
const addBookToUser = (user_id, book_id) => {
  return new Promise((resolve, reject) => {
    User.updateOne({
      _id: user_id
    }, {
      $addToSet: {
        bookList: [
          book_id
        ]
      }
    }, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        resolve(doc)
      }
    })
  })
}


// addUserBook("5e6221bb3cacfe2f9c9bab86", "common2000").then((suc) => {
//   console.log(suc);
// }, (err) => console.log(err))





/**根据 word 从单词总库中查找一个单词
 * 
 * @param {单词} word 
 */
const findWord = function (word, fun) {
  Lib.findOne({
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
  Lib.findOne({
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


/**获取指定用户指定词书待复习的单词
 * 
 * @param {用户Id} userId 
 * @param {词书名称} bookName 
 * @param {回调函数，参数返回一个保存待复习单词的 wordId 数组} fun 
 */
const getReviews = function (userId, bookName, fun) {
  let now = new Date()
  UserBook.aggregate([{
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
  UserBook.aggregate([{
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
  UserBook.update({
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




/**从用户数据中查找amount个待复习的单词
 * amount：查找数量
 * return：返回一个数组
 */
// const getReviewWords = function (amount) {
//   let now = new Date()
//   UserBook.find({nextDate:{ $lt: now }},function (err, docs) {
//     if (err) {
//       throw err
//     }else return docs
//   }).limit(amount)
// }
// getNewWords(1)


module.exports = {
  addUserBook,

}