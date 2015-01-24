var NewLine = require('../tokens/newline');
var Block = require('./block');
var Token = require('./token');

function Statement(nodes, block, newline){
  this.nodes = nodes;
  this.block = block;
  this.newline = newline;
}

Statement.prototype.toString = function(){
  var s = 'Statement(';
  var toS = function(_){return _.toString();};
  s += this.nodes.map(toS).join('');
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
  var toC = function(_){return _.toCode();};
  s += this.nodes.map(toC).join('');
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
  var nodes = [];
  while(!(current instanceof NewLine)){
    if(Block.match(current, parser)){
      return new Statement(nodes, Block.consume(current, parser));
    } else {
      [
        // require('./array'),
        // require('./object'),
        // require('./callable'),
        Token
      ].forEach(function(ctor){
        if(ctor.match(current, parser)){
          nodes.push(ctor.consume(current, parser));
        }
      });
    }
    if(parser.hasNext()){
      current = parser.next();
    } else {
      throw new Error('Incomplete Statement');
    }
  }
  return new Statement([], null, current);
};

module.exports = Statement;
