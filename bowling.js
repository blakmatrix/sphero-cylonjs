// Instructions:
//
// To complete this exercise you will need to write some code
// 1. find the lines that look like "// ======== <YOUR CODE BELOW HERE> ========"
// 2. read the comments just above that line for directions
// 3. write your code
// 4. when you are finished editing, run the program
// 5. If you need help, don't be afraid to ask for it.
//
// Learn More:
// http://cylonjs.com/documentation/drivers/sphero/
// http://cylonjs.com/documentation/helpers/
'use strict';

var Cylon = require('cylon'),
    // install with `npm install keypress`
    keypress = require('keypress');

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

Cylon
  .robot()
  // be sure to change the XXX to your unique code
  .connection('sphero', {adaptor: 'sphero', port: 'COM3'}) // or COM4
  .device('sphero', {driver: 'sphero'})
  .on('error', console.log)
  .on('ready', function(bot) {
    // variable declarations
    var speed = 200, // speed will keep track of the number we set it to
        mainProg = null; // This is used to bind to a interval declaration,
                         // we do this so we can clear it later

    // Lets start off the sphero with the color green
    bot.sphero.color('green');
    console.log('Setting up Collision Detection...');
    bot.sphero.detectCollisions();

    // SetBackLED turns on the tail LED of the sphero that helps
    // identify the direction the sphero is heading.
    // accepts a param with a value from 0 to 255, led brightness.
    bot.sphero.setBackLed(192);

    // This puts the Sphero into 'calibration mode' by turning on
    // the tail LED and turning off the auto-stablization.
    // forward = away from the blue light
    bot.sphero.startCalibration();
    console.log('NOTE: You can now manually turn the Sphero to so the tail LED is ' +
                'pointed to the rear of the direction in which you want the Sphero to go.');

    // listen for the "keypress" event
    process.stdin.on('keypress', function (ch, key) {
      if (key && key.ctrl && key.name === 'c') { //'ctrl+c' (terminate program)
        console.log('Command: Quit Program');
        // Disconnect from bot
        clearInterval(mainProg); // make sure mainProg isn't running anymore
        bot.disconnect(function() {
          // exit program when disconnected
          process.exit(0);
        });
      }

      // CALIBRATION
      // forward = away from the blue light
      if (key && !key.ctrl && key.name === 'c') { // 'c' but not 'ctrl+c'
        console.log('Command: Starting Calibration...');
        bot.sphero.startCalibration();
      }
      if (key && key.name === 'f') {
        console.log('Command: Calibration Finished');
        bot.sphero.finishCalibration();
      }

      // SPEED
      if (key && key.name === 'i') {
        if (490 >= speed) { // we want to make sure we don't go past 100
          speed = speed + 10;
        }
        console.log('Speed now increased to: ', speed);
      }
      if (key && key.name === 'k') {
        if (10 <= speed) { // want to make sure we don't go below 0
          speed = speed - 10;
        }
        console.log('Speed now decreased to: ', speed);
      }

      // ======== SPACE BAR - MAIN PROGRAM ========
      if (key && key.name === 'space') {
        console.log('Command: Main Program');

        // here we assign mainProg to an interval that runs every 1 second
        mainProg = every((1).second(), function() {
        // Make your bot roll fast enough and in the right direction to
        // knock over some pins!
        // ======== <YOUR CODE BELOW HERE> ========
        // TODO: uncomment the line below
        // bot.sphero.roll(speed, 0); // this command will instruct the sphero to roll at speed in forward direction       
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
      // TODO: uncomment the line below
      // bot.sphero.roll(speed, 180); // this command will instruct the sphero to roll at speed in a reverse direction
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
//
// bot.sphero.roll(60, Math.floor(Math.random() * 360)); // this command will instruct the sphero to roll at 60% speed in a random direction
// bot.sphero.roll(speed, 0); // this command will instruct the sphero to roll at speed in forward direction
// bot.sphero.roll(speed, 90); // this command will instruct the sphero to roll at speed in a right direction
// bot.sphero.roll(speed, 180); // this command will instruct the sphero to roll at speed in a reverse direction
// bot.sphero.roll(speed, 270); // this command will instruct the sphero to roll at speed in a left direction
// bot.sphero.stop(); // this command tells the sphero to stop in place
// clearInterval(mainProg); // this will stop the main program from running
