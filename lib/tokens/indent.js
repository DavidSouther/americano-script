function Indent(space, depth, position){
  this.space = space;
  this.depth = depth;
  this.position = position;
}
Indent.prototype.toString = function(){
  return "INDENT(" + this.depth + ")";
}
module.exports = Indent;
