// const sha256 = require('sha256')

// module.exports.encrypt = function (data) {  
//   return sha256(data + "Zephyr")
// }

module.exports.lateDays = function (timestamp, days) {
  let ms = 86400000 * days
  return timestamp + ms
}
