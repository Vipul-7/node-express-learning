const mysql = require("mysql2");

// connectionpool give us the way so that we don't need to make and close connection for every query
const connectionPool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "learning-node",
  password: "12345",
});

module.exports = connectionPool.promise()
