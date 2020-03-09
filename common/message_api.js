var http = require("http");
const KEY = '1b7813acdc3d45f2a6aac34fa5144ea0'

const msgAPI = function (phone, code) {
     var options = {
    "method": "GET",
    "hostname": "apis.haoservice.com",
    "port": null,
    "path": "/sms/send?mobile="+ phone +"&tpl_id="+1279+"&tpl_value=%23code%23%3D"+ code +"&key="+ KEY,
    "headers": {}
  };
  
  var req = http.request(options, function (res) {
    var chunks = [];
  
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });
  
  req.end(); 

}
// msgAPI("17875300024")

// const test = function () {

// console.log(code);
//   var options = {
//     "method": "GET",
//     "hostname": "apis.haoservice.com",
//     "port": null,
//     "path": "/sms/status?&key="+KEY,
//     "headers": {}
//   };
  
//   var req = http.request(options, function (res) {
//     var chunks = [];
//     res.on("data", function (chunk) {
//       chunks.push(chunk);
//     });
  
//     res.on("end", function () {
//       var body = Buffer.concat(chunks);
//       console.log(body.toString());
//     });
//   });
  
//   req.end();
// }
// test()

module.exports = msgAPI