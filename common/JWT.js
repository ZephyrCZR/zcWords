const jwt = require('jsonwebtoken')

const SECRET = 'Zephyr'

const getJWT = function (user) {
  // 默认情况 Token 必须以 Bearer+空格 开头
  const token = 'Bearer ' + jwt.sign({
    _id: user.user_id,
    ban: user.permission === 0
  }, SECRET, {
    expiresIn: 3600 * 24 * 7
  })

  return token
}

module.exports = getJWT