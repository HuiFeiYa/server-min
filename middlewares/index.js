const { decode } = require('../router/utils/crypto')
const { findByUnionid } = require('../database/model/login/action')
const { backClient } = require('../router/utils/index')
// 统一获取token值
module.exports = async function(ctx, next) {
  const { token } = ctx.request.body
  if (!token) {
    // 没有传token，并且路径为 /login 则跳转去登陆 否则报错token未传
    if (ctx.url === '/login') {
      await next()
    } else {
      backClient(ctx, null, 1, 'token未传')
    }
    return
  }
  const { unionid, timespan } = decode(token)

  // 查找数据库中是否存在该 openid，返回是一个数组，如果不存在则返回[]
  const targetList = await findByUnionid(unionid)
  const timestamp = targetList[0].timestamp
  if (targetList.length > 0) {
    // 如果超过设定的过期时间，标记isExpired字段为登陆过期
    const oneHour = 1000 * 60
    if (Date.now() / 1000 - timestamp > oneHour) {
      ctx.state.isExpired = true
      backClient(ctx, null, 1, '登陆过期')
      return
    } else {
      const { name, unionid, avatar, userType } = targetList[0]
      // 将从数据库中获取的数据存放在 ctx.state对象下，供所以中间件使用
      ctx.state.user = {
        name,
        unionid,
        avatar,
        userType
      }
    }
  } else {
    // 通过ctx.throw可以直接抛出错误
    ctx.throw(401, '登陆失败')
  }
  await next()
}
