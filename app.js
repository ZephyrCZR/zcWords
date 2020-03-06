const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const expressJWT = require('express-jwt');
const app = express()
// 数据库：
const connect = require('./db/connect')

// 路由：
const word = require('./routers/word')
const member = require('./routers/member')

// jwt：
const secretOrPrivateKey = "Zephyr"  //加密token 校验token时要使用
app.use(expressJWT({
    secret: secretOrPrivateKey   
}).unless({
    path: ['/login','/register']  //除了这个地址，其他的URL都需要验证
}))
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {   
      //  这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
    res.status(401).send('invalid token...');
  }
})




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

// app.engine('html', require('express-art-template'))
// app.set('views', path.join(__dirname, './views/'))//默认就是./views

// 挂载post请求体插件，必须在app.use(router)之前
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 挂载路由
app.use(word)
app.use(member)

app.listen(5000, () => {
  console.log('running>> http://127.0.0.1:5000')
})