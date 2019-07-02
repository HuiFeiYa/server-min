const jsonMine = 'application/json'
const request = require('request')
const backClient = (ctx, data, code = 0, message = 'success') => {
  ctx.type = jsonMine
  ctx.body = {
    code,
    data,
    message
  }
}
module.exports = {
  backClient
}
