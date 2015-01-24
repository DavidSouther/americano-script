var helpers = require('../helpers');
var Open = require('../tokens/open');
var Close = require('../tokens/close');
var Statement = require('./statement');

function Callable(open, statements, close){
  this.open = open;
  this.statements = statements;
  this.close = close;
}

Callable.prototype.toString = function(){
  var s = 'Callable(';
  s += this.statements.map(helpers.toS).join('');
  s += ')';
  return s;
}

Callable.prototype.toCode = function(){
  var s = '(';
  s += this.statements.map(helpers.toC).join('');
  s += ')';
  return s;
}

Callable.match = function(current, parser){
  return current instanceof Open && current.block === '(';
};

Callable.consume = function(current, parser){
  var open = current;
  var statements = [];
  while(parser.hasNext()){
    current = parser.next();
    if(current instanceof Close && current.block === ')'){
      return new Callable(open, statements, current);
    } else {
      statements.push(Statement.consume(current, parser));
    }
  }
  throw new Error('Could not parse Callable');
};

module.exports = Callable;
