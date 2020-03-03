

let foo = new Promise(
  function (fun) {
    setTimeout(function () {
      let a = 100
      fun(a)
    }, 0)
  }
)

foo(function (ar) {
  console.log(ar);
 
}).then(
  console.log(ar)
  // global.b = ar
)

// console.log(global.b);