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
  const formatted = now.toFormat("YYYYMMDDHH24")
  const mm5 = ("0" + (((now.toFormat("MI")-5) / 5) | 0) * 5).slice(-2)
  return AMESH_BASE_URL + mesh + formatted + mm5 + ".gif"
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

function getImage(idx, urls, cb) {
  if (idx < 0) {
    cb(bufary)
    return
  }
  //console.log(urls[idx])
  http.get(urls[idx--], function(res) {

    let imgary = [];
    res.on('data', function(chunk) {
      //console.log('BODY: ' + chunk);
      imgary.push(chunk);
    });
    res.on('end', function() {
      //console.log('No more data in response.' + imgary.size);
      //display(Buffer.concat(imgary));
      bufary.push(Buffer.concat(imgary))

      getImage(idx, urls, cb);
    });
  });
}

exports.getImage = function(w,h,cb) {
  function display(imgdata) {
    const img = new Canvas.Image();
    img.onload = function() {
      const width = canvas.width;
      const scaleW = img.width > width ? width / img.width : 1;
      const w = Math.floor(img.width * scaleW);
      const h = Math.floor(img.height * scaleW);
      console.log("w,h"+w+","+h)
      ctx.drawImage(img, 0, 0, w, h);
    }
    img.src = imgdata;
    //  canvas.render();
  }

  const canvas = new Canvas(w,h)
  const ctx = canvas.getContext('2d')
  const http = require('http')

  let urls = []
  urls.push(getAmeshImageUrl())
  urls.push(getMskImageUrl())
  urls.push(getMapImageUrl())

  getImage(urls.length - 1, urls, function(imgs) {
    display(imgs[0])
    display(imgs[1])
    display(imgs[2])
    //canvas.render();
    cb(canvas.toBuffer())
  })
}