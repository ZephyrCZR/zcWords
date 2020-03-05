const Users = require('../db/models/login/users')
const AuthRel = require('../db/models/login/userAuthRel')
const LocalAuth = require('../db/models/login/userLocalAuth')
const ThirdAuth = require('../db/models/login/userThirdAuth')
const tools = require('../common/utils')
// const connect = require('./connect')
/**验证该用户名是否已经存在
 * 
 * @param {用户名} user_name 
 */
const findLocalUN = (user_name) => {
  return new Promise((resolve, reject) => {
    LocalAuth.findOne({
      user_name: user_name
    }, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        resolve(doc)
      }
    })
  })
}
/**验证该手机号是否已经注册
 * 
 * @param {手机号} phone 
 */
const findLocalUPhone = (phone) => {
  return new Promise((resolve, reject) => {
    LocalAuth.findOne({
      phone: phone
    }, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        resolve(doc)
      }
    })
  })
}
/** 验证用户名和手机号是否已经存在
 * 
 * @param {用户名}} user_name 
 * @param {手机号} phone 
 */
const checkLocalRegInfo = async function (user_name, phone) {
  let sign = 0;
  await findLocalUN(user_name).then((res) => {
    if (res) {
      sign += 1
    }
  }, (err) => {
    sign = -1
  })
  await findLocalUPhone(phone).then((res) => {
    if (res) {
      sign += 2
    }
  }, (err) => {
    sign = -1
  })

  switch (sign) {
    case 0:
      return false
      break;
    case 1:
      return "该用户名已被占用"
      break;
    case 2:
      return "该手机号码已经注册"
      break;
    case 3:
      return "该手机号码已经注册"
      break;
    default:
      return "服务器发生错误"
      break;
  }
}
// console.log(object);
// checkLocalRegInfo("ha1ha", "17875300024").then((res) => {
//   console.log(res);
// })

/**本地注册
 * 
 * @param {对象，保存了用户名、密码、手机号} options 
 */
const localReg = function (options) {
  return new Promise((resolve, reject) => {
    options.password = tools.encrypt(options.password)
    LocalAuth.create(options, (err,doc) => {
      if (err) {
        reject(err)
      } else {
        resolve(doc)
      }
    })
  })
}


// localReg({
//   user_name: "大傻逼",
//   password: "abcdefg",
//   phone: "17875300000"
// }).then(() => {
//   console.log("成功");
// }, () => {
//   console.log("失败");
// })

/**初始化用户表
 * 
 * @param {用来生成token的id，使用local、third登录表的_id} id 
 */
const initUser = function (id) {
  return new Promise((resolve, reject) => {
    const date = tools.lateDays(Date.now(), 7)
    const token = tools.getToken(id)
    Users.create({
      token: token,
      expire_in: date
    }, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        resolve(doc)
      }
    })
  })
}

// initUser("lksjdflkjdfo3i23").then((res)=>{
//   console.log(res);
// },(err)=>{
//   console.log(err);
// })


const finishReg = function (auth_id, auth_type) {
  return new Promise((resolve,reject) => {
    initUser(auth_id).then((res) => {
      AuthRel.create({
        user_id: res._id,
        auth_id: auth_id,
        auth_type: auth_type
      },(err,doc) => {
        if (err) {
          Users.remove({
            _id: res._id
          })
          reject(err)
        }else{
          resolve(doc)
        }
      })
    })
   
  })
}

module.exports = {
  checkLocalRegInfo,
  localReg,
  finishReg
}