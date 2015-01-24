var Walker = require('./walker');

var Token = require('../ast/token');
var Identifier = require('../tokens/identifier');
var Open = require('../tokens/open');
var Close = require('../tokens/close');

var CONTROL_BLOCKS = [
  'if', 'for', 'while', 'switch'
]

function isControl(t){
  return t instanceof Identifier && CONTROL_BLOCKS.indexOf(t.ident) > -1
}

function lineControl(line){
  if(isControl(line[0].token)){
    line.splice(2, 0, new Token(new Open('(')));
    line.push(new Token(new Close(')')));
  }
};

module.exports = new Walker({
  Expression: function(expression){
    lineControl(expression.nodes);
  },
});
