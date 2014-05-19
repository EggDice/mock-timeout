'use strict';

var _ = require('lodash');

function createClock() {
  var clock = 0;
  var savedCallbacks = {};
  var callbackNum = 0;

  return Object.freeze({
    reset: function() {
      clock = 0;
      savedCallbacks = {};
      callbackNum = 0;
    },
    setTimeout: function(cb, delay) {
      savedCallbacks[callbackNum++] = {
        callback: cb,
        startTime: clock,
        delay: delay
      };
    },
    tick: function(passedTime) {
      clock += passedTime;
      _(savedCallbacks).filter(function(savedCallback) {
        return (savedCallback.startTime + savedCallback.delay) <= clock;
      }).forEach(function(savedCallbacks) {
        savedCallbacks.callback();
      });
    }
  });
}

module.exports = createClock();
