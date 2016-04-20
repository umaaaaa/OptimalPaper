var mysql = require('mysql');

// db connection setup
module.exports = mysql.createPool({
  host: process.env.OP_DB_HOST || 'localhost',
  user: process.env.OP_DB_USER || 'optimalpaper',
  password: process.env.OP_DB_PASS,
  database: process.env.OP_DB_NAME || 'optimalpaper'
});
