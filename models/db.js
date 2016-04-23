var mysql = require('mysql');

// db connection setup
var db = mysql.createPool({
  host: process.env.OP_DB_HOST || 'localhost',
  user: process.env.OP_DB_USER || 'optimalpaper',
  password: process.env.OP_DB_PASS || 'develop',
  database: process.env.OP_DB_NAME || 'optimalpaper'
});

db.queryPromise = function(query, param) {
  return new Promise(function(resolve, reject) {
    db.query(query, param,
        function(err, res) {
          if (err) return reject(err);
          resolve(res);
        });
  });
};

module.exports = db;
