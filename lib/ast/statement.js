var NewLine = require('../tokens/newline');
var Block = require('./block');
var Token = require('./token');
var Expression = require('./expression');
var helpers = require('../helpers');

function Statement(expression, block, newline){
  this.expression = expression;
  this.block = block;
  this.newline = newline;
}

Statement.prototype.toString = function(){
  var s = 'Statement(';
  s += this.expression.toString();
  if(this.block){
    s += this.block.toString();
  }
  s += ')'
  if (this.newline){
    s += this.newline.toString();
  }
  return s;
}

Statement.prototype.toCode = function(){
  var s = '';
  if(!this.expression){
    return s;
  }
  s += this.expression.toCode();
  if(this.block){
    s += this.block.toCode();
  } else {
    var last = this.expression.nodes[this.expression.nodes.length - 1];
    if(last.token.block !== '}'){
      s += ';';
    }
    s += this.newline.toCode();
  }
  return s;
}

Statement.match = function(current, parser){
  return true;
};

Statement.consume = function(current, parser){
  var expression = null, block = null, nl = null;

  do {
    if(Expression.match(current, parser)){
      expression = Expression.consume(current, parser);
      current = parser.peek();
    }
  } while(!helpers.isLineBreak(current));

  var hasNext = parser.hasNext();
  if(hasNext && Block.match(current, parser)){
    block = Block.consume(parser.next(), parser);
    current = parser.peek();
  }

  if(current instanceof NewLine){
    nl = Token.consume(current);
  } else {
    nl = new NewLine('');
  }
  return new Statement(expression, block, nl);
};

module.exports = Statement;
