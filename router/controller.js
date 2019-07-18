const {
  findAll,
  insertLogin,
  findOne
} = require('../database/model/login/action')
const {
  findAllStep,
  findByName
} = require('../database/model/stepToday/actions')
const { findAllPhoto, insertPhoto } = require('../database/model/photo/action')
const { backClient, dealUploadFile } = require('./utils/index')
const { getSession } = require('./business')
const WXBizDataCrypt = require('./utils/WXBizDataCrypt')
const { encode, decode } = require('./utils/crypto')
const connect = require('../database/utils/mysql')
const appId = 'wxc61d58d3c32c497e'
const {
  getUploadFileName,
  getUploadFileExt,
  checkDirExist,
  getUploadDirName
} = require('../utils/file')
const path = require('path')
const fs = require('fs')
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
// 更新view star数
async function updateTimes(ctx) {
  // update times set userid = 122 where id =1;
  const { userid, eyeClick, starClick, forkClick } = ctx.request.body

  const all = await connect('select * from times ')
  let {
    view,
    star,
    fork,
    userid: id,
    isClick,
    isStarClick,
    isForkClick
  } = all[0]

  if (
    Number(userid) !== id ||
    (eyeClick === undefined &&
      starClick === undefined &&
      forkClick === undefined)
  ) {
    backClient(ctx, { view, star, fork, isClick, isStarClick, isForkClick })
  } else {
    if (eyeClick !== undefined) {
      // 判断是否点击更新数据库中 是否点击状态和 view次数
      const times = eyeClick === '0' ? ++view : --view
      const isClick = eyeClick === '0' ? 1 : 0
      await connect(
        `update times set view=${times} ,isClick=${isClick},userid = ${userid} where id =1`
      )
      backClient(ctx, {
        view: times,
        star,
        fork,
        isClick,
        isStarClick,
        isForkClick
      })
      // 更新star的次数 和点击状态
    } else if (starClick !== undefined) {
      const times1 = starClick === '0' ? ++star : --star
      const isStarClick = starClick === '0' ? 1 : 0
      await connect(
        `update times set star=${times1} ,isStarClick=${isStarClick},userid = ${userid} where id =1`
      )
      backClient(ctx, {
        view,
        star: times1,
        fork,
        isClick,
        isStarClick,
        isForkClick
      })
      // 更新 fork的状态 和点击次数
    } else if (forkClick !== undefined) {
      const times2 = forkClick === '0' ? ++fork : --fork
      const isForkClick = forkClick === '0' ? 1 : 0
      await connect(
        `update times set fork=${times2} ,isForkClick=${isForkClick},userid = ${userid} where id =1`
      )
      backClient(ctx, {
        view,
        star,
        fork: times2,
        isClick,
        isStarClick,
        isForkClick
      })
    }
  }
}

// life 图片分享
async function shareLife(ctx) {
  const { pageIndex, size } = ctx.request.body
  const all = await connect('select * from  life order by id')
  all.reverse()
  const list = all.slice(size * pageIndex, size * pageIndex + 3)
  backClient(ctx, { list, total: all.length })
}
async function insertLife(ctx) {
  const { pic, content } = ctx.request.body

  await connect(`insert into life (pic,content) values('${pic}','${content}');`)
  backClient(ctx, null)
}
// 采用fs写入流 ，将http传递的流写入的文件夹下
async function uploadLife(ctx) {
  dealUploadFile(ctx, 'https://nodefly.club/')
}
// 历史步数
async function historyStep(ctx) {
  const all = await connect('select * from history')
  backClient(ctx, all)
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
  const all = await connect('select * from photos order by id')

  all.reverse()
  const list = all.slice(size * pageIndex, size * pageIndex + 3)
  backClient(ctx, { list, total: all.length })
}

// 图片上传
async function photoUpload(ctx) {
  dealUploadFile(ctx)
}

async function photoInsert(ctx) {
  const { content, picPath } = ctx.request.body
  let id = Math.random() * 10000
  unionid = id.toFixed(0)
  await insertPhoto({
    content,
    pic: picPath,
    unionid,
    time: new Date().getTime()
  })
  backClient(ctx, null)
}

module.exports = {
  login,
  test,
  todayStep,
  getPhoto,
  photoUpload,
  photoInsert,
  shareLife,
  insertLife,
  uploadLife,
  historyStep,
  updateTimes
}
