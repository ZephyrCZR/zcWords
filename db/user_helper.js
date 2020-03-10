const Users = require('./models/user/user')
const Clock = require('./models/server/clockSheet')

const tools = require('../common/utils')

/**操作用户信息表
 * 
 * @param {查询目标} query 
 * @param {目标结果} target 
 */
const setUsers = function (query, target) {
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

/**获取每日记录表
 * 必须在上层防止重复调用该方法
 * @param {用户id} user_id 
 */
const getRecort = function (user_id) {
  const time = Date.now()
  return new Promise((resolve, reject) => {
    Users.findByIdAndUpdate(user_id, {
      $addToSet: {
        calendar: [{
          date: time
        }]
      }
    }).exec {
      (err, doc) => {
        if (err) {
          reject(err)
        } else {
          resolve(doc)
        }
      }
    }
  })
}

const clock = function (user_id) {
  return new Promise((resolve, reject) => {
    Clock.findOne({
      user_id
    }).exec((err, doc) => {
      if (doc) {
        resolve('请勿重复打卡')
      } else {
        Clock.create({
          user_id
        }).exec(() => {
          resolve('打卡成功')
        })
      }
    })
  })
}

module.exports = {
  setUsers,getRecort,clock
}