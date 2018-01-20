var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require('method-override')
var path = require('path');

var app = express();
var PORT = 3000;

app.use(methodOverride('X-HTTP-Method-Override'))


// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var exphbs = require("express-handlebars");

app.use(express.static(path.join(__dirname, 'app/public')));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "pizza_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

app.get("/", function(req, res) {
  // res.send("hello world");
  connection.query("SELECT * FROM pizzas;", function(err, data) {
    if (err) throw err;


    res.render("index", { pizzas: data });
  });
});

app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});