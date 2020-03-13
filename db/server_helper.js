const Book = require('./models/server/book')
require('./connect')

const getServerBooksList = function () {
  return new Promise((resolve, reject) => {
    Book.find({}).select(['book_name', 'book_type', 'describe', 'cover_img','amount']).exec((err, docs) => {
      resolve(docs)
    })
  })
}

module.exports = {
  getServerBooksList
}