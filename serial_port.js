// Program to receive data from a serial port and send it to another serial port
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Created two virtual serial ports using "Virtual Serial Port Driver"
const sendingPortName = 'COM3';
const receivingPortName = 'COM4';

// Our data sending port
const sendingPort = new SerialPort({
    path: sendingPortName,
    baudRate: 9600
});

// And data receiving port
const receivingPort = new SerialPort({
    path: receivingPortName,
    baudRate: 9600
});

// Parse data from stream data into readable information
const parser = receivingPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// When data is received we are using console to display it
parser.on('data', (data) => {
    console.log(`Received on ${receivingPortName}: ${data}`);
});


sendingPort.on('error', (err) => {
    console.error(`Error on ${sendingPortName}:`, err.message);
});

receivingPort.on('error', (err) => {
    console.error(`Error on ${receivingPortName}:`, err.message);
});


sendingPort.on('close', () => {
    console.log(`${sendingPortName} closed`);
});

receivingPort.on('close', () => {
    console.log(`${receivingPortName} closed`);
});


function sendDataContinuously() {
    let counter = 0;

    setInterval(() => {
        const data = `Message ${counter}`;
        console.log(`Sending: ${data}`);

        // Sending data
        sendingPort.write(`${data}\r\n`, (err) => {
            if (err) {
                return console.error(`Error writing to ${sendingPortName}:`, err.message);
            }
        });

        counter++;
    }, 1000);
}


sendingPort.on('open', () => {
    console.log(`${sendingPortName} is open. Starting to send data...`);
    sendDataContinuously();
});


receivingPort.on('open', () => {
    console.log(`${receivingPortName} is open and ready to receive data.`);
});
