function Indent(space, position){
  this.space = space;
  this.depth = this.space.length;
  this.position = position;
}
Indent.prototype.toString = function(){
  return "INDENT(" + this.depth + ")";
}
module.exports = Indent;
