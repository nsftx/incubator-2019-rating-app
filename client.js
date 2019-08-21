const socket = require('socket.io-client')('https://localhost:7000', {secure:true});

socket.on('newSettings', (data) => {
    console.log(data);
});
socket.on('newRating', (data) => {
    console.log(data);
});
