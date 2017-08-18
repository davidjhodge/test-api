/**
  Connect to PostgreSQL database.
*/
const { Pool } = require('pg')

const pool = new Pool({
  user: 'davidhodge',
  host: 'localhost',
  database: 'davidhodge',
  password: '',
  port: 5432
});

module.exports = {
  query: (text, params, callback) => {
    const start = Date.now()
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start
      if (res) {
        console.log('executed query', { text, duration, rows: res.rowsCount })
      }
      callback(err, res)
    })
  }
}
