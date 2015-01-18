var Program = require('../ast/program');
var Block = require('../ast/block');
var Line = require('../ast/line');

var noop = function(){};
function Walker(steps){
  steps.walkProgram = steps.walkProgram || noop;
  steps.walkBlock = steps.walkBlock || noop;
  steps.walkLine = steps.walkLine || noop;
  steps.walkToken = steps.walkToken || noop;
  this.steps = steps;
}
Walker.prototype = Object.create({
  _walk: function(p){
    for(var i = 0; i < p.length; i++){
      this.walk(p[i]);
    }
  },
  walk: function(part){
    if(part instanceof Program){
      this.walkProgram(part);
    } else if (part instanceof Block){
      this.walkBlock(part);
    } else if (part instanceof Line) {
      this.walkLine(part);
    } else {
      this.walkToken(part);
    }
  },

  walkProgram: function(program){
    this.steps.walkProgram(program);
    this._walk(program.statements);
  },

  walkBlock: function(block){
    this.steps.walkBlock(block);
    this._walk(block.parts);
  },

  walkLine: function(line){
    this.steps.walkLine(line);
    this._walk(line.tokens);
  },

  walkToken: function(token){
    this.steps.walkToken(token);
  }
});

module.exports = Walker;
