const request = require('request')
async function getSession(code) {
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=wxc61d58d3c32c497e&secret=03b5dc2d2275f95782c8efbffcdcd740&js_code=${code}&grant_type=authorization_code`
  return new Promise((resolve, reject) => {
    request(
      url,
      {
        method: 'GET',
        json: true
      },
      (error, res, body) => {
        if (error) {
          reject(error)
        } else {
          if (body.errcode) {
            reject(new Error(body.errmsg))
          } else {
            resolve(body)
          }
        }
      }
    )
  })
}
module.exports = {
  getSession
}
