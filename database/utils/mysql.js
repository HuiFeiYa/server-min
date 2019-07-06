const mysql = require('mysql')
const pool = mysql.createPool({
  host: '118.31.127.58',
  user: 'root',
  password: 'password',
  database: 'minprogram'
})
module.exports = function(sql) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err)
      console.log('连接 host 118.31.127.58 成功')
      connection.query(sql, function(error, results, fields) {
        if (error) reject(error)
        resolve(results)
      })
    })
  })
}
