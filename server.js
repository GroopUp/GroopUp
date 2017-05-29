var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var cookieParser = require('cookie-parser');
var exphbs = require("express-handlebars");
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var passport = require('passport');
var passportConfig = require("./config/passport");
var session = require("express-session");
var LocalStrategy = require('passport-local').Strategy;
var methodOverride = require("method-override");
var bcryptjs = require("bcryptjs");
var db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();

app.use("/public", express.static(__dirname+"/public"));
// View Engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cookieParser());


// // Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// // Passport init
app.use(passport.initialize());
app.use(passport.session());

// // Express Validator
// app.use(expressValidator({
//   errorFormatter: function(param, msg, value) {
//       var namespace = param.split('.')
//       , root    = namespace.shift()
//       , formParam = root;

//     while(namespace.length) {
//       formParam += '[' + namespace.shift() + ']';
//     }
//     return {
//       param : formParam,
//       msg   : msg,
//       value : value
//     };
//   }
// }));

// // Connect Flash
// app.use(flash());

// // Global Vars
// app.use(function (req, res, next) {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   res.locals.user = req.user || null;
//   next();
// });

var routes = require("./controllers/controller.js");

app.use("/", routes);


// Syncing our sequelize models and then starting our express app
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});

