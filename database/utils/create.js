const Sequelize = require('sequelize')
module.exports = ({
  database,
  name = 'root',
  password = 'password',
  host = '118.31.127.58'
}) => {
  const sequelize = new Sequelize(database, name, password, {
    host,
    dialect: 'mysql'
  })
  sequelize
    .authenticate()
    .then(() => {
      console.log(host + 'mysql connect is success')
    })
    .catch(err => {
      console.log('连接失败:' + err)
    })
  // 返回model对象
  return (table, params, options) => sequelize.define(table, params, options)
}
