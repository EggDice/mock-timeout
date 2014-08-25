# mock-timeout

Based on jasmine's `jasmine.clock()` mock of `setTimeout`, `setInterval`,
`clearTimeout`, and `clearInterval` functions.

[![Build Status](https://travis-ci.org/EggDice/mock-timeout.svg)](https://travis-ci.org/EggDice/mock-timeout)

## Methods

### tick(number)
Calls any registered callback are triggered when the clock is ticked forward 
via this function, which takes a number of milliseconds.

### reset()
Clears all callbacks and resets the clock to 0.

## Usage

```js
var mockTimeout = require('mock-timeout');

mockTimeout.setTimeout(function() {
  console.log('apple');    
}, 10);

var timeoutId = mockTimeout.setTimeout(function() {
  console.log('pear');    
}, 200);

var intervalId = mockTimeout.setInterval(function() {
  console.log('peach');  
}, 50);

mockTimeout.tick(100); // apple, peach, peach;

mockTimeout.clearTimeout(timeoutId);
mockTimeout.clearInterval(intervalId);

mockTimeout.tick(100); //
```

## Install
`npm install mock-timeout`

## License
MIT

