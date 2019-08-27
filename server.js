const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
require('dotenv').config('/.env');

const server = https.createServer({
    key: fs.readFileSync('./private-key.pem'),
    cert: fs.readFileSync('./public-cert.pem'),
    ca: fs.readFileSync('./public-cert.pem'),
});
const wss = new WebSocket.Server({
    server,
});

wss.on('connection', (ws) => {
    wss.on('newRating', (data) => {
        ws.send(JSON.stringify(data));
    });
});

server.listen(process.env.SOCKET_PORT);

module.exports = wss;

/* const https = require('https');
const fs = require('fs');
require('dotenv').config('/.env');

const srv = https.createServer({
    key: fs.readFileSync('./private-key.pem'),
    cert: fs.readFileSync('./public-cert.pem'),
    ca: fs.readFileSync('./public-cert.pem'),
    passphrase: 'Newsmay1!',
});
const io = require('socket.io')(srv);

io.set('transports', [
    'websocket',
]);

io.listen(process.env.SOCKET_PORT);

module.exports = io;
 */
