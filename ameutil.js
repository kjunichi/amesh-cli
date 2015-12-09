require('date-utils')

const AMESH_BASE_URL = "http://tokyo-ame.jwa.or.jp"
  // 地形図
const map000 = "/map/map000.jpg"
  // 地名図
const msk000 = "/map/msk000.png"

const mesh = "/mesh/000/"

exports.getAmeshImageUrl = function() {
  const now = new Date()
  const formatted = now.toFormat("YYYYMMDDHH24")
  const mm5 = ("0" + ((now.toFormat("MI") / 5) | 0) * 5).slice(-2)
  return AMESH_BASE_URL + mesh + formatted + mm5 + ".gif"
};

exports.getMapImageUrl = function() {
  return AMESH_BASE_URL + map000
};

exports.getMskImageUrl = function() {
    return AMESH_BASE_URL + msk000
};
