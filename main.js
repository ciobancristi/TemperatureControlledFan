/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
'use strict';
console.log('Initializing .....'); //write the mraa version to the Intel XDK console

var ledState = true; //Boolean to hold the state of Led

var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var connectedUsersArray = [];
var userId;

app.get('/', function (req, res) {
    //Join all arguments together and normalize the resulting path.
    res.sendFile(path.join(__dirname + '/client', 'index.html'));
});

//Allow use of files in client folder
app.use(express.static(__dirname + '/client'));
app.use('/client', express.static(__dirname + '/client'));

// //Socket.io Event handlers
// io.on('connection', function (socket) {
//     console.log("\n Add new User: u" + connectedUsersArray.length);
//     if (connectedUsersArray.length > 0) {
//         var element = connectedUsersArray[connectedUsersArray.length - 1];
//         userId = 'u' + (parseInt(element.replace("u", "")) + 1);
//     }
//     else {
//         userId = "u0";
//     }
//     console.log('a user connected: ' + userId);
//     io.emit('user connect', userId);
//     connectedUsersArray.push(userId);
//     console.log('Number of Users Connected ' + connectedUsersArray.length);
//     console.log('User(s) Connected: ' + connectedUsersArray);
//     io.emit('connected users', connectedUsersArray);

//     socket.on('user disconnect', function (msg) {
//         console.log('remove: ' + msg);
//         connectedUsersArray.splice(connectedUsersArray.lastIndexOf(msg), 1);
//         io.emit('user disconnect', msg);
//     });

//     socket.on('chat message', function (msg) {
//         io.emit('chat message', msg);
//         console.log('message: ' + msg.value);
//     });

//     socket.on('toogle led', function (msg) {
//         myOnboardLed.write(ledState ? 1 : 0); //if ledState is true then write a '1' (high) otherwise write a '0' (low)
//         msg.value = ledState;
//         io.emit('toogle led', msg);
//         ledState = !ledState; //invert the ledState
//         changeLED();
//     });
//     socket.on('regulate', function (msg) {
//         //regulateTemp(msg.val);
//         setTemp(msg.val);
//     })

//     console.log("starting sensors");
//     startSensorWatch(socket);
//     //regulateTemp();
// });

// var mraa = require("mraa");

// var temperaturePin = new mraa.Aio(3);

// var ref = { val: 100 };
// var setTemp = function (val) {
//     ref.val = val;
// }
// function startSensorWatch(socket) {

//     setInterval(function () {
//         var temperature = getTemperature();
//         console.log('temp reg', ref.val);
//         regulateTemp(ref.val);
//         socket.emit("temperature", temperature);
//     }, 10000);
// }

// var cfg = require("./cfg-app-platform.js")();          // init and config I/O resources

// console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");

// var led = new cfg.mraa.Gpio(8, cfg.ioOwner, cfg.ioRaw);
// led.dir(cfg.mraa.DIR_OUT);
// var fan = new cfg.mraa.Gpio(7, cfg.ioOwner, cfg.ioRaw);
// fan.dir(cfg.mraa.DIR_OUT);

// var startFan = function () {
//     fan.write(1);
// }

// var stopFan = function () {
//     fan.write(0);
// }

// var changeLED = function () {
//     var ledState = led.read();
//     led.write(ledState ? 0 : 1);
//     console.log('Ledstate: ', ledState)
// }

// var enabled = true;
// var regulateTemp = function (refTemp) {
//     if (enabled) {
//         console.log('regulate ', refTemp);
//         var temp = getTemperature();
//         if (temp > refTemp) {
//             startFan();
//             led.write(1);
//         }
//         else {
//             stopFan();
//             led.write(0);
//         }
//     } else {
//         stopFan();
//         led.write(0);
//     }
// }

var getLedState = function () {
    return 1;
    //return led.read();
}

var getFanState = function () {
    return 1;
    //return fan.read();
}

var getTemperature = function () {
    return 23.3;
    //return temperaturePin.read() * 0.488758553;
}

var disableRegulator = function () {
    enabled = false;
}

var enableRegulator = function () {
    enabled = true;
}

var router = express.Router();

router.get('/getLedState', function (req, res) {
    res.json({ ledState: getLedState() });
});
router.get('/getFanState', function (req, res) {
    res.json({ fanState: getFanState() });
});
router.get('/getTemperature', function (req, res) {
    res.json({ temperature: getTemperature() });
});
router.get('/enableRegulator', function (req, res) {
    enableRegulator();
    res.json({ regulatorState: enabled });
});
router.get('/disableRegulator', function (req, res) {
    disableRegulator();
    res.json({ regulatorState: enabled });
});

app.use('/api', router);

http.listen(3000, function () {
    console.log('Web server Active listening on *:3000');
});

// http://www.electroschematics.com/9540/arduino-fan-speed-controlled-temperature
//var regulateFan = function(){
//    if(temp < tempMin) { 
//        // if temp is lower than minimum temp fanSpeed = 0; 
//        // fan is not spinning 
//        digitalWrite(fan, LOW); 
//    }
//    if((temp >= tempMin) && (temp <= tempMax)) { 
//        // if temperature is higher than minimum temp 
//        fanSpeed = map(temp, tempMin, tempMax, 32, 255); 
//        // the actual speed of fan 
//        fanLCD = map(temp, tempMin, tempMax, 0, 100); 
//        // speed of fan to display on LCD 
//        analogWrite(fan, fanSpeed); 
//        // spin the fan at the fanSpeed speed 
//    } if(temp > tempMax) {        
//        // if temp is higher than tempMax
//         digitalWrite(led, HIGH);  // turn on led 
//       } else {                    // else turn of led
//         digitalWrite(led, LOW); 
//       }
//}