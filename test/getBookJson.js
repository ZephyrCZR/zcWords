const fs = require('fs')
const path = require('path')

// console.log(__dirname);

fs.readFile(path.join(__dirname,'../public/books/wordres.json'),(err,data) =>{
  if (err) {
    console.log(err);
  }else{
    const words = JSON.parse(data.toString()) 
    let target = words.findOne((el) => el.word == 'minute')
    console.log(target);
  }
})