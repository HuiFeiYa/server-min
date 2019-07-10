const Koa = require('koa')
const app = new Koa()

const router = require('./router')
const bodyParser = require('koa-bodyparser')
const cors = require('./utils/cors')
const path = require('path')

// app.use(static(path.join(__dirname)))
app.use(bodyParser())
app.use(cors())
router(app)

app.listen(8083, () => {
  console.log('服务端口 8083')
})
