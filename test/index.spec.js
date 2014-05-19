'use strict';

var test = require('tape');
var mockTimeout = require('../');

test('mockTimeout', function(t) {
  t.equal(typeof mockTimeout.setTimeout, 'function', 'setTimeout should exist');
  t.equal(typeof mockTimeout.tick, 'function', 'tick should exist');
  t.ok(Object.isFrozen(mockTimeout), 'mockTimeout should be frozen');

  test('setTimeout', function(t) {
    t.plan(1);
    mockTimeout.setTimeout(function() {
      t.ok(true, 'timeout called the callback');
    }, 10);

    mockTimeout.setTimeout(function() {
      t.ok(false, 'timeout should not called the callback');
    }, 20);
    mockTimeout.tick(10);
  });
  t.end();
});
