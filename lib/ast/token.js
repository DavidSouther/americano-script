var NewLine = require('../tokens/newline');
var Indent = require('../tokens/indent');
var Dedent = require('../tokens/dedent');
var Open = require('../tokens/open');
var Close = require('../tokens/close');

function Token(current){
  this.token = current;
}

Token.prototype.toString = function(){
  var s = 'Token(';
  s += this.token.toString();
  return s;
}

Token.prototype.toCode = function(){
  return this.token.toCode();
}

Token.match = function(current, parser){
  var section = current instanceof Open || current instanceof Close;
  var block = current instanceof Indent || current instanceof Dedent;
  return !(section || block);
};

Token.consume = function(current, parser){
  return new Token(current);
};

module.exports = Token;
