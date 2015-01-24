var Open = require('../tokens/open');

function Line(tokens){
  this.tokens = tokens;
}

Line.prototype.isBlockOpen = function(){
  var last = this.tokens[this.tokens.length - 1];
  if(last instanceof Open){
    return false;
  }
  return true;
};

Line.prototype.toString = function(){
  var s = "LINE(";
  this.tokens.forEach(function(token){
    s += token.toString() + ' ';
  });
  s += ")\n"
  return s;
}
Line.prototype.toCode = function(){
  var s = "";
  this.tokens.forEach(function(token){
    s += token.toCode();
  });
  return s;
};

module.exports = Line;
