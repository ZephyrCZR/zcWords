const Lib = require('./models/server/wordLib')
const UserBook = require('./models/user/userBook')
const User = require('../db/models/user/user')
const Book = require('./models/server/book')
// const connect = require('./connect')
const ObjectId = require('objectid')

/**添加用户词书
 * 
 * @param {用户Id} user_id 
 * @param {词书名称} bookName 
 */
const addUserBook = (user_id, book_name) => {
  return new Promise((resolve, reject) => {
    getUserBookList(user_id).then((book) => {

      return checkUserBook(book.book_list, book_name)

    }, (err) => {

      reject(err)

    }).then((flag) => {

      if (flag) {
        reject("你已经有这本书了")
      } else {
        return createBook(book_name)
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

//获取用户的词书列表
const getUserBookList = (user_id) => {
  return new Promise((resolve, reject) => {
    User.findById(user_id).select("book_list").exec((err, doc) => {
      if (err) {
        reject(err)
      } else {
        if (doc) {
          resolve(doc)
        }else{
          reject("该用户不存在");
        }       
      }
    })
  })
}

//检验是否已拥有该词书
const checkUserBook = function (list, book_name) {
  return new Promise((resolve, reject) => {
    if (list.length === 0) {
      resolve(false)
    }

    let round = 0

    list.forEach((id) => {
      UserBook.findById(id).select("book_name").exec((err, doc) => {
        if (err) {
          reject(err)
        } else if (doc && doc.book_name === book_name) {
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
const createBook = (book_name) => {
  return new Promise((resolve, reject) => {
    findBook(book_name).then(
      (wordsIdArr) => {
        let idArr = []
        wordsIdArr.words_id.forEach(el => {
          idArr.push({
            word_id: el
          })
        })
        UserBook.create({
          book_name: book_name,
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
const findBook = (book_name) => {
  return new Promise((resolve, reject) => {
    Book.findOne({
      book_name: book_name
    }).select("words_id").exec((err, wordsIdArr) => {
      if (err) {
        reject(err)
      } else {
        if (wordsIdArr) {
          resolve(wordsIdArr)
        } else {
          reject("该词书未收录")
        }

      }
    })
  })
}

//添加词书到用户表
const addBookToUser = (user_id, book_id) => {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(user_id, {
      $addToSet: {
        book_list: [
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

// addUserBook("5e622466a22b335b48240b13", "common2000").then((suc) => {
//   console.log(suc);
// }, (err) => console.log(err))



/**获取用户词书中，状态为state的单词（ 0: 未背； 1：已背； 2：已掌握 ）
 * 
 * @param {用户Id} userId 
 * @param {词书名称} bookName 
 * @param {单词状态} state
 * @param {回调函数} fun 
 */
const getState = function (book_id, state, skip, count) {
  return new Promise((resolve, reject) => {
    UserBook.aggregate([{
        "$unwind": "$book"
      },
      {
        "$match": {
          $and: [{
            "_id": ObjectId(book_id)
          }, {
            "book.state": state
          }]
        }
      },
      {
        "$skip": skip
      },
      {
        "$limit": count
      },
      {
        "$group": {
          "_id": "$_id",
          "wordsArr": {
            "$push": "$book"
          }
        }
      }
    ]).exec((err, doc) => {
      if (err) {
        reject(err)
      } else {
        let wordsIdArr = []
        doc[0].wordsArr.forEach(el => {
          wordsIdArr.push(el.word_id)
        });
        resolve(wordsIdArr)
      }
    })
  })
}



// getState("5e6344aad7906a193432e27e", 0, 2, 10).then((res) => {
//   // console.log(res[0].wordsArr);
//   console.log(res);
//   // getWordsArrByIdArr(res, (data) => {
//   //   console.log(data);
//   // })

// })


// 更改单词状态
// 成功了也没有返回，干脆不要异步返回结果了
const setState = function (book_id, word_id, state) {
  UserBook.updateOne({
    "_id": book_id,
    "book.word_id": word_id
  }, {
    $set: {
      "book.$.state": state
    }
  }).exec()
}


// setState("5e6344aad7906a193432e27e", "5e58b377b197993f90e1e88a", 110)

//同步单词状态表
const syncUsersBook = function (book_id, wordsArr) {
  return new Promise((resolve) => {
    const time = Data.now()
    UserBook.findByIdAndUpdate(book_id, {
      $set: {
        book: wordsArr,
        version: time
      }
    }).exec((err, doc) => {
      if (err) {
        console.log(err);
      } else {
        resolve(doc)
      }
    })
  })
}

//获取指定词书
const getUsersBookByBId = function (book_id) {
  return new Promise((resolve, reject) => {
    UserBook.findById(book_id).exec((err, doc) => {
      if (err) {
        reject(err)
      } else {
        resolve(doc)
      }
    })
  })
}


// syncUsersBook("5e6344aad7906a193432e27e",)


// /**通过单词id的数组查询所有单词
//  * 
//  * @param {单词Id数组} wordsIdArr 
//  * @param {回调函数} fun 
//  */
// const getWordsArrByIdArr = function (wordsIdArr, fun) {
//   wordsIdArr.forEach(el => {
//     findWordById(el, function (res) {
//       fun(res)
//     })
//   });
// }




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

// /**根据 word 从单词总库中查找一个单词
//  * 
//  * @param {单词} word 
//  */
// const findWord = function (word, fun) {
//   Lib.findOne({
//     "word": word
//   }, (err, doc) => {
//     if (err) {
//       throw err
//     }
//     fun(doc)
//   })
// }

// /**根据 wordId 从单词总库中查找一个单词
//  * 
//  * @param {单词Id} wordId 
//  */
// const findWordById = function (wordId, fun) {
//   Lib.findByIdAndUpdate(wordId, (err, doc) => {
//     if (err) {
//       throw err
//     }
//     fun(doc)
//   })
// }

// findWord("aw", (res) => {
//   console.log(res);
// })


// /**获取指定用户指定词书待复习的单词
//  * 
//  * @param {用户Id} userId 
//  * @param {词书名称} bookName 
//  * @param {回调函数，参数返回一个保存待复习单词的 wordId 数组} fun 
//  */
// const getReviews = function (userId, bookName, fun) {
//   let now = new Date()
//   UserBook.aggregate([{
//       "$unwind": "$book"
//     },
//     {
//       "$match": {
//         $and: [{
//           "userId": userId
//         }, {
//           "bookName": bookName
//         }, {
//           "book.state": 1
//         }, {
//           "book.nextDate": {
//             $lt: now
//           }
//         }]
//       }
//     },
//     {
//       "$group": {
//         "_id": "$_id",
//         "wordsArr": {
//           "$push": "$book"
//         }
//       }
//     }
//   ], (err, doc) => {
//     if (err) {
//       throw err
//     } else {
//       let wordsIdArr = []
//       doc[0].wordsArr.forEach(el => {
//         wordsIdArr.push(el.wordId)
//       });
//       fun(wordsIdArr)
//     }
//   })
// }

// getReviews("101", "book6", (res) => {
//   // console.log(res[0].wordsArr);
//   // console.log(res);
//   // getWordsArrByIdArr(res, (data) => {
//   //   console.log(data);
//   // })

// })
module.exports = {
  addUserBook,

}