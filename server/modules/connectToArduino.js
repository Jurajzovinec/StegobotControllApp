const { Board } = require("johnny-five");

const arduinoBoard = new Board({ port: "COM5" });

module.exports = arduinoBoard;
global.arduinoBoard = arduinoBoard
