const express = require('express')
const path = require('path')
// const session = require('express-session')
const bodyParser = require('body-parser')
const expressJWT = require('express-jwt');
const app = express()

// 连接数据库：
require('./db/connect')

// 注册路由：
const word = require('./routers/word')
const member = require('./routers/member')
const info = require('./routers/info')

// jwt：
const secretOrPrivateKey = "Zephyr"  //加密token 校验token时要使用
app.use(expressJWT({
    secret: secretOrPrivateKey   
}).unless({
    path: ['/zrizc/register','/zrizc/login','/zrizc/getmsg','/zrizc/resetpassword', '/zrizc/clock', '/zrizc/home/init']  //除了这些地址，其他的URL都需要验证
}))
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {   
      
    res.status(401).send('invalid token...');
  }
})


//设置允许跨域访问该服务.
app.use(require("cors")())
//或者：
// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   //Access-Control-Allow-Headers ,
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Methods', '*');
//   res.header('Content-Type', 'application/json;charset=utf-8');
//   // res.header('Access-Control-Allow-Credentials','true');
//   next();
// });


app.use('/public/', express.static(path.join(__dirname,'./public/'))) //path.join:拼接路径，并且处理斜杠
app.use('/node_modules', express.static(path.join(__dirname, './node_modules/')))

// app.engine('html', require('express-art-template'))
// app.set('views', path.join(__dirname, './views/'))//默认就是./views

// 挂载post请求体插件，必须在app.use(router)之前
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 挂载路由
app.use(word)
app.use(member)
app.use(info)

app.listen(5230, () => {
  console.log('running>> http://192.168.0.105:5230')
})