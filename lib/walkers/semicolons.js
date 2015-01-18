var Walker = require('./walker');

var Block = require('../ast/block');
var Line = require('../ast/line');
var Operator = require('../tokens/operator');
var Close = require('../tokens/close');

addSemis = function(p){
  for(var i = p.length - 2; i >= 0; i--){
    if(p[i] instanceof Line && !(p[i+1] instanceof Block)){
      var line = p[i].tokens;
      var last = line[line.length - 1];
      if(!(last instanceof Close && last.block === '}')){
        line.push(new Operator(';'));
      }
    }
  }
};

module.exports = new Walker({
  walkProgram: function(program){
    addSemis(program.statements);
  },

  walkBlock: function(block){
    addSemis(block.parts);
  }
});
