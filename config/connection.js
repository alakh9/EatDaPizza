
// Connect to node and mysql
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "pizza_db"
});

module.exports = connection;
// then export the connection