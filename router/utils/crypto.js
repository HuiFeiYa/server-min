const crypto = require('crypto')
const secret = '2019_06'
const algorithm = 'aes-256-cbc'

function encode(id) {
  const encoder = crypto.createCipher(algorithm, secret)
  const str = [id, secret].join('|')
  let encrypted = encoder.update(str, 'utf8', 'hex')
  encrypted += encoder.final('hex')
  return encrypted
}

function decode(str) {
  const decoder = crypto.createDecipher(algorithm, secret)
  let decoded = decoder.update(str, 'hex', 'utf8')
  decoded += decoder.final('utf8')
  const arr = decoded.split('|')
  return {
    unionid: arr[0],
    timespan: parseInt(arr[1])
  }
}
module.exports = {
  encode,
  decode
}
