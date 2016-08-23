var express = require('express');
var app  = express();
var socket_io = require("socket.io");
var server = require('http').createServer(app);
var io = socket_io(server);
var router = require('./routes/index')(io)
var path = require('path');



app.use('/', router);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


server.listen('8081')
console.log('Magic happens on port 8081');

exports = module.exports = app;
