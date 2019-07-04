const {
  findAll,
  insertLogin,
  findOne
} = require('../database/model/login/action')
const {
  findAllStep,
  findByName
} = require('../database/model/stepToday/actions')
const { backClient } = require('./utils/index')
const { getSession } = require('./business')
const WXBizDataCrypt = require('./utils/WXBizDataCrypt')
const { encode, decode } = require('./utils/crypto')
const appId = 'wxc61d58d3c32c497e'
// 登陆部分
async function login(ctx) {
  const { code, data, iv, token } = ctx.request.body
  // 请求微信服务获取到session_key，openid
  const session = await getSession(code)
  const { openid, session_key } = session
  // 解密用户unioind
  const pc = new WXBizDataCrypt(appId, session_key)
  const result = pc.decryptData(data, iv)
  let {
    nickName,
    gender,
    avatarUrl,
    watermark: { timestamp },
    unionid
  } = result
  if (!unionid) {
    let id = Math.random() * 10000
    unionid = id.toFixed(0)
  }
  // 将unionid 加密后返回token
  const encryption = encode(unionid)
  // 往数据库插入openid，unionid
  await insertLogin({ openid, gender, avatarUrl, unionid, timestamp, nickName })
  backClient(ctx, encryption)
}
async function test() {
  const result = await findOne('id', 2)
}

// 每日步数
async function todayStep(ctx) {
  const { username } = ctx.request.body

  const all = await findAllStep()
  const target = await findByName('name', username)
  all.forEach(item => {
    item.dataValues.isMe = item.name === target.name
  })
  backClient(ctx, all)
}
module.exports = {
  login,
  test,
  todayStep
}
