const Koa = require('koa')
const app = new Koa()
const router = require('./router')
const bodyParser = require('koa-bodyparser')

app.use(bodyParser())
router(app)
app.listen(444, () => {
  console.log('服务端口 444')
})
