var helpers = require('../helpers');
var Token = require('../ast/token');

function Expression(nodes){
  this.nodes = nodes;
}
Expression.prototype.toCode = function(){
  return this.nodes.map(helpers.toC).join('');
}
Expression.prototype.toString = function(){
  var s = 'EXPR(';
  s += this.nodes.map(helpers.toS).join('');
  return s + ')'
}

Expression.match = function(current){
  return !helpers.isLineBreak(current);
}

Expression.consume = function(current, parser){
  var stack = [new Token(current)];
  while (parser.hasNext() && Expression.match(parser.peek())) {
    current = parser.next();
    stack.push(new Token(current));
  }
  return new Expression(stack);
}


// if(ArrayTok.match(current, parser)){
//   nodes.push(ctor.consume(current, parser));
// } else if(ObjectTok.match(current, parser)){
//   nodes.push(ObjectTok.consume(current, parser));
// } else if(Callable.match(current, parser)){
//   nodes.push(Callable.consume(current, parser));
// } else

module.exports = Expression;
