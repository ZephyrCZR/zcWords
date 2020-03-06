const Users = require('./models/user/user')
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