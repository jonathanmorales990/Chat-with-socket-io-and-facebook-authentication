"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var flash = require('connect-flash');
mongoose.Promise = require('bluebird');
var cors = require('cors');
var socket = require('socket.io');
var configDB = require('./config/database.js');

//=================== ROTAS ===========================================
var facebookAuth = require('./routes/facebookAuth');               /// |
var profile = require('./routes/profile');                         /// |
var loginRoute = require('./routes/login');                        /// | 
var cadastroRoute = require('./routes/cadastro');                  /// | 
var sairRoute = require('./routes/sair');                          /// |
//=====================================================================

var session = require("express-session")({
    secret: 'chat!@$%()$#)@', 
    resave: true,
    saveUninitialized: true
});

var app = express();

var io = socket();
app.io = io;

app.use(flash());

app.use(session);

app.use(passport.initialize());
app.use(passport.session());

var db = mongoose.connection;

db.on('connecting', function() {
  console.log('connecting to MongoDB...');
});

db.on('error', function(error) {
  console.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});
db.on('connected', function() {
  console.log('MongoDB connected!');
});
db.once('open', function() {
  console.log('MongoDB connection opened!');
});
db.on('reconnected', function () {
  console.log('MongoDB reconnected!');
});
db.on('disconnected', function() {
  console.log('MongoDB disconnected!');
  mongoose.connect(configDB.url, {server:{auto_reconnect:true}});
});

mongoose.connect(configDB.url, {server:{auto_reconnect:true}});

process.on('SIGINT', function(params) {
  console.log('Tchau!');
  db.close();
  process.exit();
});

require('./config/socketio')(io, session);
require('./config/passport')(passport);

// view 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', profile);
app.use('/sair',sairRoute);
app.use('/login', loginRoute);
app.use('/auth/facebook', facebookAuth);
app.use('/cadastro', cadastroRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
