const util=require('../lib/ameutil')
const fs=require('fs')

util.getImage(512,512,function(pngimg){
  fs.writeFile('test.png',pngimg)
})
