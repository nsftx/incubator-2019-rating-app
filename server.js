const https = require('https');
require('dotenv').config('/.env');

const srv = https.createServer();
const io = require('socket.io')(srv);

io.listen(process.env.SOCKET_PORT);

module.exports = io;
