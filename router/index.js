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
const koaBody = require('koa-body')
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
  router.post(
    '/upload',
    koaBody({
      multipart: true, // 支持文件上传
      encoding: 'gzip',
      formidable: {
        // uploadDir: path.join(__dirname, 'uploads'), // 设置文件上传目录
        keepExtensions: true, // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
        onFileBegin: (name, file) => {
          // 文件上传前的设置
          // 获取文件后缀
          // const ext = getUploadFileExt(file.name)
          // 最终要保存到的文件夹目录
          // const dir = path.join(__dirname, `uploads/${getUploadDirName()}`)
          // 检查文件夹是否存在如果不存在则新建文件夹
          // checkDirExist(dir)
          // 重新覆盖 file.path 属性
          const filename = file.name
            .split('.')
            .slice(2)
            .join('.')
          console.log('file-----', filename)
          // 设置最终文件路径的位置，前面没有加决定路径默认拼接文件夹根路径
          file.path = 'uploads/' + filename
        },
        onError: err => {
          console.log(err)
        }
      }
    }),
    upload.single('avatar'),
    photoUpload
  )
  router.post('/phot-add', photoInsert)
  app.use(router.routes())
}
