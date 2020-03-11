const sha256 = require('sha256')


// module.exports.encrypt = function (data) {  
//   return sha256(data + "Zephyr")
// }


// 返回一个bit位数的随机数
const randCode = function (digit) {
  let mul = Math.pow(10, digit) 
 return (Math.random() * mul).toFixed(0)
}

//
const lateDays = function (timestamp, days) {
  let ms = 86400000 * days
  return timestamp + ms
}

const matchMobile = function(phone) {
  const exp = new RegExp("^1(3|4|5|7|8)\\d{9}$")
  return exp.test(phone)
}

const matchPassword = function(password) {
  const exp = new RegExp("^[a-zA-Z]\\w{5,17}$")
  return exp.test(password)
}

const getTempToken = function (phone) {
  const body = JSON.stringify({
    phone: phone,
    deadline: Date.now() + 1000*60*5 //5分钟
  })

  return tempToken = body +'&'+ sha256(body + "aowu")
}


// 时间戳转年月日
const dateFormat = function(time) {
  let date = new Date(time)
  let arr = []
  arr.push(date.getFullYear())
  arr.push(date.getMonth() + 1)
  arr.push(date.getDate())  
  return arr.join('-')
}





module.exports = {
  lateDays,matchMobile,matchPassword,randCode,getTempToken,dateFormat
}