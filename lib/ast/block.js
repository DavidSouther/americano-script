var helpers = require('../helpers');
var Indent = require('../tokens/indent');
var Dedent = require('../tokens/dedent');

function Block(statements, depth, prefix){
  this.statements = statements;
  this.depth = depth;
  this.space = prefix;
}

Block.prototype.toString = function(){
  var s = "BLOCK(";
  s += this.statements.map(helpers.toS);
  s += ')\n';
  return s;
};

Block.prototype.toCode = function(){
  var s = "", d = this.depth, p = this.space;

  s += " {\n";
  s += this.statements.map(toCSpace(d)).join('');
  s += prespace(d - 1)('}\n');

  return s;

  function toCSpace(depth){
    return function(statement){
      if(statement.block){
        return statement.toCode();
      } else {
        return prespace(depth)(statement.toCode());
      }
    }
  }


  function prespace(d){
    return function(l){
      // return '' + d + l;
      for(var i = 0; i < d; i++){
        l = p + l;
      }
      return l;
    }
  }
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
      return new Block(statements, depth, indent);
    } else {
      statements.push(Statement.consume(current, parser));
    }
  }
  return new Block(statements, depth, indent);
};

module.exports = Block;
