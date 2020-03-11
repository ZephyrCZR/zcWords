const Users = require('./models/user/user')
const Clock = require('./models/server/clockSheet')

const utils = require('../common/utils')
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

/**若成功则生成新的每日记录项，并返回整个文档 (通过resolve)
 * 失败则返回false (通过resolve)
 * @param {用户id} user_id 
 */
const getRecort = function (uInfo) {
  const time = utils.dateFormat(Date.now())
  return new Promise((resolve, reject) => {
    //查系统服务记录表，判断当前用户是否已创建今日记录表，若未创建则创建，已创建，则返回提示
    console.log(uInfo);
    const user_id = uInfo._id
    Clock.findOne({
      user_id 
    }).exec((err, doc) => {
      if (err) {
        reject(err)
      }
      //判断该用户今日是否已创建记录表
      if (doc) {
        resolve(false)
        console.log('该用户今日记录表已存在');
      } else {
        //同步用户上传的calendar数据
        Users.findByIdAndUpdate(user_id, {
          calendar: uInfo.calendar
        })

        //添加今日记录表
        Users.findByIdAndUpdate(user_id, {
          $addToSet: {
            calendar: [{
              date: time
            }]
          }
        }).exec((err, uInfo) => {
          if (err) {
            reject(err)
          } else {
            //写入服务器记录表
            Clock.create({
              'user_id': user_id
            }).then(() => {
              console.log('该用户今日记录表创建成功')
              // 返回用户信息表
              resolve(uInfo)
            })
          }
        })
      }
    })
  })
}


/**签到 (可能有问题)
 * 
 * @param {*} user_id 
 */
const clock = function (user_id) {
  const time = utils.dateFormat(Date.now())
  return new Promise((resolve, reject) => {

    Users.updateOne({
      "user_id": user_id,
      "calendar.date": time,
      "calendar.clock": false
    }, {
      $set: {
        "calendar.$.clock": true
      }
    }, (err, doc) => {
      if (err) {
        reject(err)
      } else if(doc){
        resolve('打卡成功！')
      } else {
        resolve('请不要重复打卡')
      }
    })
  })
}

module.exports = {
  setUsers,
  getRecort,
  clock
}