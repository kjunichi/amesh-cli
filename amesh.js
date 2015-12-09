#!/usr/bin/env node

"use strict";

const http = require('http');

const tc = require('ansi-canvas');
const Canvas = require('canvas');
const ameutil = require('./ameutil');

// create terminal <canvas>
const canvas = tc();
const ctx = canvas.getContext('2d');

const screenWidth = canvas.width;
const maxWidth = screenWidth;

let bufary = []

function getImage(idx, urls, cb) {
  if (idx < 0) {
    cb(bufary)
    return
  }
  console.log(urls[idx])
  http.get(urls[idx--], function(res) {

    let imgary = [];
    res.on('data', function(chunk) {
      //console.log('BODY: ' + chunk);
      imgary.push(chunk);
    });
    res.on('end', function() {
      console.log('No more data in response.' + imgary.size);
      //display(Buffer.concat(imgary));
      bufary.push(Buffer.concat(imgary))

      getImage(idx, urls, cb);
    });
  });
}

function display(imgdata) {
  const img = new Canvas.Image();
  img.src = imgdata;

  var width = maxWidth;
  var scaleW = img.width > width ? width / img.width : 1;
  var w = Math.floor(img.width * scaleW);
  var h = Math.floor(img.height * scaleW);

  ctx.drawImage(img, 0, 0, w, h);

  //  canvas.render();
}

let urls = [];
urls.push(ameutil.getAmeshImageUrl());
urls.push(ameutil.getMskImageUrl());
urls.push(ameutil.getMapImageUrl());

getImage(urls.length - 1, urls, function(imgs) {
  display(imgs[0]);
  //display(imgs[1]);
  display(imgs[2]);
  canvas.render();
	console.log(ameutil.getAmeshImageUrl());
})
