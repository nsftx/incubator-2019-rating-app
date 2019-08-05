var http = require('http');
var srv = http.createServer();
var io = require('socket.io')(srv);

io.listen('7000');

 module.exports = io;
