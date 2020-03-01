const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/wordsapp',{ useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.once("open",function () {
    console.log('数据库已连接>>>');
})
