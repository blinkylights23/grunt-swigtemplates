'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.swigtemplates = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  index: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/index.html');
    var expected = grunt.file.read('test/expected/index.html');
    test.equal(actual, expected, 'index.html file created successfully.');

    test.done();
  },
  level1: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/level1/level1.html');
    var expected = grunt.file.read('test/expected/level1/level1.html');
    test.equal(actual, expected, 'level1/level1.html file created successfully.');

    test.done();
  },
};
