#!/usr/bin/env node

'use strict'

const tc = require('ansi-canvas')
const Canvas = require('canvas')

const util = require('./lib/ameutil')

const canvas = tc()
const ctx = canvas.getContext('2d')

const screenWidth = canvas.width
const maxWidth = screenWidth

const img = new Canvas.Image()

util.getImage(function(pngimg){

  img.src = pngimg

  const width = maxWidth
  const scaleW = img.width > width ? width / img.width : 1
  const w = Math.floor(img.width * scaleW)
  const h = Math.floor(img.height * scaleW)

  ctx.drawImage(img, 0, 0, w, h)

  canvas.render()
})
