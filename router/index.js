const Router = require('koa-router')
const { login, test, todayStep, getPhoto } = require('./controller')
const auth = require('../middlewares/index')
const router = new Router()
const multer = require('multer')
const upload = multer({
  dest: './uploads'
})
module.exports = app => {
  // 经过auth的筛选，如果过期会直接返回，否则进入login就是登陆
  router.post('/login', auth, login)
  router.post('/test', test)
  router.post('/step/today', todayStep)
  router.post('/upload', upload.single('file'), getPhoto)
  app.use(router.routes())
}
