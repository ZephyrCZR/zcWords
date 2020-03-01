const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

// 数据库：
const connect = require('./connect')


// 路由：
// const userInfo = require('./routers/userInfo')

const app = express()

// //设置允许跨域访问该服务.
// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Methods', '*');
//   res.header('Content-Type', 'application/json;charset=utf-8');
//   next();
// });

app.use('/public/', express.static(path.join(__dirname,'./public/'))) //path.join:拼接路径，并且处理斜杠
app.use('/node_modules', express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/'))//默认就是./views

// 挂载post请求体插件，必须在app.use(router)之前
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(userInfo)

app.listen(5000, () => {
  console.log('running...');
})