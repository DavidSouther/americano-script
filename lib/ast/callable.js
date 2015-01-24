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
  var toS = function(_){return _.toString();};
  s += this.statements.map(toS).join('');
  s += ')';
  return s;
}

Callable.prototype.toCode = function(){
  var s = '(';
  var toC = function(_){return _.toCode();};
  s += this.statements.map(toC).join('');
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
