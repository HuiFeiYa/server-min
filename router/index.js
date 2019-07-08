const Router = require('koa-router')
const {
  login,
  test,
  todayStep,
  getPhoto,
  photoUpload,
  photoInsert
} = require('./controller')
const path = require('path')
const auth = require('../middlewares/index')
const router = new Router()
const { fillZero } = require('../utils/date')

const multer = require('koa-multer')

const storage = multer.diskStorage({
  // 使用了 koaBody 该目录未生效
  destination:
    './' +
    new Date().getFullYear() +
    fillZero(new Date().getMonth() + 1) +
    fillZero(new Date().getDate())
  // filename: function(req, file, cb) {
  //   const filename = file.originalname
  //     .split('.')
  //     .slice(2)
  //     .join('.')
  //   console.log('file', filename)
  //   cb(null, filename)
  // }
})

const upload = multer({ storage })

module.exports = app => {
  // 经过auth的筛选，如果过期会直接返回，否则进入login就是登陆
  router.post('/login', auth, login)
  router.post('/test', test)
  router.post('/step/today', todayStep)
  router.post('/photo', getPhoto)
  router.post('/word', async ctx => {
    ctx.body = '<h1>hello word</h1>'
  })
  router.post('/upload', upload.single('avatar'), photoUpload)
  router.post('/phot-add', photoInsert)
  app.use(router.routes())
}
