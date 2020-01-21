const jsonMine = 'application/json'
const request = require('request')
const fs = require('fs')
const path = require('path')
const backClient = (ctx, data, code = 0, message = 'success') => {
  ctx.type = jsonMine
  ctx.body = {
    code,
    data,
    message
  }
}
const dealUploadFile = (ctx, prexPath = 'https://nodefly.club/') => {
  const file = ctx.request.files.avatar
  // 格式如 .md .html
  const etc = path.extname(file.name)
  // 获取文件名
  const flieName  = path.basename(file.name,etc)
  const time = new Date().getTime()
  const render = fs.createReadStream(file.path)
  const filePath = flieName + time  + etc
  const writer = fs.createWriteStream(
    path.join(__dirname, `../../uploads/${filePath}`)
  )
  render.pipe(writer)
  console.log('返回客户端的链接', prexPath + filePath)

  backClient(ctx, prexPath + filePath)
}
module.exports = {
  backClient,
  dealUploadFile
}
