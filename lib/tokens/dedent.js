function Dedent(space, depth, position){
  this.space = space;
  this.depth = depth;
  this.position = position;
}
Dedent.prototype.toString = function(){
  return "DEDENT(" + this.depth + ")";
}

module.exports = Dedent;
