'use strict';

var Cylon = require('cylon'),
    // install with `npm install keypress`
    keypress = require('keypress');

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

Cylon
  .robot()
  .connection('sphero', {adaptor: 'sphero', port: 'COM3'})
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
        speed = 40,
        mainProg = null;

    // Lets start off the sphero with the color green
    bot.sphero.color('green');
    console.log('Setting up Collision Detection...');
    bot.sphero.detectCollisions();

    // listen for the "keypress" event
    process.stdin.on('keypress', function (ch, key) {
      console.log('got "keypress"', key);
      if (key && key.ctrl && key.name === 'c') { //'ctrl+c'
        console.log('Command: Quit Program');
        // Disconnect from bot
        bot.disconnect(function() {
          // exit program when disconnected
          process.exit(0);
        });
      }
      if (key && !key.ctrl && key.name === 'c') { // 'c' but not 'ctrl+c'
        console.log('Command: Starting Calibration...');
        bot.sphero.startCalibration();
      }
      if (key && key.name === 'f') {
        console.log('Command: Calibration Finished');
        bot.sphero.finishCalibration();
      }

      // Manual direction
      if (key && key.name === 'w') {
        console.log('Command: Move forward');
        bot.sphero.roll(speed, 0); // this command will instruct the sphero to roll in forward direction
      }
      if (key && key.name === 'a') {
        console.log('Command: Move left');
        bot.sphero.roll(speed, 270); // this command will instruct the sphero to roll to the left
      }
      if (key && key.name === 's') {
        console.log('Command: Move backwards');
        bot.sphero.roll(speed, 180); // this command will instruct the sphero to roll backwards
      }
      if (key && key.name === 'd') {
        console.log('Command: Move right');
        bot.sphero.roll(speed, 90); // this command will instruct the sphero to roll to the right
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
          bot.sphero.roll(speed, Math.floor(Math.random() * 360));
        });
      }
    });


    // This defines what happens when you hit or tap the sphero
    bot.sphero.on('collision', function() {
      console.log('Collision!');
      // here we set the sphero to turn red
      bot.sphero.color('red');
      // here is where you want to tell your sphero what to do if it hits something
      // YOUR CODE BELOW HERE

      // YOUR CODE ABOVE HERE
    });




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


// bot.sphero.roll(60, Math.floor(Math.random() * 360)); // this command will instruct the sphero to roll at 60% speed in a random direction
// bot.sphero.roll(60, 0); // this command will instruct the sphero to roll at 60% speed in forward direction
// bot.sphero.roll(60, 90); // this command will instruct the sphero to roll at 60% speed in a right direction
// bot.sphero.roll(60, 180); // this command will instruct the sphero to roll at 60% speed in a reverse direction
// bot.sphero.roll(60, 270); // this command will instruct the sphero to roll at 60% speed in a left direction
// bot.sphero.stop(); // this command tells the sphero to stop in place
