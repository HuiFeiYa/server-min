const {
  findAll,
  insertLogin,
  findOne
} = require('../database/model/login/action')
const {
  findAllStep,
  findByName
} = require('../database/model/stepToday/actions')
const { findAllPhoto } = require('../database/model/photo/action')
const { backClient } = require('./utils/index')
const { getSession } = require('./business')
const WXBizDataCrypt = require('./utils/WXBizDataCrypt')
const { encode, decode } = require('./utils/crypto')
const appId = 'wxc61d58d3c32c497e'
const {
  getUploadFileName,
  getUploadFileExt,
  checkDirExist,
  getUploadDirName
} = require('../utils/file')
const path = require('path')
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

// 照片分享
async function getPhoto(ctx) {
  const { pageIndex, size } = ctx.request.body
  const all = await findAllPhoto()
  const list = all.slice(size * pageIndex, size * pageIndex + 3)
  backClient(ctx, { list, total: all.length })
}

// 图片上传
async function photoUpload(ctx) {
  // const file = ctx.request.files.avatar
  // const filename = file.name
  //   .split('.')
  //   .slice(2)
  //   .join('.')
  // const picPath = `https://nodefly.club:6002/${filename}`
  console.log('params', ctx.request.files)
  // const filename = ctx.request.files.file.name

  // const ext = getUploadFileExt(filename)
  // const paths = `uploads/${getUploadDirName()}/${getUploadFileName(ext)}`
  // backClient(ctx, picPath)
  backClient(ctx, '成功')
}

// const
module.exports = {
  login,
  test,
  todayStep,
  getPhoto,
  photoUpload
}
