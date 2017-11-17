'use strict'

require('date-utils')
const http = require('http')
const Canvas = require('canvas')

const AMESH_BASE_URL = "http://tokyo-ame.jwa.or.jp"
  // 地形図
const map000 = "/map/map000.jpg"
  // 地名図
const msk000 = "/map/msk000.png"

const mesh = "/mesh/000/"

const getAmeshImageUrl = function() {
  const now = new Date()
  now.setMinutes(now.getMinutes() -5);
  if(now.getTimezoneOffset() == 0) {
    now.setHours(now.getHours() + 9);
  }
  const formatted = now.toFormat("YYYYMMDDHH24")
  const min = now.toFormat("MI")
  const minv=min.split("")
  let min2
  if(minv[1]<5) {
    min2 = minv[0]+"0"
  } else {
    min2 = minv[0]+"5"
  }
  
  return `${AMESH_BASE_URL}${mesh}${formatted}${min2}.gif`
}
exports.getAmeshImageUrl = getAmeshImageUrl

const getMapImageUrl = function() {
  return AMESH_BASE_URL + map000
}
exports.getMapImageUrl = getMapImageUrl

const getMskImageUrl = function() {
    return AMESH_BASE_URL + msk000
}
exports.getMskImageUrl = getMskImageUrl

//console.dir(ameutil)

let bufary = []
let canvas=null

function getImage(idx, urls, cb) {
  if (idx < 0) {
    cb(bufary)
    return
  }
  //console.log(urls[idx])
  http.get(urls[idx--], (res) => {

    let imgary = [];
    res.on('data', (chunk) => {
      //console.log('BODY: ' + chunk);
      imgary.push(chunk);
    });
    res.on('end', () => {
      //console.log('No more data in response.' + imgary.size);
      //display(Buffer.concat(imgary));
      bufary.push(Buffer.concat(imgary))
      setTimeout(()=>{
        getImage(idx, urls, cb);
      },100);
    });
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });
}

exports.getImage = function(cb) {

  function display(imgdata) {
    const img = new Canvas.Image();
    img.onload = function() {
      if(!canvas) {
        canvas = new Canvas(img.width,img.height)
        ctx = canvas.getContext('2d')
      }
      // debug
      if(ctx.drawImage) {
        ctx.drawImage(img, 0, 0, img.width, img.height)
      } else {
        console.log(`Oops I have no context#drawImage function!`)
      }
    }
    img.src = imgdata
  }
  bufary = []

  let ctx = {}
  const http = require('http')

  let urls = []
  urls.push(getAmeshImageUrl())
  urls.push(getMskImageUrl())
  urls.push(getMapImageUrl())
  canvas=null
  getImage(urls.length - 1, urls, (imgs) => {
    display(imgs[0])
    display(imgs[2])
    display(imgs[1])
    cb(canvas.toBuffer())
  })
}
