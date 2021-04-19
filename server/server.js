const http = require('http').createServer();
const rotateServoMotor = require('./modules/rotateServoMotor');
const arduinoBoard = require('./modules/connectToArduino');

const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
});

io.on('connection', (socket) => {

    socket.emit('welcomeMessage', 'You have been connected via socket io.');

    socket.on('message', (message) => {
        console.log(message);
    });

    socket.on('servoInstructions', (servoInstructions) => {
        console.log(servoInstructions);
        rotateServoMotor(servoInstructions.dataset);
    });

});

http.listen(8080, () => console.log('Listening on http://localhost:8080'));