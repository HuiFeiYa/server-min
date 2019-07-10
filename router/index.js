const Router = require('koa-router')
const {
  login,
  test,
  todayStep,
  getPhoto,
  photoUpload,
  photoInsert,
  shareLife,
  insertLife,
  uploadLife
} = require('./controller')
const path = require('path')
const auth = require('../middlewares/index')
const router = new Router()
const { fillZero } = require('../utils/date')
const koaBody = require('koa-body')
module.exports = app => {
  // 经过auth的筛选，如果过期会直接返回，否则进入login就是登陆
  router.post('/login', auth, login)
  router.post('/test', test)
  router.post('/step/today', todayStep)
  router.post('/photo', getPhoto)
  router.post('/photo-life', auth, shareLife)
  router.post('/life-add', auth, insertLife)
  router.post('/life-upload', koaBody({ multipart: true }), uploadLife)
  router.post('/upload', koaBody({ multipart: true }), photoUpload)
  router.post('/phot-add', photoInsert)
  app.use(router.routes())
}
