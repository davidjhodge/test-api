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

// Handle Errors
pool.on('error', (err) => {
  console.log(error.stack)
});

module.exports = {
  query: (text, params) => pool.query(text, params)
}
