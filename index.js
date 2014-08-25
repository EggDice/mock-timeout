'use strict';

var _ = require('lodash');

function createMock() {
  var clock, savedCallbacks, callbackNum;

  function removeCallback(id) {
    delete savedCallbacks[id];
  }

  function reset() {
    clock = 0;
    savedCallbacks = {};
    callbackNum = 0;
  }

  function addCallback(isLooping) {
    return function(cb, delay) {
      savedCallbacks[callbackNum] = {
        isLooping: isLooping,
        fn: cb,
        startTime: clock,
        delay: delay
      };
      return callbackNum++;
    };
  }

  function tick(passedTime) {
    var interval = {
      from: clock,
      to: clock += passedTime
    };
    _(savedCallbacks).
      filter(selectAffectedCallbacks(interval)).
      forEach(callCallback(interval));
  }

  function selectAffectedCallbacks(timeInterval) {
    return function(callback) {
      var fireTime = callback.startTime + callback.delay;
      return callback.isLooping || isInInterval(fireTime, timeInterval);
    };
  }

  function isInInterval(point, interval) {
    return point > interval.from && point <= interval.to;
  }

  function callCallback(timeInterval) {
    return function (callback) {
      _.times(
        callback.isLooping ?
          getTimesTheIntervalShouldCalled(callback, timeInterval) : 1,
        callback.fn
      );
    };
  }

  function getTimesTheIntervalShouldCalled(callback, timeInterval) {
    var elapsedTimeSinceStart = timeInterval.from - callback.startTime;
    var elapsedTimeSinceLastCall = elapsedTimeSinceStart % callback.delay;
    return Math.floor((duration(timeInterval) - elapsedTimeSinceLastCall) /
        callback.delay);
  }

  function duration(interval) {
    return interval.to - interval.from;
  }

  reset();

  return Object.freeze({
    reset: reset,
    setTimeout: addCallback(false),
    clearTimeout: removeCallback,
    setInterval: addCallback(true),
    clearInterval: removeCallback,
    tick: tick
  });
}

module.exports = createMock();

