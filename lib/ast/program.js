var helpers = require('../helpers');
var Statement = require('./statement');

function Program(statements){
  this.statements = statements;
}
Program.prototype.toCode = function(){
  return this.statements.map(helpers.toC).join('');
}

Program.consume = function(tokenizer){
  var stack = [];
  while(tokenizer.hasNext()){
    stack.push(Statement.consume(tokenizer.next(), tokenizer));
  }
  return new Program(stack);
}

module.exports = Program;
