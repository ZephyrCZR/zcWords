const Users = require('../models/user/user')
const utils = require('../common/utils')
// require('./connect')



const getUserInfo = function (user_id) {
  return new Promise((resolve, reject) => {
    Users.findById(user_id).exec((err, doc) => {
      if (err) {
        reject(err)
      }else{
        resolve(doc)
      }      
    })
  })
}

/**操作用户信息表
 * 
 * @param {查询目标} query 
 * @param {目标结果} target 
 */
const setUsers = function (query, target) {
  return new Promise((resolve, reject) => {
    Users.findOneAndUpdate(query, {
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
 * 
 * 接受用户id，最后一张日记表：
 * 失败则返回false (通过resolve) 
 * uInfo：{
		_id: INFO._id,
		calendar: INFO.calendar[INFO.calendar.length-1]
	}
 * @param {用户id} user_id 
 */
const getRecort = function (uInfo) {
   //系统日期：
  let sysdate = utils.dateFormat(Date.now() - 4*60*60*1000) //慢4个小时

  return new Promise((resolve, reject) => {
    //查系统服务记录表，判断当前用户是否已创建今日记录表，若未创建则创建，已创建，则返回用户信息表
    console.log(uInfo);
    const user_id = uInfo._id
    Users.findOne({
      '_id': user_id,
      'calendar.date': sysdate
    }).exec((err, doc) => {
      if (err) {
        reject(err)
      }
      //判断该用户今日是否已创建记录表
      if (doc) {
        resolve(doc)
        console.log('该用户今日记录表已存在');
      } else {
        //如果 uInfo.calendar 有数据
        if (uInfo.calendar) {
          //同步用户上传的calendar数据（理论上不存在两个未同步的calendar文档，所以只同步用户上传的那个（最新的）就够了）
          Users.updateOne({
            "_id": user_id,
            "calendar.date": uInfo.calendar.date
          }, {
            $set: {
              "calendar.$.learn": uInfo.calendar.learn,
              "calendar.$.review": uInfo.calendar.review,
              "calendar.$.duration": uInfo.calendar.duration,
            }
          })
        }


        //添加今日记录表
        Users.findByIdAndUpdate(user_id, {
          $addToSet: {
            calendar: [{
              "date": sysdate
            }]
          }
        },{new: true}).exec((err, uInfo) => {
          if (err) {
            reject(err)
          } else {
            if (uInfo) {
              console.log('该用户今日记录表创建成功')
              // 返回用户信息表
              resolve(uInfo)
            } else {
              reject('该用户不存在')
            }
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
  //系统日期：
  let sysdate = utils.dateFormat(Date.now() - 4*60*60*1000) //慢4个小时
  return new Promise((resolve, reject) => {
    console.log(user_id);
    Users.findOneAndUpdate({
      "_id": user_id,
      "calendar.date": sysdate,
      "calendar.clock": false
    }, {
      $set: {
        "calendar.$.clock": true,
      },
      $inc: {
        "star_coin": 10
      }
    }, {
      new: true
    }).exec((err, doc) => {
      if (err) {
        console.log(err);
        reject('服务器出错了')
      } else if (doc) {
        console.log(doc);
        resolve(doc)
      } else {
        reject('请不要重复签到')
      }
    })
  })
}


module.exports = {
  setUsers,
  getRecort,
  clock,
  getUserInfo
}