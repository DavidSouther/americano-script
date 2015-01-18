function Block(parts, depth, prefix){
  this.parts = parts;
  this.depth = depth;
  this.prefix = prefix;
}

Block.prototype.toString = function(){
  var s = "BLOCK(";
  this.parts.forEach(function(part){
    s += part.toString();
  });
  s += ')\n';
  return s;
};

Block.prototype.toCode = function(){
  var s = " {";
  this.parts.forEach(function(part){
    s += part.toCode();
  });
  s = s.replace(/\n+$/, '\n');
  for(var i = 0; i < this.depth; i++){
    s += this.prefix;
  }
  s += '}\n';
  return s;
};

module.exports = Block;
