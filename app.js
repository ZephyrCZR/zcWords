const express = require('express')
const path = require('path')
// const session = require('express-session')
const bodyParser = require('body-parser')
const expressJWT = require('express-jwt');
const app = express()

// 连接数据库：
require('./connect')

// 注册路由：
const study = require('./routers/study')
const member = require('./routers/member')
const server = require('./routers/server')

// jwt：
const secretOrPrivateKey = "Zephyr"  //加密token 校验token时要使用
app.use(expressJWT({
    secret: secretOrPrivateKey   
}).unless({
    path: ['/member/register','/member/login','/member/getmsg']  //除了这些地址，其他的URL都需要验证
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

//开放静态资源
app.use('/public/', express.static(path.join(__dirname,'./public/'))) //path.join:拼接路径，并且处理斜杠
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

// app.engine('html', require('express-art-template'))
// app.set('views', path.join(__dirname, './views/'))//默认就是./views

// 挂载post请求体插件，必须在app.use(router)之前
app.use(bodyParser.urlencoded({limit: '10mb', extended: false }))
app.use(bodyParser.json({limit: '10mb'}))

// 挂载路由
app.use(study)
app.use(member)
app.use(server)

app.listen(5230, () => {
  console.log('running>> http://192.168.0.105:5230')
})