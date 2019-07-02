const Router = require('koa-router')
const { login } = require('./controller')
const auth = require('../middlewares/index')
const router = new Router()
module.exports = app => {
  router.post('/login', auth, login)
  app.use(router.routes())
}
