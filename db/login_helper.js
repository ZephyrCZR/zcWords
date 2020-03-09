/**
 * 操作登录相关信息
 * 提供了以下方法：
 * checkLocalRegInfo： 检查本地授权集合中是否已存在对应手机号码和用户名
 * localReg：将信息写入本地授权
 * finishReg： 完成注册，生成授权关联表和创建用户信息
 * localLogin： 本地登录
 */
const Users = require('./models/user/user')
const AuthRel = require('../db/models/login/userAuthRel')
const LocalAuth = require('../db/models/login/userLocalAuth')
// const ThirdAuth = require('../db/models/login/userThirdAuth')
// const tools = require('../common/utils')
const sha256 = require('sha256')

require('./connect')

const encrypt = function (data) {
  return sha256(data + "Zephyr")
}

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
        reject()
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

  let message = {}
  message.code = 200
  switch (sign) {
    case 0:
      return false
    case 1:
      message.msg = "该用户名已被占用"
      return message
    case 2:
      message.msg = "该手机号码已经注册"
      return message
    case 3:
      message.msg = "该手机号码已经注册"
      return message
    default:
      message.code = 500
      message.msg = "服务器发生错误"
      return message
  }
}

/**本地注册
 * 
 * @param {对象，保存了用户名、密码、手机号} options 
 */
const localReg = function (options) {
  return new Promise((resolve, reject) => {
    options.password = encrypt(options.password)
    LocalAuth.create(options, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        resolve(doc)
      }
    })
  })
}

/**初始化用户表
 * 
 * @param {用户昵称} nickname 
 */
const initUser = function (nickname) {
  return new Promise((resolve, reject) => {

    Users.create({
      "nickname": nickname
    }, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        resolve(doc)
      }
    })
  })
}

/**从一个集合中删除一个文档
 * 
 * @param {集合名} Collection 
 * @param {查询对象} query 
 */
const deleteADoc = function (Collection, query) {
  return new Promise((resolve, reject) => {
    Collection.deleteOne(query, (removeErr, removeDoc) => {
      if (removeErr) {
        reject("删除失败")
      } else {
        resolve(removeDoc)
      }
    })
  })

}


/**完成注册后续动作
 * 
 * @param { 授权Id，包括本地授权和第三方授权 } auth_id 
 * @param { 授权类型，包括 local 和 third } auth_type 
 */
const finishReg = function (local, auth_type) {
  return new Promise((resolve, reject) => {
    initUser(local.user_name).then(

      (res) => {
        AuthRel.create({
            user_id: res._id,
            auth_id: local._id,
            auth_type: auth_type
          },
          (err, doc) => {
            if (err) {
              deleteADoc(LocalAuth, {
                _id: local._id
              }).then((suc) => {
                return deleteADoc(Users, {
                  _id: res._id
                })
              }, (err) => {
                // user表、local表回退失败
                reject("服务器发生了严重错误---all")
              }).then((suc) => {
                // user表、local表回退成功
                reject("服务器发生了错误")
              }, (err) => {
                // user表回退失败
                reject("服务器发生了严重错误---user")
              })

            } else {
              resolve(local)
            }
          })
      }, (err) => {
        deleteADoc(LocalAuth, {
          _id: local._id
        }).then(() => {
          reject("服务器发生了错误")
        }, () => {
          reject("服务器发生了严重错误---local")
        })
      }
    )
  })
}

/**检查关联的用户ID
 * 
 * @param {授权Id} auth_id 
 * @param {授权类型} auth_type 
 */
const checkAuthRel = function (auth_id, auth_type) {
  return new Promise((resolve, reject) => {
    AuthRel.findOne({
      auth_id: auth_id,
      auth_type: auth_type
    }, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        let obj = {}
        obj.user_id = doc.user_id
        obj.permission = doc.permission
        resolve(obj)
      }
    })
  })
}

/**本地登录
 * 
 * @param {用户登录数据} body 
 * 异步返回用户id: user_id
 */
const localLogin = function (body) {
  return new Promise((resolve, reject) => {
    let query = {}
    let password

    if (body.user_name) {
      query.user_name = body.user_name
    } else if (body.phone) {
      query.phone = body.phone
    } else {
      reject("无填写账号")
    }
    if (body.password) {
      password = encrypt(body.password)
    } else {
      reject("无填写密码")
    }

    LocalAuth.findOne(query, (err, doc) => {
      if (err) {
        reject('服务器错误')
      } else {
        if (doc) {
          //校验密码是否正确
          if (doc.password === password) {
            //如果登录成功并且 try_times 不为 0，重置try_times
            if (doc.try_times !== 0) {
              setLocalAuth(query, {
                "try_times": 0
              })
            }
            checkAuthRel(doc._id, "local").then(user_id => resolve(user_id), err => reject('服务器错误'))
          } else {
            //如果登录失败，try_times + 1
            setLocalAuth(query, {
              "try_times": doc.try_times + 1
            })
            reject('账号或密码错误') //密码错误
          }
        } else {
          reject('账号或密码错误') //账号错误
        }
      }
    })
  })
}

/**根据手机号码获取id
 * 
 * @param {手机号} phone 
 */
const getUserIdByPhone = function (phone) {
  return new Promise((resolve, reject) => {
    LocalAuth.findOne({
      phone: phone
    }).exec((err,doc) => {
      console.log(doc);
      if (err) {
        reject(err)
      }
      checkAuthRel(doc._id, "local").then(res => resolve(res.user_id), err => reject('服务器错误'))
    })
  })
}


/**操作本地授权用户表
 * 如：修改密码，修改绑定手机，修改登录错误次数
 * @param {查询目标} query 
 * @param {目标结果} target 
 */
const setLocalAuth = function (query, target) {
  return new Promise((resolve, reject) => {
    LocalAuth.updateOne(query, {
        $set: target
      },
      (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      }
    )
  })
}

/**更新最后一次登录时间
 * 
 * @param {用户id} user_id 
 */
const newLogTime = function (user_id) {
  // const time = Date.now()
  Users.updateOne({
    _id: user_id
  }, {
    $set: {
      last_login_time: Date.now()
    }
  }, () => {})
}

module.exports = {
  checkLocalRegInfo,
  localReg,
  finishReg,
  localLogin,
  newLogTime,
  findLocalUPhone,
  getUserIdByPhone
}