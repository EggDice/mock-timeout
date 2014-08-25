'use strict';

var _ = require('lodash');
var test = require('tape');
var mockTimeout = require('../');

function genAssertCalled(t, shouldCall) {
  return function() {
    t.ok(shouldCall,
        'timeout ' + (shouldCall ? '' : 'should not ') + 'called the callback');
  };
}

function genAssertCallOnce(t) {
  var called = false;
  return function() {
    t.ok(!called, called ? 'called more than once' : 'called once');
    called = true;
  };
}

function methodExist(t, name) {
  t.equal(typeof mockTimeout[name], 'function', name + ' should exist');
}

test('mockTimeout', function(t) {
  [
    'setTimeout', 'setInterval', 'tick', 'reset',
    'clearTimeout', 'clearInterval'
  ].forEach(_.partial(methodExist, t));
  t.ok(Object.isFrozen(mockTimeout), 'mockTimeout should be frozen');

  test('reset', function(t) {
    mockTimeout.setTimeout(genAssertCalled(t, false), 10);
    mockTimeout.reset();
    mockTimeout.tick(10);
    t.end();
  });

  test('setTimeout', function(t) {
    t.plan(2);
    mockTimeout.reset();
    mockTimeout.setTimeout(genAssertCalled(t, true), 10);
    mockTimeout.setTimeout(genAssertCalled(t, false), 20);
    mockTimeout.tick(10);

    mockTimeout.reset();
    mockTimeout.setTimeout(genAssertCallOnce(t), 5);
    mockTimeout.tick(10);
    mockTimeout.tick(10);
  });

  test('setInterval', function(t) {
    t.plan(15);
    mockTimeout.reset();
    mockTimeout.setInterval(genAssertCalled(t, true), 10);
    mockTimeout.tick(40);

    mockTimeout.reset();
    mockTimeout.tick(5);
    mockTimeout.setInterval(genAssertCalled(t, true), 10);
    mockTimeout.tick(35);


    mockTimeout.reset();
    mockTimeout.tick(5);
    mockTimeout.setInterval(genAssertCalled(t, true), 10);
    mockTimeout.tick(40);


    mockTimeout.reset();
    mockTimeout.tick(5);
    mockTimeout.setInterval(genAssertCalled(t, true), 10);
    mockTimeout.tick(40);
  });

  test('clearTimeout', function(t) {
    mockTimeout.reset();
    var timeout = mockTimeout.setTimeout(genAssertCalled(t, false), 5);
    mockTimeout.clearTimeout(timeout);
    mockTimeout.tick(5);
    t.end();
  });

  test('clearInterval', function(t) {
    mockTimeout.reset();
    var timeout = mockTimeout.setInterval(genAssertCalled(t, false), 5);
    mockTimeout.clearInterval(timeout);
    mockTimeout.tick(20);
    t.end();
  });
  t.end();
});

