const socket = require('socket.io-client')('http://localhost:7000');

socket.on('newSettings', (data) => {
    console.log(data);
});
