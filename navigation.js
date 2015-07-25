'use strict';

var Cylon = require('cylon'),
    // install with `npm install keypress`
    keypress = require('keypress');

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

Cylon
  .robot()
  .connection('sphero', {adaptor: 'sphero', port: 'COM3'}) // or 4
  .device('sphero', {driver: 'sphero'})
  .on('error', console.log)
  .on('ready', function(bot) {
    // defining some basic colors
    // find more @ http://cylonjs.com/documentation/drivers/sphero/#SpheroColors
    var colorGreen = 0x008000,
        colorRed = 0xFF0000,
        colorBlue = 0x0000FF,
        colorOrange = 0xFFA500,
        colorYellow = 0xFFFF00,
        colorPurple = 0x800080,
        // set up a variable to track the current speed of the sphero
        speed = 90,
        mainProg = null;

    // Lets start off the sphero with the color green
    bot.sphero.color('green');
    console.log('Setting up Collision Detection...');
    bot.sphero.detectCollisions();

    // define what we do on a data streaming event
    // ADVANCED!
    bot.sphero.on('dataStreaming', function(data) {
      // ======== <ADVANCED:YOUR CODE BELOW HERE?> ========
      // console.log('data:');
      // console.dir(data);
      // ======== <ADVANCED:YOUR CODE ABOVE HERE?> ========
    });

    // To detect locator, accelOne and velocity from the sphero
    // we use setDataStreaming.
    // sphero API data sources for locator info are as follows:
    // ["locator", "accelOne", "velocity"]
    // It is also possible to pass an opts object to setDataStreaming():
    var opts = {
      // n: int, divisor of the max sampling rate, 400 hz/s
      // n = 40 means 400/40 = 10 data samples per second,
      // n = 200 means 400/200 = 2 data samples per second
      n: 200,
      // m: int, number of data packets buffered before passing to the stream
      // m = 10 means each time you get data it will contain 10 data packets
      // m = 1 is usually best for real time data readings.
      m: 1,
      // pcnt: 1 -255, how many packets to send.
      // pcnt = 0 means unlimited data Streaming
      // pcnt = 10 means stop after 10 data packets
      pcnt: 0,
      dataSources: ["locator", "accelOne", "velocity"]
    };

    bot.sphero.setDataStreaming(opts);

    // listen for the "keypress" event
    process.stdin.on('keypress', function (ch, key) {
      if (key && key.ctrl && key.name === 'c') { // 'ctrl+c'
        console.log('Command: Quit Program');
        // Disconnect from bot
        process.exit();
      }
      if (key && !key.ctrl && key.name === 'c') { // 'c' but not 'ctrl+c'
        console.log('Command: Starting Calibration...');
        bot.sphero.startCalibration();
      }
      if (key && key.name === 'f') {
        console.log('Command: Calibration Finished');
        bot.sphero.finishCalibration();
      }

      // Manual direction WASD
      if (key && key.name === 'w') {
        console.log('Command: Move forward');
        // ======== <YOUR CODE BELOW HERE> ========
        // uncomment the line below
        // bot.sphero.roll(speed, 0); // this command will instruct the sphero to roll at speed in forward direction
        // ======== <YOUR CODE ABOVE HERE> ========
      }
      if (key && key.name === 'a') {
        console.log('Command: Move left');
        // ======== <YOUR CODE BELOW HERE> ========
        // uncomment the line below
        // bot.sphero.roll(speed, 270); // this command will instruct the sphero to roll at speed in left direction
        // ======== <YOUR CODE ABOVE HERE> ========
      }
      if (key && key.name === 's') {
        console.log('Command: Move backwards');
        // ======== <YOUR CODE BELOW HERE> ========
        // uncomment the line below
        // bot.sphero.roll(speed, 180); // this command will instruct the sphero to roll at speed in backwards direction
        // ======== <YOUR CODE ABOVE HERE> ========
      }
      if (key && key.name === 'd') {
        console.log('Command: Move right');
        // ======== <YOUR CODE BELOW HERE> ========
        // uncomment the line below
        // bot.sphero.roll(speed, 90); // this command will instruct the sphero to roll at speed in right direction
        // ======== <YOUR CODE ABOVE HERE> ========
      }

      // SPEED
      if (key && key.name === 'i') {
        if (90 >= speed) {
          speed = speed + 10;
        }
        console.log('Speed now increased to: ', speed);
      }
      if (key && key.name === 'k') {
        if (10 <= speed) {
          speed = speed - 10;
        }
        console.log('Speed now decreased to: ', speed);
      }

      // COLOR
      if (key && key.name === 't') {
        console.log('Command: Random Color');
        bot.sphero.randomColor(); // this command will instruct the sphero to change to a random color
      }

      // STOP the robot
      if (key && key.name === 'x') {
        console.log('Command: Stop');
        clearInterval(mainProg);
        bot.sphero.stop(); // this command will instruct the sphero to stop rolling
      }

      // ======== SPACE BAR MAIN PROGRAM ========
      if (key && key.name === 'space') {
        console.log('Command: Main Program');
        mainProg = every((1).second(), function() {
          // ======== <YOUR CODE BELOW HERE> ========

          // ======== <YOUR CODE ABOVE HERE> ========
        });
      }
    });


    // This defines what happens when you hit or tap the sphero
    bot.sphero.on('collision', function() {
      console.log('Collision!');
      // here we set the sphero to turn red
      bot.sphero.color('red');
      // here is where you want to tell your sphero what to do if it hits something
      // If you were sphero, what would you do if you hit something?
      // ======== <YOUR CODE BELOW HERE> ========

      // ======== <YOUR CODE ABOVE HERE> ========
    });


    console.log('// HINTS:');
    console.log('//');
    console.log('// c - calibrate');
    console.log('// f - finish calibration');
    console.log('// i - increase the \'speed\' variable');
    console.log('// k - decrease the \'speed\' variable');
    console.log('// spacebar - start main program');
    console.log('// ctrl+c - stop the entire program');

    // SetBackLED turns on the tail LED of the sphero that helps
    // identify the direction the sphero is heading.
    // accepts a param with a value from 0 to 255, led brightness.
    bot.sphero.setBackLed(192);

    // This puts the Sphero into 'calibration mode' by turning on
    // the tail LED and turning off the auto-stablization.
    bot.sphero.startCalibration();
    console.log('NOTE: You can now manually turn the Sphero to so the tail LED is ' +
                'pointed to the rear of the direction in which you want the Sphero to go.');
  });

// This enables us to capture key presses
process.stdin.setRawMode(true);
process.stdin.resume();

// Lets start our program!
Cylon.start();


// HINTS:
//
// c - calibrate
// f - finish calibration
// i - increase the 'speed' variable
// k - decrease the 'speed' variable
// spacebar - start main program
// ctrl+c - stop the entire program
// t - random color
//
// bot.sphero.roll(60, Math.floor(Math.random() * 360)); // this command will instruct the sphero to roll at 60% speed in a random direction
// bot.sphero.roll(speed, 0); // this command will instruct the sphero to roll at speed in forward direction
// bot.sphero.roll(speed, 90); // this command will instruct the sphero to roll at speed in a right direction
// bot.sphero.roll(speed, 180); // this command will instruct the sphero to roll at speed in a reverse direction
// bot.sphero.roll(speed, 270); // this command will instruct the sphero to roll at speed in a left direction
// bot.sphero.stop(); // this command tells the sphero to stop in place
// clearInterval(mainProg); // this will stop the main program from running
