const Users = require('./models/user/user')
const utils = require('../common/utils')
// require('./connect')
//系统日期初始化：
const now = Date.now()
const time = new Date(now)
let sysdate = utils.dateFormat(now)
//系统启动时，若当天时间未超过凌晨四点，则系统日期记录为前一天
if (time.getHours < 4) {
  sysdate = utils.dateFormat(now - 1000 * 60 * 24)
}
console.log("当前系统日期为：" + sysdate);


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
		calendar: INFO.calendar[0]
	}
 * @param {用户id} user_id 
 */
const getRecort = function (uInfo) {
  const now = Date.now()
  const time = new Date(now)
  const date = utils.dateFormat(now)

  return new Promise((resolve, reject) => {

    //判断当前时间，每天时间超过早上4点的第一次接收到请求，刷新系统标记的时间
    //如果系统记录日期不等于当前日期，说明日期发生了变化（过了一天）,并且超过凌晨4点时
    if (sysdate !== date && time.getHours > 4) {
      //更新系统记录的日期
      sysdate = date
      //初始化系统记录表
    }

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
          //同步用户上传的calendar数据（不可能存在两个未同步的calendar文档，所以只同步用户上传的那个（最新的）就够了）
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
        }).exec((err, uInfo) => {
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
        reject('请不要重复打卡')
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