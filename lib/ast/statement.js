var NewLine = require('../tokens/newline');
var Block = require('./block');
var Token = require('./token');
var Expression = require('./expression')

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
  s += this.expression.toCode();
  if(this.block){
    s += this.block.toCode();
  } else {
    s += ';' + this.newline.toCode();
  }
  return s;
}

Statement.match = function(current, parser){
  return true;
};

Statement.consume = function(current, parser){
  var expression = null, block = null, nl = null;
  while(!(current instanceof NewLine)){
    if(Expression.match(current, parser)){
      expression = Expression.consume(current, parser);
    }
    if(parser.hasNext()) {
      current = parser.next();
      if(Block.match(current, parser)){
        block = Block.consume(current, parser);
        if(parser.hasNext()) {
          current = parser.next();
        } else {
          break;
        }
      }
    }
  }
  nl = Token.consume(current);
  return new Statement(expression, block, nl);
};

module.exports = Statement;
