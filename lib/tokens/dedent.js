function Dedent(space, depth, position){
  this.space = space;
  this.depth = depth;
  this.position = position;
}
Dedent.prototype.toString = function(){
  return "DEDENT(" + this.depth + ")";
}
Dedent.prototype.toCode = function(){
  return '';
}
module.exports = Dedent;
