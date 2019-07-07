const fs = require('fs')
function getUploadDirName() {
  const date = new Date()
  let month = Number.parseInt(date.getMonth()) + 1
  month = month.toString().length > 1 ? month : `0${month}`
  const dir = `${date.getFullYear()}${month}${date.getDate()}`
  return dir
}

function checkDirExist(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p)
  }
}
function getUploadFileExt(name) {
  let ext = name.split('.')
  return ext[ext.length - 1]
}
function getUploadFileName(ext) {
  return `${Date.now()}${Number.parseInt(Math.random() * 10000)}.${ext}`
}
module.exports = {
  getUploadDirName,
  checkDirExist,
  getUploadFileExt,
  getUploadFileName
}
