/* const socket = require('socket.io-client')('https://localhost:7000');

socket.on('connect', () => {
    console.log('connected');
});

socket.on('data', (data) => {
    console.log(data);
});
socket.on('newRating', (data) => {
    console.log(data);
});

socket.on('connect_failed', () => {
    console.log('Connection Failed');
});
 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const WebSocket = require('ws');

const ws = new WebSocket('https://localhost:7000');
ws.on('message', (data) => {
    console.log(data);
});
