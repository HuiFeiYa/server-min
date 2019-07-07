const Router = require('koa-router')
const {
  login,
  test,
  todayStep,
  getPhoto,
  photoUpload
} = require('./controller')
const path = require('path')
const auth = require('../middlewares/index')
const router = new Router()

const multer = require('koa-multer')

const storage = multer.diskStorage({
  destination:
    'uploads/' +
    new Date().getFullYear() +
    (new Date().getMonth() + 1) +
    new Date().getDate(),
  filename: function(req, file, cb) {
    let fileFormat = file.name.split('.')
    console.log('fileFormat', fileFormat)

    let filename =
      file.fieldname +
      '-' +
      Date.now() +
      '.' +
      fileFormat[fileFormat.length - 1]
    cb(null, filename)
  }
})

const upload = multer({ storage })

module.exports = app => {
  // 经过auth的筛选，如果过期会直接返回，否则进入login就是登陆
  router.post('/login', auth, login)
  router.post('/test', test)
  router.post('/step/today', todayStep)
  router.post('/photo', getPhoto)
  router.post('/upload', upload.single('avatar'), photoUpload)
  app.use(router.routes())
}
