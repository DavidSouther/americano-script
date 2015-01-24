var Open = require('../tokens/open');
var Close = require('../tokens/close');

function ArrayNode(open, statements, close){
  this.open = open;
  this.statements = statements;
  this.close = close;
}

ArrayNode.prototype.toString = function(){
  var s = 'Array(';
  var toS = function(_){return _.toString();};
  s += this.statements.map(toS).join('');
  s += ')';
  return s;
}

ArrayNode.prototype.toCode = function(){
  var s = '[';
  var toC = function(_){return _.toCode();};
  s += this.statements.map(toC).join('');
  s += ']';
  return s;
}

ArrayNode.match = function(current, parser){
  return current instanceof Open && current.block === '[';
};

ArrayNode.consume = function(current, parser){
  var Statement = require('./statement');
  var open = current;
  var statements = [];
  while(parser.hasNext()){
    current = parser.next();
    if(current instanceof Close && current.block === ']'){
      return new ArrayNode(open, statements, current);
    } else {
      statements.push(Statement.consume(current, parser));
    }
  }
  throw new Error('Could not parse ArrayNode');
};

module.exports = ArrayNode;
