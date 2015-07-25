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
  // NOTE: be sure to change the XXX to your unique code
  .connection('sphero', {adaptor: 'sphero', port: 'COM3'})
  .device('sphero', {driver: 'sphero'})
  .on('error', console.log)
  .on('ready', function(bot) {
    // variable declarations
    var max = 0,
        changingColor = false;

    // To detect locator, accelOne and velocity from the sphero
    // we use setDataStreaming.
    // sphero API data sources for locator info are as follows:
    // ["locator", "accelOne", "velocity"]
    // It is also possible to pass an opts object to setDataStreaming():
    bot.sphero.setDataStreaming({
      // n: int, divisor of the max sampling rate, 400 hz/s
      // n = 40 means 400/40 = 10 data samples per second,
      // n = 200 means 400/200 = 2 data samples per second
      n: 40, 
      // m: int, number of data packets buffered before passing to the stream
      // m = 10 means each time you get data it will contain 10 data packets
      // m = 1 is usually best for real time data readings.
      m: 1,
      // pcnt: 1 -255, how many packets to send.
      // pcnt = 0 means unlimited data Streaming
      // pcnt = 10 means stop after 10 data packets
      pcnt: 0,
      // available: ["locator", "accelOne", "velocity"]
      dataSources: ['velocity']
    });

    // Now to declare what we do when we get data
    bot.sphero.on('dataStreaming', function(data) {
      if (!changingColor) { // prevent setting values if currently changing colors
        var x = Math.abs(data.xVelocity.value),
            y = Math.abs(data.yVelocity.value);

        if (x > max) {
          max = x;
        }

        if (y > max) {
          max = y;
        }
      }
    });
    console.log('// HINTS:');
    console.log('//');
    console.log('// c - calibrate');
    console.log('// f - finish calibration');
    console.log('// i - increase the \'speed\' variable');
    console.log('// k - decrease the \'speed\' variable');
    console.log('// spacebar - start main program');
    console.log('// ctrl+c - stop the entire program');
    every((0.3).second(), function() {
      changingColor = true;

      // You can detect values of velocity from 10 - 450
      // fairly well. You should try to use the variable "max"
      // and change spheros colors at least 7 times by adding more 'else if'
      // statements.
      // The higher the velocity, the color should change
      // You must shake your sphero to detect changes in
      // velocity.
      // ======== <YOUR CODE BELOW HERE> ========
      // uncomment the lines beow to activate different else blocks
      if (max < 10) {
        bot.sphero.color("white");
      } else if (max < 100) {
        bot.sphero.color("lightyellow");
      } else if (max < 150) {
        bot.sphero.color("yellow");
      } else if (max < 250) {
        bot.sphero.color("orange");
      } else if (max < 350) {
        bot.sphero.color("orangered");
      } else if (max < 450) {
        bot.sphero.color("red");
      } else {
        bot.sphero.color("darkred");
      }

      // ======== <YOUR CODE ABOVE HERE> ========

      // reset items
      max = 0;
      changingColor = false;
    });
  });

// Lets start our program!
Cylon.start();

// HINTS:
//
// Using colors that flow from one to the other in hue often work great
// max < [10, 100, 150, 250, 350, 450, and everything else] is a decent starting point 
// bot.sphero.color('red'); is the same as bot.sphero.color(0xFF0000);
