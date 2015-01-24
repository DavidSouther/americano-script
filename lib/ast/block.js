var Indent = require('../tokens/indent');
var Dedent = require('../tokens/dedent');

function Block(statements, depth, prefix){
  this.statements = statements;
  this.depth = depth;
  this.space = prefix;
}

Block.prototype.toString = function(){
  var s = "BLOCK(";
  this.statements.forEach(function(part){
    s += part.toString();
  });
  s += ')\n';
  return s;
};

Block.prototype.toCode = function(){
  var s = "";
  if(this.depth > 0) {
    s += " {";
  }
  this.statements.forEach(function(statement){
    s += statement.toCode();
  });
  if(this.depth > 0) {
    s = s.replace(/\n+$/, '\n');
    for(var i = 0; i < this.depth; i++){
      s += this.prefix;
    }
    s += '}\n';
  }
  return s;
};


Block.match = function(current, parser){
  return current instanceof Indent;
};

Block.consume = function(current, parser){
  var Statement = require('./statement');
  var statements = [];
  var depth = current.depth;
  var indent = current.space;
  while(parser.hasNext()){
    current = parser.next();
    if(current instanceof Dedent){
      return new Block(statements, depth, this.space);
    } else {
      statements.push(Statement.consume(current, parser));
    }
  }
  return new Block(statements, depth, this.space);
  // throw new Error('Could not parse Block');
};

module.exports = Block;
