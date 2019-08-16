const http = require('http');
require('dotenv').config('/.env');

const srv = http.createServer();
const io = require('socket.io')(srv);

io.listen(process.env.SOCKET_PORT);

module.exports = io;
