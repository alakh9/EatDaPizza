var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require('method-override')
var path = require('path');

var app = express();
var PORT = process.env.PORT ||  3000;

app.use(methodOverride('X-HTTP-Method-Override'))


// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var exphbs = require("express-handlebars");

app.use(express.static(path.join(__dirname, 'public')));
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

app.post("/newPizza", function(req, res) {
  
  connection.query("INSERT INTO pizzas (pizza_name) VALUES (?)", [req.body.make], function(err, result) {
    if (err) throw err;

    res.redirect("/");
  });
});

app.post("/devourPizza", function(req, res) {
  console.log("devour works")
  connection.query("UPDATE pizzas SET devoured = 1 WHERE id = ?", [req.body.pizzaId], function(err, result){
    res.redirect("/")
  });

});


// app.post("/redoPizza", function(req, res) {
  
//     connection.query("UPDATE pizzas set devoured (pizza_name) VALUES (?)", [req.body.redo], function(err, result) {
//       if (err) throw err;
  
//       res.redirect("/");
//     });
// });


app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});