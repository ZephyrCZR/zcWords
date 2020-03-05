const sha256 = require('sha256')

module.exports.getToken = function (uid) {  
  return sha256(uid + Date.now() + "Hello! I am Zephyr")
}
module.exports.encrypt = function (data) {  
  return sha256(data + "Zephyr")
}

module.exports.lateDays = function (timestamp, days) {
  let ms = 86400000 * days
  return timestamp + ms
}
