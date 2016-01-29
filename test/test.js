const util=require('../lib/ameutil')
const fs=require('fs')

util.getImage(function(pngimg){
  fs.writeFile('test.png',pngimg)
})
