var helpers = require('../helpers');

var noop = function(){};
function Walker(steps){
  Object.keys(helpers.Nodes()).forEach(function(Node){
    steps[Node] = steps[Node] || noop;
  });

  this.steps = steps;
}
Walker.prototype = Object.create({
  _walk: function(p){
    if( p instanceof Array ){
      for(var i = 0; i < p.length; i++){
        this.walk(p[i]);
      }
    } else {
      this.walk(p);
    }
  },

  walk: function(part){
    var Nodes = Object.keys(helpers.Nodes());
    for(var i = 0 ; i < Nodes.length ; i++){
      if(part.constructor.name === Nodes[i]){
        this[Nodes[i]](part);
      }
    }
  },

  Program: function(program){
    this.steps.Program(program);
    this._walk(program.statements);
  },

  Statement: function(statement){
    this.steps.Statement(statement);
    this._walk(statement.expression);
    if(statement.block){
      this._walk(statement.block);
    }
  },

  Block: function(block){
    this.steps.Block(block);
    this._walk(block.statements);
  },

  Expression: function(expression){
    debugger
    this.steps.Expression(expression);
    this._walk(expression.nodes);
  },

  Token: function(token){
    this.steps.Token(token);
  }
});

module.exports = Walker;
