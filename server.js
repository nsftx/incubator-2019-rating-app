const http = require('http');

const srv = http.createServer();
const io = require('socket.io')(srv);

io.listen('7000');

module.exports = io;
