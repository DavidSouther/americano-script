var Walker = require('./walker');

var Block = require('../ast/block');
var Line = require('../ast/line');
var Operator = require('../tokens/operator');
var Identifier = require('../tokens/identifier');
var Open = require('../tokens/open');
var Close = require('../tokens/close');

var CONTROL_BLOCKS = [
  'if', 'for', 'while', 'switch'
]

lineControl = function(p){
  for(var i = 0; i < p.length; i++){
    if(p[i] instanceof Line && p[i+1] instanceof Block){
      var line = p[i].tokens;
      if(line[0] instanceof Identifier && CONTROL_BLOCKS.indexOf(line[0].ident) > -1){
        line.splice(2, 0, new Open('('));
        line.push(new Close(')'));
      }
    }
  }
};

module.exports = new Walker({
  walkProgram: function(program){
    lineControl(program.statements);
  },

  walkBlock: function(block){
    lineControl(block.parts);
  }
});
