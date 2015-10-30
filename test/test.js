'use strict';

var expect = require('chai').expect;
var greet = require(__dirname + '/../lib/greet');
var greet2 = require(__dirname + '/../lib/greet2');

describe('the greet function', function() {
 it('should return hello world', function() {
  expect(greet()).to.eql('hello world');
 });
 it('should solve all the world\'s problems');
});

describe('the greet 2 object', function() {
 it('should greet someone by name', function() {
  expect(greet2.greet('test')).to.eql('hello test');
 });
});

describe('the command line utility', function() {
  it('should greet someone by the name they enter', function() {
    expect(greet2.greet(process.argv[2])).to.eql('hello ' + process.argv[2]);
  });
});
