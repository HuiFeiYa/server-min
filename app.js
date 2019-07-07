const Koa = require('koa')
const app = new Koa()
const koaBody = require('koa-body')
const router = require('./router')
const bodyParser = require('koa-bodyparser')
const cors = require('./utils/cors')
const static = require('koa-static')
const path = require('path')
const {
  getUploadDirName,
  checkDirExist,
  getUploadFileExt,
  getUploadFileName
} = require('./utils/file')
app.use(
  koaBody({
    multipart: true, // 支持文件上传
    encoding: 'gzip',
    formidable: {
      uploadDir: path.join(__dirname, 'uploads'), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      onFileBegin: (name, file) => {
        // 文件上传前的设置
        // 获取文件后缀
        const ext = getUploadFileExt(file.name)
        // 最终要保存到的文件夹目录
        const dir = path.join(__dirname, `uploads/${getUploadDirName()}`)
        // 检查文件夹是否存在如果不存在则新建文件夹
        checkDirExist(dir)
        // 重新覆盖 file.path 属性
        file.path = `${dir}/${getUploadFileName(ext)}`
      },
      onError: err => {
        console.log(err)
      }
    }
  })
)
app.use(static(path.join(__dirname)))

app.use(bodyParser())
app.use(cors())
router(app)
app.listen(444, () => {
  console.log('服务端口 444')
})
