var Tokenizer = require('./tokenizer');
var helpers = require('./helpers');

var Statement = helpers.Nodes.Statement;

function ParseError(stack, rest){
  this.message = "Parse Error";
  this.stack = stack;
  this.rest = rest;
}
ParseError.prototype.toString = function(){
  var toStr = function(_){return _.toString()};
  var s = this.stack.slice(this.stack.length - 6).map(toStr).join('');
  var r = this.rest.substring(0, 20);
  return "Failed to parse; last five tokens: " + s + "; next 20 chars: " + r;
};

function Grammar(){
  this.tokenizer = new Tokenizer();
}

Grammar.prototype = Object.create({
  reset: function(source){
    this.stack = [];
    this.blocks = [];
    this.partsInBlock = 0;
    this.tokenizer.reset(source);
  },

  hasNext: function(){
    return this.tokenizer.hasNext();
  },

  next: function(){
    return this.tokenizer.next();
  },

  parse: function(){
    while(this.tokenizer.hasNext()){
      this.stack.push(Statement.consume(this.tokenizer.next(), this));
    }
    return this.stack;
  }
});

module.exports = Grammar;
